import React from 'react'
import Head from '@docusaurus/Head'
import SearchPage from '@theme-original/SearchPage'
import type SearchPageType from '@theme/SearchPage'
import type { WrapperProps } from '@docusaurus/types'
import '@site/src/components/pages-misc/pages-misc.css'

type Props = WrapperProps<typeof SearchPageType>

/** The theme's search page, restyled through `html.search-page-wrapper` rules in pages-misc.css. */
export default function SearchPageWrapper(props: Props): React.ReactElement {
  return (
    <>
      <Head>
        <meta name='robots' content='noindex, follow' />
        <meta
          name='description'
          content='Search the OLake documentation, including connectors, Apache Iceberg destinations, CDC replication and deployment guides.'
        />
      </Head>
      <SearchPage {...props} />
    </>
  )
}
