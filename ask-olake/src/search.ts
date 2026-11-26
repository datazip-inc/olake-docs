// Finds the chunks of the index that best match a question. Two searches run side by side and
// their rankings are merged: by keyword (BM25 over the full-text index), which finds exact names
// such as `max_threads`, and by meaning (embeddings), which finds a page that says the same in
// other words.

export type Hit = { url: string; title: string; text: string; score: number }

export type Options = {
  limit: number
  /** How much a word in the title counts against the same word in the text. */
  titleWeight: number
  /**
   * At most this many chunks of one page, so that one long page does not fill the results. With
   * only one, the model gets a page's introduction without the section that holds the steps.
   */
  perPage: number
  /** Score factor for a blog-style page (blog, compare, learn, customer stories) and for a repository file. The docs are 1. */
  blogWeight: number
  repoWeight: number
  /**
   * Score factor for a GitHub issue. An issue is one user's report, often of something long
   * fixed: it should come up for the error it describes, not for any question on its topic.
   */
  issueWeight: number
  /**
   * Score factor for the "X to Y" integration pages. There is one per source and query engine,
   * built from the same shared blocks, so without it they fill the results of any question
   * about a source and push out the connector's own page.
   */
  pairWeight: number
}
export const DEFAULTS: Options = {
  limit: 12,
  titleWeight: 3,
  perPage: 3,
  blogWeight: 0.6,
  repoWeight: 0.8,
  issueWeight: 0.6,
  pairWeight: 0.7
}

/** The Workers AI model that embeds the chunks (when the index is built) and each question. */
export const EMBEDDING_MODEL = '@cf/qwen/qwen3-embedding-0.6b'
/**
 * Of the 1,024 numbers the model gives per text, the first 384 are kept, as 8-bit integers. On
 * our test questions that finds the right page as often as the full vectors, in a tenth of the space.
 */
export const DIMS = 384
// A chunk scores 1 / (RANK_OFFSET + its rank) in each of the two rankings. 60 is the usual value.
const RANK_OFFSET = 60
const EMBED_TIMEOUT_MS = 3000

// Words that say nothing about the topic, the product name among them: it is on every page.
// The second line holds words that ask for a kind of answer ("explain briefly, in one sentence").
const STOPWORDS = new Set(
  (
    'a an and are as at be but by can do does for from how i if in is it its my of on or our so that the their then there this to was we what when where which who why will with you your olake ' +
    'please tell me give explain answer describe briefly brief short shortly sentence sentences words'
  ).split(' ')
)

/** The question as a full-text query: its words joined by OR, so a chunk need not hold them all. */
export function toQuery(question: string): string {
  const words = question.toLowerCase().match(/[a-z0-9][a-z0-9_.-]*[a-z0-9]|[a-z0-9]/g) ?? []
  const topic = words.filter((word) => !STOPWORDS.has(word))
  // In quotes a name such as max_threads or wal2json is searched as written.
  return [...new Set(topic.length ? topic : words)].map((term) => `"${term}"`).join(' OR ')
}

type Row = { id: number; url: string; title: string; text: string }

// The vectors of all chunks, in the order of the chunk ids. They are read once and kept for as
// long as this instance of the Worker lives, or until the index is replaced.
let loaded: { built: number; vectors: Int8Array } | undefined

async function chunkVectors(db: D1Database): Promise<Int8Array> {
  const info = await db.prepare('SELECT built FROM index_info').first<{ built: number }>()
  const built = info?.built ?? 0
  if (loaded?.built !== built) {
    const { results } = await db
      .prepare('SELECT data FROM vectors ORDER BY first_id')
      .all<{ data: string }>()
    const parts = results.map((row) => atob(row.data))
    const vectors = new Int8Array(parts.reduce((sum, part) => sum + part.length, 0))
    let at = 0
    for (const part of parts)
      for (let i = 0; i < part.length; i++) vectors[at++] = part.charCodeAt(i)
    loaded = { built, vectors }
  }
  return loaded.vectors
}

/**
 * The ids of the chunks closest in meaning to the question, closest first. Empty when there are
 * no embeddings (no AI binding, or an index built without them). It fails when Workers AI does
 * not answer in time. Either way the search then goes by keyword alone.
 */
