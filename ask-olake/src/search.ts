// Finds the chunks of the index that best match a question, by keyword (BM25 over the full-text index).

export type Hit = { url: string; title: string; text: string; score: number }

export type Options = {
  limit: number
  /** How much a word in the title counts against the same word in the text. */
  titleWeight: number
  /** At most this many chunks of one page, so that one long page does not fill the results. */
  perPage: number
  /** Score factor for a blog-style page (blog, compare, learn, customer stories) and for a repository file. The docs are 1. */
  blogWeight: number
  repoWeight: number
}
export const DEFAULTS: Options = {
  limit: 10,
  titleWeight: 3,
  perPage: 1,
  blogWeight: 0.6,
  repoWeight: 0.8
}

// Words that say nothing about the topic, the product name among them: it is on every page.
const STOPWORDS = new Set(
  'a an and are as at be but by can do does for from how i if in is it its my of on or our so that the their then there this to was we what when where which who why will with you your olake'.split(
    ' '
  )
)

/** The question as a full-text query: its words joined by OR, so a chunk need not hold them all. */
export function toQuery(question: string): string {
  const words = question.toLowerCase().match(/[a-z0-9][a-z0-9_.-]*[a-z0-9]|[a-z0-9]/g) ?? []
  const topic = words.filter((word) => !STOPWORDS.has(word))
  // In quotes a name such as max_threads or wal2json is searched as written.
  return [...new Set(topic.length ? topic : words)].map((term) => `"${term}"`).join(' OR ')
}

const pageOf = (url: string) => url.split('#')[0]

export async function search(
  db: D1Database,
  question: string,
  options: Partial<Options> = {}
): Promise<Hit[]> {
  const { limit, titleWeight, perPage, blogWeight, repoWeight } = { ...DEFAULTS, ...options }
  const query = toQuery(question)
  if (!query) return []
  const { results } = await db
    .prepare(
      `SELECT c.url, c.title, c.text, -bm25(chunks_fts, ?1, 1.0) AS score
       FROM chunks_fts JOIN chunks c ON c.id = chunks_fts.rowid
       WHERE chunks_fts MATCH ?2 ORDER BY bm25(chunks_fts, ?1, 1.0) LIMIT ?3`
    )
    .bind(titleWeight, query, limit * 10)
    .all<Hit>()
  for (const hit of results) {
    if (hit.url.startsWith('https://github.com/')) hit.score *= repoWeight
    else if (!hit.url.startsWith('https://olake.io/docs/')) hit.score *= blogWeight
  }
  results.sort((a, b) => b.score - a.score)
  const texts = new Set<string>()
  const pages = new Map<string, number>()
  return results
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
