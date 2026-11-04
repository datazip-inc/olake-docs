// @ts-check
/**
 * Adds rel="nofollow" to external links in comparison and explainer posts.
 *
 * Those posts link out to vendor docs, pricing pages and reviews as sources. Each of those links is
 * a followed link by default, so it passes ranking signals to the vendor (often a competitor of
 * OLake) and to review sites. With `nofollow` the reader still gets the source, and the target no
 * longer receives the link as a ranking signal.
 *
 * Skipped (kept as normal followed links): olake.io and its subdomains, datazip.io, and the
 * github.com/datazip-inc organisation. Internal links (relative, or starting with # or /) are not touched.
 *
 * Works on the hast tree: markdown links arrive as `element` nodes named `a`. Docusaurus renders them
 * through its Link component, which keeps an explicit `rel` and otherwise sets `noopener noreferrer`,
 * so `noopener noreferrer` is kept in the value.
 *
 * Use it only on the instances that carry sourced comparisons (compare, learn).
 */
const { visit } = require('unist-util-visit')

const OWN_HOSTS = [/(^|\.)olake\.io$/i, /(^|\.)datazip\.io$/i]
const OWN_GITHUB_PREFIX = '/datazip-inc/'

/** @param {string} href */
function isExternalAndNotOwn(href) {
  if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return false
  let url
  try {
    url = new URL(href)
  } catch {
    return false
  }
  if (OWN_HOSTS.some((re) => re.test(url.hostname))) return false
  if (/^(www\.)?github\.com$/i.test(url.hostname) && url.pathname.toLowerCase().startsWith(OWN_GITHUB_PREFIX)) return false
  return true
}

function externalLinksNofollowRehypePluginFactory() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'element' || node['tagName'] !== 'a') return
      const props = node['properties'] || {}
      if (!isExternalAndNotOwn(props['href'])) return
      const current = Array.isArray(props['rel']) ? props['rel'] : typeof props['rel'] === 'string' ? props['rel'].split(/\s+/) : []
      const rel = Array.from(new Set([...current, 'nofollow', 'noopener', 'noreferrer'].filter(Boolean)))
      node['properties'] = { ...props, rel }
    })
  }
}

module.exports = externalLinksNofollowRehypePluginFactory
