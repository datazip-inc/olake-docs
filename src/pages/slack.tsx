import React, { useEffect } from 'react';
import Head from '@docusaurus/Head';

export default function SlackRedirect() {
  useEffect(() => {
    window.location.href = 'https://join.slack.com/t/getolake/shared_invite/zt-2uyphqf69-KQxih9Gwd4GCQRD_XFcuyw';
  }, []);

  return (
    <>
      <Head>
        <title>Join OLake Community on Slack - Connect with Data Engineers</title>
        <meta 
          name="description" 
          content="Join OLake Slack community with 350+ data engineers. Get help, share insights, and collaborate on Apache Iceberg data lakehouse projects." 
        />
        <meta httpEquiv="refresh" content="0;url=https://join.slack.com/t/getolake/shared_invite/zt-2uyphqf69-KQxih9Gwd4GCQRD_XFcuyw" />
        <meta property="og:title" content="Join OLake Community on Slack" />
        <meta property="og:description" content="Join OLake Slack community with 350+ data engineers. Get help, share insights, and collaborate on Apache Iceberg data lakehouse projects." />
        <link rel="canonical" href="https://join.slack.com/t/getolake/shared_invite/zt-2uyphqf69-KQxih9Gwd4GCQRD_XFcuyw" />
      </Head>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h1>Redirecting to OLake Slack Community...</h1>
        <p>If you're not redirected automatically, <a href="https://join.slack.com/t/getolake/shared_invite/zt-2uyphqf69-KQxih9Gwd4GCQRD_XFcuyw">click here</a>.</p>
      </div>
    </>
  );
}

