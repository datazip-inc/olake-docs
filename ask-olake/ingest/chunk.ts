// Turns sections into chunks of a bounded size: the unit that is searched and shown to the model.

import type { Section } from './html.ts'

export type Chunk = {
  /** Link to the section the chunk came from. */
  url: string
  pageUrl: string
  /** Page title and heading, for example "Sources / Postgres: Overview > Prerequisites". */
  title: string
  text: string
}

/** About 500 tokens: long enough to hold a full procedure, short enough to send several. */
export const MAX_CHARS = 2000
/** A section shorter than this says too little alone and joins a neighbour. */
export const MIN_CHARS = 200

/** Fills pieces with as many units as fit. A unit longer than the limit gets a piece of its own. */
function pack(units: string[], separator: string, limit: number): string[] {
  const pieces: string[] = []
  for (const unit of units) {
    const last = pieces.length - 1
    if (last >= 0 && pieces[last].length + separator.length + unit.length <= limit) {
      pieces[last] += separator + unit
    } else {
      pieces.push(unit)
    }
  }
  return pieces
}

const isFence = (line: string) => line.trimStart().startsWith('```')
const isTable = (lines: string[]) => lines.length > 2 && lines.every((line) => line.startsWith('|'))
const isCode = (lines: string[]) =>
  isFence(lines[0]) && isFence(lines[lines.length - 1]) && lines.filter(isFence).length === 2

/** Paragraphs: the text split at blank lines, except the blank lines inside a code block. */
function paragraphs(text: string): string[] {
  const blocks: string[] = []
  let current: string[] = []
  let inCode = false
  for (const line of text.split('\n')) {
    if (isFence(line)) inCode = !inCode
    if (line.trim() || inCode) {
      current.push(line)
    } else if (current.length) {
      blocks.push(current.join('\n'))
      current = []
    }
  }
  if (current.length) blocks.push(current.join('\n'))
  return blocks
}

/** Lines as units, with each code block as one unit so that it is not cut in the middle. */
function lineUnits(lines: string[]): string[] {
  const units: string[] = []
  let code: string[] | null = null
  for (const line of lines) {
    if (code) {
      code.push(line)
      if (isFence(line)) {
        units.push(code.join('\n'))
        code = null
      }
    } else if (isFence(line)) {
      code = [line]
    } else {
      units.push(line)
    }
  }
  return code ? [...units, ...code] : units
}

/**
 * Splits a block that is longer than the limit, at line ends. Every part of a table repeats its
 * two header lines and every part of a code block its fences, so each still reads as what it is.
 */
function splitBlock(block: string, limit = MAX_CHARS): string[] {
  if (block.length <= limit) return [block]
  const lines = block.split('\n')
  // One line longer than the limit (minified JSON, a long URL) is cut where it must be.
  if (lines.length === 1) return block.match(new RegExp(`.{1,${limit}}`, 'gs')) ?? []
  const [top, bottom] = isTable(lines) ? [2, 0] : isCode(lines) ? [1, 1] : [0, 0]
  const head = lines
    .slice(0, top)
    .map((line) => `${line}\n`)
    .join('')
  const tail = lines
    .slice(lines.length - bottom)
    .map((line) => `\n${line}`)
    .join('')
  const room = limit - head.length - tail.length
  // A header that would fill half of every part is not repeated: the lines are split as they are.
  if (room < limit / 2)
    return pack(
      lines.flatMap((line) => splitBlock(line, limit)),
      '\n',
      limit
    )
  const units = top ? lines.slice(top, lines.length - bottom) : lineUnits(lines)
  return pack(
    units.flatMap((unit) => splitBlock(unit, room)),
    '\n',
    room
  ).map((part) => head + part + tail)
}

const split = (text: string) =>
  pack(
    paragraphs(text).flatMap((block) => splitBlock(block)),
    '\n\n',
    MAX_CHARS
  )

export function chunkSections(sections: Section[]): Chunk[] {
  // 1. A short section joins its neighbour on the same page, when the two fit in one chunk.
  const merged: Section[] = []
  for (const section of sections) {
    const previous = merged[merged.length - 1]
    const joined = previous ? `${previous.text}\n\n**${section.heading}**\n\n${section.text}` : ''
    if (
      previous &&
      previous.pageUrl === section.pageUrl &&
      (previous.text.length < MIN_CHARS || section.text.length < MIN_CHARS) &&
      joined.length <= MAX_CHARS
    ) {
      merged[merged.length - 1] = { ...previous, text: joined }
    } else {
      merged.push(section)
    }
  }

  // 2. A long section is split into parts.
  return merged.flatMap(({ pageUrl, url, pageTitle, heading, text }) => {
    const title = heading ? `${pageTitle} > ${heading}` : pageTitle
    return split(text).map((part, i) => ({
      url,
      pageUrl,
      title: i ? `${title} (part ${i + 1})` : title,
      text: part
    }))
  })
}
