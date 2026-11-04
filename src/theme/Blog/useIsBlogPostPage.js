import { useBlogPost } from '@docusaurus/plugin-content-blog/client'

/**
 * True when rendered inside a blog post page. `useBlogPost` throws outside a post (the context
 * is empty on list, tag, author and archive pages); the context is read on every call, so the
 * hook order stays the same either way.
 */
export default function useIsBlogPostPage() {
  try {
    return Boolean(useBlogPost().isBlogPostPage)
  } catch (e) {
    return false
  }
}
