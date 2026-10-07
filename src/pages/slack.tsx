import React, { useEffect } from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';
import RedirectNotice from '@site/src/components/pages-misc/RedirectNotice';

const SLACK_INVITE_URL = 'https://join.slack.com/t/getolake/shared_invite/zt-420z5tl04-1EOq5JK0Z4kpiAFoVQXIDQ';

export default function SlackRedirect() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const siteUrl = siteConfig?.url || 'https://olake.io';
  const canonicalUrl = `${siteUrl}${location.pathname}`;

  useEffect(() => {
    window.location.href = SLACK_INVITE_URL;
  }, []);

  return (
    <>
      <Head>
        <title>Join OLake Community on Slack - Connect with Data Engineers</title>
        <meta 
          name="description" 
          content="Join OLake Slack community with 450+ data engineers. Get help, share insights, and collaborate on Apache Iceberg data lakehouse projects." 
        />
        <meta httpEquiv="refresh" content={`0;url=${SLACK_INVITE_URL}`} />
        <meta property="og:title" content="Join OLake Community on Slack" />
        <meta property="og:description" content="Join OLake Slack community with 450+ data engineers. Get help, share insights, and collaborate on Apache Iceberg data lakehouse projects." />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <RedirectNotice title='Redirecting to OLake Slack Community...' href={SLACK_INVITE_URL} />
    </>
  );
}

