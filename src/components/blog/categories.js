/**
 * Blog categories. Each is a tag in blog/tags.yml (one category tag per post, listed last in its
 * front matter), so a category page is the stock tag page at /blog/tags/<slug>/.
 * The filter row on the blog pages is built from this list; the post footer and the tag index hide
 * these tags so they do not show up twice next to the topic tags.
 */
export const BLOG_CATEGORIES = [
  { slug: 'how-to', label: 'How-To' },
  { slug: 'benchmarks', label: 'Benchmarks' },
  { slug: 'product-updates', label: 'Product Updates' },
  { slug: 'thought-leadership', label: 'Thought Leadership' },
  { slug: 'alternatives', label: 'Alternatives' }
]

export const categoryPermalink = (slug) => `/blog/tags/${slug}/`

/** The category a Docusaurus tag object (`{ label, permalink }`) stands for, or undefined for a topic tag. */
export const categoryOf = (tag) =>
  BLOG_CATEGORIES.find((c) => tag.permalink.replace(/\/$/, '').endsWith(`/tags/${c.slug}`))

export const isCategoryTag = (tag) => Boolean(categoryOf(tag))
