/**
 * Small pure helpers shared by the theme wrappers that write page titles
 * (DocItem/Metadata, BlogPostPage) and by the docs title qualifier.
 */

/** Trailing site suffix ("| OLake"). Docusaurus' title formatter adds it, so it must not be doubled. */
const SITE_SUFFIX = /\s*\|\s*OLake\s*$/i

/** Removes a trailing " | OLake" from a title the author already wrote with the suffix. */
export function stripSiteSuffix(title: string): string {
  return title.replace(SITE_SUFFIX, '').trim()
}

/**
 * The SEO title from front matter (`seo_title`), without a site suffix, or undefined when it is
 * not set. It replaces the page <title>, og:title and twitter:title only; the visible h1 keeps the
 * normal `title`.
 */
export function getSeoTitle(frontMatter: Record<string, unknown> | undefined): string | undefined {
  const raw = frontMatter?.seo_title
  if (typeof raw !== 'string') return undefined
  const cleaned = stripSiteSuffix(raw)
  return cleaned || undefined
}

/** Length of the " | OLake" suffix Docusaurus appends to every <title>. */
export const TITLE_SUFFIX_LENGTH = ' | OLake'.length
/** Longest bare title that still fits 60 characters once the site suffix is added. */
export const MAX_BARE_TITLE_LENGTH = 60 - TITLE_SUFFIX_LENGTH

// ---------------------------------------------------------------------------------------------
// Docs: qualifier for very short titles ("Overview" -> "Overview - Fusion")
// ---------------------------------------------------------------------------------------------

/** Docs titles shorter than this get the sidebar section appended to the <title>. */
const SHORT_TITLE_LENGTH = 25

type SidebarItem = {
  type: string
  href?: string
  label?: string
  value?: string
  className?: string
  items?: SidebarItem[]
}

const normPath = (path?: string) => (path ?? '').replace(/\/+$/, '')

function containsDoc(item: SidebarItem, permalink: string): boolean {
  if (item.href && normPath(item.href) === permalink) return true
  return (item.items ?? []).some((child) => containsDoc(child, permalink))
}

/** Category labels from the outermost to the innermost one that contains the doc. */
function categoryChain(items: SidebarItem[], permalink: string): string[] {
  for (const item of items) {
    if (item.type === 'category' && containsDoc(item, permalink)) {
      const inner = categoryChain(item.items ?? [], permalink)
      return [item.label ?? '', ...inner].filter(Boolean)
    }
  }
  return []
}

const LOWER_WORDS = new Set(['and', 'or', 'of', 'the', 'in', 'on', 'to', 'for'])

const ACRONYMS = new Set(['API', 'UI', 'CDC', 'AWS', 'GCP', 'SQL', 'CLI'])

function titleCase(text: string): string {
  return text
    .split(/\s+/)
    .map((raw, i) => {
      if (ACRONYMS.has(raw)) return raw
      const word = raw.toLowerCase()
      return i > 0 && LOWER_WORDS.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/** The uppercase section heading ("GET STARTED", "CORE CONCEPTS") above the doc in the sidebar. */
function sectionHeader(items: SidebarItem[], permalink: string): string | undefined {
  const index = items.findIndex((item) => containsDoc(item, permalink))
  for (let i = index; i >= 0; i--) {
    const item = items[i]
    if (item.type === 'html' && /navbar__category/.test(item.className ?? '') && item.value) {
      return titleCase(item.value.replace(/<[^>]*>/g, '').trim())
    }
  }
  return undefined
}

/** Section names for docs that are not in the sidebar, by their first URL segment. */
const SEGMENT_LABELS: Record<string, string> = {
  'connectors': 'Sources',
  'writers': 'Destinations',
  'release': 'Release Notes',
  'core': 'Core Concepts',
  'community': 'Community',
  'tutorials': 'Tutorials',
  'api': 'API',
  'install': 'Install',
  'monitoring-and-observability': 'Monitoring',
  'understanding': 'Core Concepts',
  'features': 'Features',
  'benchmarks': 'Benchmarks',
  'archive': 'Archive'
}

function segmentLabel(permalink: string, isFusion: boolean): string | undefined {
  const segments = permalink.replace(/^\/docs\//, '').split('/')
  const segment = isFusion ? segments[1] : segments[0]
  return segment ? SEGMENT_LABELS[segment] : undefined
}

const overlaps = (a: string, b: string) => {
  const x = a.toLowerCase()
  const y = b.toLowerCase()
  return x.includes(y) || y.includes(x)
}

/**
 * Builds the <title> text for a docs page. A title of 25 characters or more is returned as is. A
 * shorter one gets the sidebar section appended ("Overview - Fusion", "Channels - Fusion
 * Community"), as long as the result still fits 60 characters with the " | OLake" suffix.
 */
export function describeDocTitle(
  title: string,
  permalink: string,
  sidebarItems: SidebarItem[] | undefined
): string {
  if (title.length >= SHORT_TITLE_LENGTH) return title
  const path = normPath(permalink)
  const isFusion = path.startsWith('/docs/fusion')

  let section: string | undefined
  if (sidebarItems) {
    const chain = categoryChain(sidebarItems, path).filter((label) => !overlaps(label, title))
    section = chain[chain.length - 1] ?? sectionHeader(sidebarItems, path)
  }
  section ??= segmentLabel(path, isFusion)
  if (section && /^get started$/i.test(section) && isFusion) section = undefined
  if (section && overlaps(section, title)) section = undefined

  const candidates = [
    isFusion ? ['Fusion', section].filter(Boolean).join(' ') : section,
    isFusion ? 'Fusion' : undefined,
    isFusion ? undefined : 'OLake Go'
  ]
  for (const qualifier of candidates) {
    if (!qualifier || overlaps(qualifier, title)) continue
    const result = `${title} - ${qualifier}`
    if (result.length <= MAX_BARE_TITLE_LENGTH) return result
  }
  return title
}
