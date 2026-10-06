import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import BlogSidebar from '@theme/BlogSidebar'
import BlogBreadcrumbs from '@theme/BlogBreadcrumbs'
import useIsBlogPostPage from '@theme/Blog/useIsBlogPostPage'
import ReadingProgress from '@site/src/components/blog/ReadingProgress'
import NextSteps from '@site/src/components/blog/NextSteps'

/**
 * Shared shell of every blog page (list, post, tag, author, archive) in the three blog instances.
 *
 * Post pages: a 720px reading column; from 1100px the title spans the full width and a sticky OLake
 * call-to-action card sits beside the article under it (the card is rendered by BlogPostItem, so it
 * can share the article's grid with the title), and the "Next steps" block (older/newer post, related posts) below at the container width. The
 * table of contents is not here: it is a card at the top of the article (BlogPostItem).
 * Other pages: the 1016px site container, with breadcrumbs (the list pages opt out with
 * `hideBreadcrumbs`: "Home / Blog" above the "Blogs" heading says nothing). Post pages have none: the trail would
 * only repeat the post title (the BreadcrumbList JSON-LD of a post comes from BlogPostPage).
 * The sidebar prop only feeds the mobile navigation drawer (see BlogSidebar); `breadcrumbLabel`
 * names the last crumb on tag and author pages.
 */
export default function BlogLayout(props) {
  // `toc` is passed by the stock post page and deliberately unused (see above)
  // eslint-disable-next-line no-unused-vars
  const { sidebar, toc, children, breadcrumbLabel, hideBreadcrumbs, ...layoutProps } = props
  const hasSidebar = sidebar && sidebar.items.length > 0
  const isPost = useIsBlogPostPage()

  return (
    <Layout {...layoutProps}>
      {isPost && <ReadingProgress />}
      {hasSidebar && <BlogSidebar sidebar={sidebar} hideOnDesktop />}

      <div className='ob-page'>
        <div className={clsx('ob-shell', isPost && 'ob-shell--post')}>
          <main className='ob-main'>
            {!isPost && !hideBreadcrumbs && <BlogBreadcrumbs label={breadcrumbLabel} />}
            {children}
          </main>
        </div>
        {isPost && <NextSteps />}
      </div>
    </Layout>
  )
}
