import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Metadata from '@theme-original/DocItem/Metadata';
import type MetadataType from '@theme/DocItem/Metadata';
import type {WrapperProps} from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useDoc, useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import {useTitleFormatter} from '@site/src/lib/docusaurus';
import JsonLd from '@site/src/components/JsonLd';
import {describeDocTitle, getSeoTitle, stripSiteSuffix} from '../../seo/helpers';

type Props = WrapperProps<typeof MetadataType>;

/**
 * Adds the social tags the stock metadata does not emit. The canonical URL, og:url, og:title,
 * description, keywords and the images come from the stock component (Docusaurus already emits a
 * trailing-slash canonical because the site is built with trailingSlash: true), so none is added
 * here.
 *
 * Page title: the site's title formatter adds the " | OLake" suffix, like every other page. The text
 * is the front matter `seo_title` when set, else the doc title; a doc title under 25 characters
 * ("Overview", "Channels") gets its sidebar section appended ("Overview - Fusion") so the <title>
 * says what the page is about. The same text feeds og:title and twitter:title. The visible h1 is
 * untouched: it keeps `title`.
 *
 * Also emits a TechArticle JSON-LD block for the main docs (/docs/...). Every field is something
 * the page shows: the title, the description (front matter, else the first paragraph) and the
 * "Last updated" date. Pages that carry their own structured data are skipped: the docs home
 * (docs/intro.mdx) and the Iceberg query-engine docs (QueryEngineLayout).
 */
export default function MetadataWrapper(props: Props): ReactNode {
  const {metadata, frontMatter, assets} = useDoc();
  const {title, description, permalink, lastUpdatedAt} = metadata;
  const {siteConfig} = useDocusaurusContext();
  const image: string | undefined = assets.image ?? frontMatter.image;
  const sidebar = useDocsSidebar();
  const titleFormatter = useTitleFormatter();
  const seoTitle = getSeoTitle(frontMatter as Record<string, unknown>);
  const headTitle = titleFormatter.format(
    seoTitle ?? describeDocTitle(stripSiteSuffix(title), permalink, sidebar?.items as never)
  );

  const emitTechArticle = permalink.startsWith('/docs/') && permalink !== '/docs/';
  // Trailing slash, like the canonical (the site is built with trailingSlash: true).
  const pageUrl = `${siteConfig.url}${permalink.replace(/\/?$/, '/')}`;
  const techArticle: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    ...(description ? {description} : {}),
    ...(lastUpdatedAt ? {dateModified: new Date(lastUpdatedAt).toISOString()} : {}),
    mainEntityOfPage: {'@type': 'WebPage', '@id': pageUrl},
    url: pageUrl,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: 'OLake',
      url: `${siteConfig.url}/`,
      logo: {'@type': 'ImageObject', url: `${siteConfig.url}/img/logo/olake-blue.svg`},
    },
  };

  return (
    <>
      <Metadata {...props} />
      {emitTechArticle && <JsonLd data={techArticle} />}
      <Head>
        <title>{headTitle}</title>
        <meta property="og:title" content={headTitle} />
        <meta name="twitter:title" content={headTitle} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="OLake" />
        <meta property="og:locale" content="en_US" />
        {image && <meta name="twitter:image:alt" content={`Image for ${title}`} />}
      </Head>
    </>
  );
}
