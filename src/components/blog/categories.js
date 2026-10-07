/**
 * Blog categories per blog instance. Each is a tag in that instance's tags.yml, so a category page
 * is the stock tag page at /<instance>/tags/<slug>/. The filter row on the list pages is built from
 * this list.
 * - blog: one category tag per post, listed last in its front matter. These tags are hidden from the
 *   post footer and the tag index so they do not show up twice next to the topic tags.
 * - customer-stories: B2B and Consumer Internet. They were already visible tags, so they stay listed.
 * - learn: no categories yet, so no filter row.
 */
export const CATEGORY_SETS = {
  blog: {
    base: '/blog/',
    hideTags: true,
    categories: [
      { slug: 'how-to', label: 'How-To' },
      { slug: 'benchmarks', label: 'Benchmarks' },
      { slug: 'product-updates', label: 'Product Updates' },
      { slug: 'thought-leadership', label: 'Thought Leadership' },
      { slug: 'alternatives', label: 'Alternatives' }
    ]
  },
  'customer-stories': {
    base: '/customer-stories/',
    hideTags: false,
    categories: [
      { slug: 'b2b', label: 'B2B' },
      { slug: 'consumer-internet', label: 'Consumer Internet' }
    ]
  },
  learn: {
    base: '/learn/',
    hideTags: false,
    categories: []
  }
}

export const categoryPermalink = (instanceKey, slug) => `${CATEGORY_SETS[instanceKey].base}tags/${slug}/`

/** The category a Docusaurus tag object (`{ label, permalink }`) stands for in this instance, or undefined for a topic tag. */
export const categoryOf = (tag, instanceKey) =>
  CATEGORY_SETS[instanceKey].categories.find((c) => tag.permalink.replace(/\/$/, '').endsWith(`/tags/${c.slug}`))

/** True for a category tag that should not be listed as a topic tag (post footer, tag index). */
export const isHiddenCategoryTag = (tag, instanceKey) =>
  CATEGORY_SETS[instanceKey].hideTags && Boolean(categoryOf(tag, instanceKey))
