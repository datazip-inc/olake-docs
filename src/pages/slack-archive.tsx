import React, { useEffect } from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';
import RedirectNotice from '@site/src/components/pages-misc/RedirectNotice';

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
      <RedirectNotice title='Redirecting to OLake Community Slack Archive...' href={ARCHIVE_URL} />
    </>
  );
}
