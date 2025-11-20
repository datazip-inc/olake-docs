import React from 'react';
import BlogPostPage from '@theme-original/BlogPostPage';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const ensureTrailingSlash = (value) => {
  if (!value) {
    return value;
  }

  return value.endsWith('/') ? value : `${value}/`;
};

const stripTrailingSlash = (value) => {
  if (!value) {
    return value;
  }

  return value.endsWith('/') ? value.slice(0, -1) : value;
};

export default function BlogPostPageWrapper(props) {
  const { content: BlogPostContent } = props;
  const { metadata } = BlogPostContent;
  const { siteConfig } = useDocusaurusContext();
  
  // Extract author name and reading time
  const authorName = metadata.authors?.[0]?.name || 'OLake Team';
  const readingTime = metadata.readingTime || '5 minutes';

  const baseUrl = stripTrailingSlash(siteConfig?.url || 'https://olake.io');
  const permalink = metadata.permalink || '';
  const canonicalUrl = permalink ? ensureTrailingSlash(`${baseUrl}${permalink}`) : null;
  
  return (
    <>
      <Head>
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        
        {/* Enhanced Open Graph for Blog Posts */}
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:secure_url" content="https://olake.io/img/logo/olake-blue.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="OLake" />
        
        {/* Enhanced Twitter Cards for Blog Posts */}
        <meta name="twitter:creator" content="@cappybaradeploy" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image:alt" content="OLake" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content={authorName} />
        <meta name="twitter:label2" content="Time to read" />
        <meta name="twitter:data2" content={readingTime} />
      </Head>
      <BlogPostPage {...props} />
    </>
  );
}