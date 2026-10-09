const blogPluginExports = require('@docusaurus/plugin-content-blog')

const defaultBlogPlugin = blogPluginExports.default

// Blog instances that share the authors file of another instance (learn-blog and compare-blog read blog/authors.yml).
// Docusaurus builds a page for every author in the file, even one with no posts in the instance, so
// the shared file would add an empty /learn/authors/<name>/ (or /compare/authors/<name>/) page for every blog author. For these
// instances the authors list and the author pages keep only the authors who have posts there.
const INSTANCES_HIDING_EMPTY_AUTHORS = new Set(['learn-blog', 'compare-blog'])

/**
 * The archive page (src/theme/BlogArchivePage) only reads `date`, `permalink` and `title` of each
 * post, but the plugin hands the route the full metadata of every post (description, tags, authors,
 * frontMatter, ...), about 36 KB per post. For the main blog that is a 2 MB chunk (620 KB gzipped)
 * downloaded by every visitor of /blog/archive/. Keep only what the page uses.
 * If the archive page ever needs another field, add it here.
 */
function slimArchiveRoute(route) {
  const posts = route.props && route.props.archive && route.props.archive.blogPosts
  if (!Array.isArray(posts)) return route
  return {
    ...route,
    props: {
      ...route.props,
      archive: {
        ...route.props.archive,
        blogPosts: posts.map((post) => ({
          id: post.id,
          metadata: {
            date: post.metadata.date,
            permalink: post.metadata.permalink,
            title: post.metadata.title
          }
        }))
      }
    }
  }
}

/**
 * List, tag and author routes load each post as a `content` module (the compiled MDX of the post,
 * truncated at the `<!-- truncate -->` marker, or in full when a post has no marker). The cards on
 * those pages read only metadata (`post.content.metadata`, see src/components/blog/PostCard), so the
 * MDX body and the components it imports were downloaded for nothing. Swap each item for a small JSON
 * module `{ metadata }` holding the fields a card uses. `PostCard` reads: permalink, title, date,
 * description, frontMatter.image and authors[].name / imageURL / page.permalink. If a list page ever
 * needs another field, add it in toListMetadata.
 */
function toListMetadata(post) {
  const m = post.metadata
  return {
    permalink: m.permalink,
    title: m.title,
    date: m.date,
    description: m.description,
    frontMatter: { image: m.frontMatter && m.frontMatter.image ? m.frontMatter.image : undefined },
    authors: (m.authors || []).map((a) => ({
      name: a.name,
      imageURL: a.imageURL,
      page: a.page ? { permalink: a.page.permalink } : undefined
    }))
  }
}

function slimListRoute(route, listModules) {
  const items = route.modules && route.modules.items
  if (!Array.isArray(items)) return route
  return {
    ...route,
    modules: {
      ...route.modules,
      items: items.map((item) => {
        const source = item && item.content && item.content.path
        return source && listModules.has(source) ? { content: listModules.get(source) } : item
      })
    }
  }
}

const RELATED_COUNT = 3
const RELATED_DESCRIPTION_MAX = 200

/**
 * The post fields a related-post card needs (same shape as the list cards read from
 * `post.content.metadata`), without the post body.
 */
function toRelatedCard(post) {
  const m = post.metadata
  return {
    permalink: m.permalink,
    title: m.title,
    date: m.date,
    description: (m.description || '').slice(0, RELATED_DESCRIPTION_MAX),
    frontMatter: { image: m.frontMatter && m.frontMatter.image ? m.frontMatter.image : undefined },
    authors: (m.authors || []).map((a) => ({
      name: a.name,
      imageURL: a.imageURL,
      page: a.page ? { permalink: a.page.permalink } : undefined
    }))
  }
}

/**
 * Related posts of one post: the other listed posts of the same blog instance with the most tags
 * in common, newest first among equals. When fewer than RELATED_COUNT share a tag, the newest
 * remaining posts fill the block, so it always has the same size.
 */
function pickRelated(post, candidates) {
  const own = new Set((post.metadata.tags || []).map((t) => t.permalink))
  const scored = candidates
    .filter((c) => c.metadata.permalink !== post.metadata.permalink)
    .map((c) => ({
      post: c,
      score: (c.metadata.tags || []).reduce((n, t) => (own.has(t.permalink) ? n + 1 : n), 0),
      time: new Date(c.metadata.date).getTime()
    }))
  scored.sort((a, b) => b.score - a.score || b.time - a.time)
  return scored.slice(0, RELATED_COUNT).map((e) => toRelatedCard(e.post))
}

async function blogPluginExtended(context, options) {
  const blogPluginInstance = await defaultBlogPlugin(context, options)
  const hideEmptyAuthors = INSTANCES_HIDING_EMPTY_AUTHORS.has(options.id)

  return {
    ...blogPluginInstance,
    contentLoaded: async function (params) {
      const { addRoute, createData } = params.actions

      // Related posts: one small JSON per post (3 slim cards and a flag, about 2 KB), attached to the post
      // route as the `related` module. It loads with that post page only, never with the site
      // bundle (global data would be downloaded on every page of the site).
      const listed = params.content.blogPosts.filter((p) => !p.metadata.unlisted)
      const relatedModules = new Map()
      await Promise.all(
        params.content.blogPosts.map(async (post) => {
          const dataPath = await createData(
            `related-${options.id}-${post.id.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`,
            {
              cards: pickRelated(post, listed),
              // Most posts already end with <BlogCTA /> or <FusionBlogCTA /> in the MDX; the theme
              // adds its own end-of-post call to action only to the posts that do not.
              bodyCta: typeof post.content === 'string' && /<(Fusion)?BlogCTA[\s/>]/.test(post.content)
            }
          )
          relatedModules.set(post.metadata.permalink, dataPath)
        })
      )

      // One small JSON per post for the list, tag and author routes (see slimListRoute)
      const listModules = new Map()
      await Promise.all(
        params.content.blogPosts.map(async (post) => {
          const dataPath = await createData(
            `list-${options.id}-${post.id.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`,
            { metadata: toListMetadata(post) }
          )
          listModules.set(post.metadata.source, dataPath)
        })
      )

      return blogPluginInstance.contentLoaded({
        ...params,
        actions: {
          ...params.actions,
          addRoute: (route) => {
            // Post routes carry both `content` and `sidebar` modules
            if (route.modules && route.modules.content && relatedModules.has(route.path)) {
              route = { ...route, modules: { ...route.modules, related: relatedModules.get(route.path) } }
            }
            if (hideEmptyAuthors) {
              const props = route.props || {}
              // An author page of an author without posts in this instance
              if (props.author && props.author.count === 0) return
              // The authors list
              if (Array.isArray(props.authors)) {
                route = { ...route, props: { ...props, authors: props.authors.filter((a) => a.count > 0) } }
              }
            }
            addRoute(slimListRoute(slimArchiveRoute(route), listModules))
          }
        }
      })
    }
  }
}

module.exports = {
  ...blogPluginExports,
  default: blogPluginExtended
}
