import { createContext, useContext } from 'react'

/**
 * Build-time data of the post page: the related-post cards and whether the post already ends with
 * the <BlogCTA /> card in its own MDX (see src/plugins/blog-plugin.js). It is provided by the
 * BlogPostPage wrapper from the route's `related` module.
 */
const EMPTY = { cards: [], bodyCta: false }

const PostEndContext = createContext(EMPTY)

export const PostEndProvider = PostEndContext.Provider

export default function usePostEnd() {
  return useContext(PostEndContext) || EMPTY
}
