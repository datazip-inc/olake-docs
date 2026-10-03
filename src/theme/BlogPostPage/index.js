import React from 'react';
import BlogPostPage from '@theme-original/BlogPostPage';
import Head from '@docusaurus/Head';
import { PageMetadata } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { serializeJsonLd } from '@site/src/components/JsonLd';
import { PostEndProvider } from '@site/src/components/blog/PostEndContext';
import { getSeoTitle } from '../seo/helpers';

export default function BlogPostPageWrapper(props) {
  const { content: BlogPostContent } = props;
  const { metadata } = BlogPostContent;
  const { siteConfig } = useDocusaurusContext();
  
  // Extract author name and reading time
  const authorName = metadata.authors?.[0]?.name || 'OLake Team';
  const readingTime = metadata.readingTime || '5 minutes';
  // `seo_title` front matter: the <title>, og:title and twitter:title text when it should differ
  // from the visible h1 (`title`). The title formatter adds " | OLake"; the h1 is not touched.
  const seoTitle = getSeoTitle(metadata.frontMatter);

  // Canonical URLs keep the trailing slash: the site is built with trailingSlash: true,
  // so the slash URL is the one that is served, listed in the sitemap and used in hreflang.
  const cleanPermalink = metadata.permalink && !metadata.permalink.endsWith('/') ? `${metadata.permalink}/` : metadata.permalink;
  const canonicalUrl = cleanPermalink ? `${siteConfig.url}${cleanPermalink}` : null;

  // Open Graph image: a 1200x630 JPEG generated from the post's cover by `npm run og-images`
  // (scripts/generate-og-images.js; files committed in static/img/og/, CI runs it with --check
  // so a missing or stale one fails the build). The path is a pure function of the
  // cover path; keep ogPath in sync with that script. A post without a local raster cover gets the
  // site card, which is also 1200x630.
  const frontImage = metadata.frontMatter?.image;
  const hasGeneratedOg =
    typeof frontImage === 'string' && /^\/img\/.+\.(webp|png|jpe?g|avif)$/i.test(frontImage);
  const ogImageUrl = `${siteConfig.url}${
    hasGeneratedOg
      ? frontImage.replace(/^\/img\//, '/img/og/').replace(/\.[^./]+$/, '.jpg')
      : '/img/logo/olake-og-card.png'
  }`;
  const ogImageType = hasGeneratedOg ? 'image/jpeg' : 'image/png';

  // Docusaurus already emits an accurate BlogPosting (headline, dates, author, image) from the
  // post's frontmatter. The only extra schema generated here is the breadcrumb trail, derived
  // from the permalink so it cannot drift from the page. Organization and WebSite are emitted
  // once on the home page. The old hand-written per-post schemas (stale titles, hashed image URLs,
  // FAQ text that no longer matches the page) are archived in drafts/seo/.
  const SECTIONS = {
    '/blog/': 'Blog',
    '/iceberg/': 'Apache Iceberg',
    '/customer-stories/': 'Customer Stories'
  };
  const sectionPath = Object.keys(SECTIONS).find((p) => (metadata.permalink || '').startsWith(p));
  const breadcrumbSchema =
    canonicalUrl && sectionPath
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteConfig.url}/` },
            {
              '@type': 'ListItem',
              position: 2,
              name: SECTIONS[sectionPath],
              item: `${siteConfig.url}${sectionPath}`
            },
            { '@type': 'ListItem', position: 3, name: metadata.title, item: canonicalUrl }
          ]
        }
      : null;

  return (
    <>
      <Head>
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {cleanPermalink && <meta property="og:url" content={canonicalUrl} />}
        

        {/* Twitter card details (twitter:site is set site-wide in docusaurus.config.js headTags) */}
        <meta name="twitter:title" content={seoTitle ?? metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content={authorName} />
        <meta name="twitter:label2" content="Time to read" />
        <meta name="twitter:data2" content={readingTime} />
        {breadcrumbSchema && (
          <script type="application/ld+json">{serializeJsonLd(breadcrumbSchema)}</script>
        )}
      </Head>
      {/* `related` is the route's build-time module (src/plugins/blog-plugin.js) */}
      <PostEndProvider value={props.related}>
        <BlogPostPage {...props} />
      </PostEndProvider>
      {/* Rendered after the stock page so it replaces the stock <title> / og:title (seo_title) and
          the stock og:image / twitter:image, which point at the raw cover (any aspect ratio) */}
      {seoTitle && <PageMetadata title={seoTitle} />}
      <Head>
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:type" content={ogImageType} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={metadata.title} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={metadata.title} />
      </Head>
    </>
  );
}