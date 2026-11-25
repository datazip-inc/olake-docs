// Builds the index: every page of the built site and the docs of the code repositories, cut into
// chunks and written as one SQL file that fills the database.
//
//   npm run build && npm run ask-olake:index

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chunkSections, type Chunk } from './chunk.ts'
import { parsePage } from './html.ts'
import { readRepo } from './repos.ts'

const ASK_OLAKE = join(import.meta.dirname, '..')
const SITE_BUILD = join(ASK_OLAKE, '../build')
// The code repositories, checked out next to olake-docs, each with the folders to leave out.
const REPOS: Record<string, string[]> = {
  'olake-go': [],
  'olake-ui': [],
  'olake-helm': [],
  // A fork of Apache Amoro. These two folders are Amoro's own docs and website, and describe
  // features OLake Fusion does not have. The docs of OLake Fusion are on olake.io.
  'olake-fusion': ['docs', 'site']
}

/** The chunks of every page under a build folder of the site. */
export function siteChunks(buildDir: string): Chunk[] {
  const files = readdirSync(buildDir, { recursive: true, encoding: 'utf8' })
  const pages = files.filter((file) => file.endsWith('index.html')).sort()
  return chunkSections(
    pages.flatMap((file) => parsePage(readFileSync(join(buildDir, file), 'utf8')))
  )
}

/** The SQL that replaces the index with these chunks. `schema` is the content of schema.sql. */
export function toSql(chunks: Chunk[], schema: string): string {
  const quote = (text: string) => `'${text.replaceAll("'", "''")}'`
  const rows = chunks.map(
    ({ url, title, text }, i) =>
      `INSERT INTO chunks (id, url, title, text) VALUES (${i + 1}, ${quote(url)}, ${quote(title)}, ${quote(text)});`
  )
  return [schema, ...rows, "INSERT INTO chunks_fts (chunks_fts) VALUES ('rebuild');", ''].join('\n')
}

if (import.meta.main) {
  const site = siteChunks(SITE_BUILD)
  const repos = Object.entries(REPOS).flatMap(([name, exclude]) =>
    chunkSections(readRepo(join(ASK_OLAKE, '../..', name), exclude))
  )
  const out = join(ASK_OLAKE, '.wrangler/ingest')
  mkdirSync(out, { recursive: true })
  writeFileSync(
    join(out, 'index.sql'),
    toSql([...site, ...repos], readFileSync(join(ASK_OLAKE, 'schema.sql'), 'utf8'))
  )
  const pages = (chunks: Chunk[]) => new Set(chunks.map((chunk) => chunk.pageUrl)).size
  console.log(`site: ${site.length} chunks from ${pages(site)} pages`)
  console.log(`repositories: ${repos.length} chunks from ${pages(repos)} files`)
}
