import React, { useEffect } from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';

const ARCHIVE_URL = 'https://datazip-inc.github.io/olake-slack-archive/';

export default function SlackArchiveRedirect() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const siteUrl = siteConfig?.url || 'https://olake.io';
  const canonicalUrl = `${siteUrl}${location.pathname}`;

  useEffect(() => {
    window.location.href = ARCHIVE_URL;
  }, []);

  return (
    <>
      <Head>
        <title>OLake Community Slack Archive</title>
        <meta
          name="description"
          content="Searchable archive of the OLake community Slack, working around Slack's 90-day message retention on the free plan."
        />
        <meta httpEquiv="refresh" content={`0;url=${ARCHIVE_URL}`} />
        <meta property="og:title" content="OLake Community Slack Archive" />
        <meta
          property="og:description"
          content="Searchable archive of the OLake community Slack, working around Slack's 90-day message retention on the free plan."
        />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h1>Redirecting to OLake Community Slack Archive...</h1>
        <p>If you're not redirected automatically, <a href={ARCHIVE_URL}>click here</a>.</p>
      </div>
    </>
  );
}
