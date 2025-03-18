import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import BlogSidebar from '@theme/BlogSidebar'
import TryCloudCard from "@site/src/components/TryCloudCard";

export default function BlogLayout(props) {
  const { sidebar, toc, children, ...layoutProps } = props
  const hasSidebar = sidebar && sidebar.items.length > 0

  return (
    <Layout {...layoutProps}>
      <div className="margin-vert--lg container max-w-7xl">
        <div className="row">
          <BlogSidebar sidebar={sidebar} hideOnDesktop />
          <main
            className={clsx('col', {
              'col--12': hasSidebar && !toc,
              'col--9': hasSidebar && toc,
              'col--9 col--offset-1': !hasSidebar
            })}
          >
            {children}
          </main>
          {toc && (
            <div className="col col--3">
              {/* Sticky container for both toc and TryCloudCard */}
              <div className="sticky" style={{ top: '2rem' }}>
                {toc}
                <div className='mt-12'>
                <TryCloudCard />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
