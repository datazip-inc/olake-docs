// Reads the documentation kept in a code repository: Markdown files, Helm values files and the
// connector config specs. Each file becomes sections, in the same shape as a page of the site.

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Section } from './html.ts'

const isFence = (line: string) => line.trimStart().startsWith('```')
// HTML tags and comments, and Markdown images with the link around them (badges, logos). The
// words between tags are kept.
const NOT_TEXT =
  /<!--.*?-->|<\/?[a-z][^>]*>|\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\) *|!\[[^\]]*\]\([^)]*\) */gi
/** The anchor GitHub gives a heading: lower case, punctuation removed, spaces as hyphens. */
const anchorOf = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^\w\- ]/g, '')
    .replaceAll(' ', '-')

export function markdownSections(markdown: string, pageUrl: string, pageTitle: string): Section[] {
  const sections: Section[] = []
  let path: string[] = [] // the h1, h2 and h3 above the current line
  let url = pageUrl
  let lines: string[] = []
  let inCode = false
  const close = () => {
    const text = lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    if (text)
      sections.push({ pageUrl, url, pageTitle, heading: path.filter(Boolean).join(' > '), text })
    lines = []
  }
  for (const line of markdown.replace(/^---\n[\s\S]*?\n---\n/, '').split('\n')) {
    if (isFence(line)) inCode = !inCode
    const heading = inCode ? null : /^(#{1,3}) +(.+?)[ #]*$/.exec(line)
    if (heading) {
      close()
      const level = heading[1].length
      const text = heading[2].replace(NOT_TEXT, '').trim()
      path = path.slice(0, level - 1)
      path[level - 1] = text
      url = `${pageUrl}#${anchorOf(text)}`
    } else {
      lines.push(inCode || isFence(line) ? line : line.replace(NOT_TEXT, '').trimEnd())
    }
  }
  close()
  return sections
}

/** A Helm values file: one section per top-level key, as YAML. */
export function yamlSections(yaml: string, pageUrl: string, pageTitle: string): Section[] {
  const groups: string[][] = [[]]
  for (const line of yaml.split('\n')) {
    if (/^\w/.test(line)) {
      // The comment lines right above a top-level key describe it, so they move with it.
      const previous = groups[groups.length - 1]
      let start = previous.length
      while (start > 0 && previous[start - 1].startsWith('#')) start--
      groups.push(previous.splice(start))
    }
    groups[groups.length - 1].push(line)
  }
  return groups
    .map((lines) => lines.join('\n').trim())
    .filter(Boolean)
    .map((text) => ({
      pageUrl,
      url: pageUrl,
      pageTitle,
      heading: /^([\w-]+):/m.exec(text)?.[1] ?? '',
      text: `\`\`\`yaml\n${text}\n\`\`\``
    }))
}

type Schema = {
  title?: string
  type?: string
  description?: string
  default?: unknown
  const?: unknown
  enum?: unknown[]
  required?: string[]
  properties?: Record<string, Schema>
  oneOf?: Schema[]
  dependencies?: Record<string, Schema>
}

/** One line per field of a JSON schema, with nested fields as `parent.child`. */
function fields(schema: Schema, parent = ''): string[] {
  const own = Object.entries(schema.properties ?? {}).flatMap(([key, field]) => {
    const name = parent ? `${parent}.${key}` : key
    const notes = [
      field.title && `"${field.title}"`,
      field.type,
      schema.required?.includes(key) && 'required',
      field.default !== undefined && `default ${JSON.stringify(field.default)}`,
      field.enum && `one of ${field.enum.map((value) => JSON.stringify(value)).join(', ')}`
    ].filter(Boolean)
    const line =
      field.const !== undefined
        ? // A fixed value marks a variant: the fields after it apply when the field has this value.
          `- When \`${name}\` is ${JSON.stringify(field.const)}:`
        : `- \`${name}\`${notes.length ? ` (${notes.join(', ')})` : ''}${field.description ? `: ${field.description}` : ''}`
    return [line, ...fields(field, name)]
  })
  // Fields that only apply for one value of another field (a catalog type, an update method).
  const variants = [...(schema.oneOf ?? []), ...Object.values(schema.dependencies ?? {})]
  return [...own, ...variants.flatMap((variant) => fields(variant, parent))]
}

/** A connector config spec (the JSON schema behind a form in OLake UI): its fields as a list. */
export function specSections(json: string, pageUrl: string, pageTitle: string): Section[] {
  const spec = JSON.parse(json)
  const text = fields(spec.jsonschema ?? spec).join('\n')
  return text ? [{ pageUrl, url: pageUrl, pageTitle, heading: '', text }] : []
}

/**
 * The sections of every documentation file tracked in the repository at `dir`. GitHub templates and
 * notes for coding agents are left out, and so is every path in `exclude`.
 */
export function readRepo(dir: string, exclude: string[] = []): Section[] {
  const git = (...args: string[]) =>
    execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).trim()
  const repo = git('remote', 'get-url', 'origin')
    .replace(/^git@github\.com:/, 'https://github.com/')
    .replace(/\.git$/, '')
  const name = repo.slice(repo.lastIndexOf('/') + 1)
  const skip = ['.github', 'CLAUDE.md', ...exclude].map((path) => `:!${path}`)
  const files = git('ls-files', '--', '*.md', '*values.yaml', '*spec.json', ...skip).split('\n')
  return files.filter(Boolean).flatMap((file) => {
    const read = file.endsWith('.md')
      ? markdownSections
      : file.endsWith('.yaml')
        ? yamlSections
        : specSections
    // HEAD in a GitHub link is the default branch.
    return read(
      readFileSync(join(dir, file), 'utf8'),
      `${repo}/blob/HEAD/${file}`,
      `${name} / ${file}`
    )
  })
}
