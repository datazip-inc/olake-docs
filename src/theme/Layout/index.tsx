import React, { type ReactNode } from 'react'
import Head from '@docusaurus/Head'
import useRouteContext from '@docusaurus/useRouteContext'
import Layout from '@theme-original/Layout'
import type LayoutType from '@theme/Layout'
import type { WrapperProps } from '@docusaurus/types'

type Props = WrapperProps<typeof LayoutType>

/**
 * Adds og:type="website" to the pages that come from src/pages (about, branding, privacy, terms,
 * the webinar, event and community pages ...). Blog posts, blog lists and docs are rendered by
 * their own plugins and set og:type themselves ("article" on posts), so they are left alone here:
 * a tag emitted by Layout would be rendered after, and win over, the post's og:type="article".
 * Pages that already set og:type="website" in their own <Head> are unaffected: react-helmet keeps
 * one tag per property.
 */
export default function LayoutWrapper(props: Props): ReactNode {
  const { plugin } = useRouteContext()
  const isStandalonePage = plugin.name === 'docusaurus-plugin-content-pages'
  return (
    <>
      {isStandalonePage && (
        <Head>
          <meta property='og:type' content='website' />
        </Head>
      )}
      <Layout {...props} />
    </>
  )
}