async function nearest(
  env: { DB: D1Database; AI?: Ai },
  question: string,
  count: number
): Promise<number[]> {
  if (!env.AI) return []
  const tooLate = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('timed out')), EMBED_TIMEOUT_MS)
  )
  const embedded = env.AI.run(EMBEDDING_MODEL, { queries: [question] }) as Promise<{
    data: number[][]
  }>
  const [vectors, reply] = await Promise.race([
    Promise.all([chunkVectors(env.DB), embedded]),
    tooLate
  ])
  const query = reply.data[0]
  const scores = new Float32Array(vectors.length / DIMS)
  for (let i = 0; i < scores.length; i++) {
    let dot = 0
    for (let k = 0, at = i * DIMS; k < DIMS; k++) dot += vectors[at + k] * query[k]
    scores[i] = dot
  }
  return Array.from(scores.keys())
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, count)
    .map((i) => i + 1)
}

const PAIR_PAGE = /^https:\/\/olake\.io\/docs\/integrations\/[a-z0-9-]+?-to-/
const ISSUE = /^https:\/\/github\.com\/[^/]+\/[^/]+\/issues\//
// The "X to Y" pages of one source count as one page: they repeat each other, and five of them
// would otherwise stand in the results where the connector's own page should.
const pageOf = (url: string) => PAIR_PAGE.exec(url)?.[0] ?? url.split('#')[0]

export async function search(
  env: { DB: D1Database; AI?: Ai },
  question: string,
  options: Partial<Options> = {}
): Promise<Hit[]> {
  const { limit, titleWeight, perPage, blogWeight, repoWeight, issueWeight, pairWeight } = {
    ...DEFAULTS,
    ...options
  }
  // A question in another script (Hindi, Chinese) has no words for the keyword search. It is
  // still searched by meaning.
  const query = toQuery(question)
  if (!query && !env.AI) return []
  const pool = limit * 10
  const [keyword, near] = await Promise.all([
    query
      ? env.DB.prepare(
          `SELECT c.id, c.url, c.title, c.text
           FROM chunks_fts JOIN chunks c ON c.id = chunks_fts.rowid
           WHERE chunks_fts MATCH ?2 ORDER BY bm25(chunks_fts, ?1, 1.0) LIMIT ?3`
        )
          .bind(titleWeight, query, pool)
          .all<Row>()
          .then(({ results }) => results)
      : [],
    nearest(env, question, pool).catch((error) => {
      console.error(`meaning search failed: ${error}`)
      return []
    })
  ])

  const rows = new Map(keyword.map((row) => [row.id, row]))
  const missing = near.filter((id) => !rows.has(id))
  if (missing.length) {
    const { results } = await env.DB.prepare(
      'SELECT id, url, title, text FROM chunks WHERE id IN (SELECT value FROM json_each(?1))'
    )
      .bind(JSON.stringify(missing))
      .all<Row>()
    for (const row of results) rows.set(row.id, row)
  }

  const scores = new Map<number, number>()
  for (const ranking of [keyword.map((row) => row.id), near])
    ranking.forEach((id, rank) =>
      scores.set(id, (scores.get(id) ?? 0) + 1 / (RANK_OFFSET + rank + 1))
    )
  const hits = [...scores].flatMap(([id, score]): Hit[] => {
    const row = rows.get(id)
    if (!row) return []
    const { url, title, text } = row
    const weight = ISSUE.test(url)
      ? issueWeight
      : url.startsWith('https://github.com/')
        ? repoWeight
        : PAIR_PAGE.test(url)
          ? pairWeight
          : url.startsWith('https://olake.io/docs/')
            ? 1
            : blogWeight
    return [{ url, title, text, score: score * weight }]
  })
  hits.sort((a, b) => b.score - a.score)

  const texts = new Set<string>()
  const pages = new Map<string, number>()
  return hits
    .filter((hit) => {
      const page = pageOf(hit.url)
      const count = pages.get(page) ?? 0
      // The same text can sit on several pages (shared setup steps). Only its best match is kept.
      if (texts.has(hit.text) || count >= perPage) return false
      texts.add(hit.text)
      pages.set(page, count + 1)
      return true
    })
    .slice(0, limit)
}
