import React from "react";
import Head from "@docusaurus/Head";
import MDXComponents from "../MDXComponents/Index";
import { MDXProvider } from "@mdx-js/react";
import { useDoc, useDocsVersion } from "@docusaurus/plugin-content-docs/client";
import { useTitleFormatter } from "@docusaurus/theme-common/internal";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import DocPaginator from "@theme/DocPaginator";
import DocVersionBanner from "@theme/DocVersionBanner";
import TOC from "@theme/TOC";
import clsx from "clsx";
import styles from "./styles.module.css";
import { useActivePlugin, useVersions } from "@docusaurus/plugin-content-docs/client";
import DocsInfo from "./DocsInfo";
import DocsRating from "./DocsRating";
import DocBreadcrumbs from "@theme/DocBreadcrumbs";
import DocsFooter from "../../../docs/shared/DocsFooter.mdx";

const stripTrailingSlash = (value) => {
  if (!value) {
    return value;
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
};

export const DocContent = ({ Content, contentRef, readingTimeInWords }) => {
  const { siteConfig } = useDocusaurusContext();
  const { pluginId } = useActivePlugin({ failfast: true });
  const {
    metadata,
    frontMatter: {
      image: metaImage,
      keywords,
      hide_title: hideTitle,
      hide_table_of_contents: hideTableOfContents,
    },
    toc,
  } = useDoc();

  const baseUrl = stripTrailingSlash(siteConfig?.url || "https://olake.io");
  const versionMetadata = useDocsVersion();
  const { description, title, permalink, editUrl, lastUpdatedAt, lastUpdatedBy, unversionedId } =
    metadata;

  const versions = useVersions(pluginId);

  const showVersionBadge = versions.length > 1;
  const metaTitle = useTitleFormatter(title);
  const metaImageUrl = useBaseUrl(metaImage, {
    absolute: true,
  });

  const trailingSlashDisabled = siteConfig?.trailingSlash === false;
  const normalizePath = (value) => {
    if (!value) {
      return null;
    }

    if (value === "/") {
      return "/";
    }

    if (trailingSlashDisabled) {
      return value.replace(/\/+$/, "");
    }

    return value.endsWith("/") ? value : `${value}/`;
  };

  const canonicalPath = normalizePath(permalink);
  let canonicalUrl = null;

  if (canonicalPath) {
    if (canonicalPath === "/") {
      canonicalUrl = trailingSlashDisabled ? baseUrl : `${baseUrl}/`;
    } else {
      canonicalUrl = `${baseUrl}${canonicalPath}`;
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        {description && <meta name="description" content={description} />}
        {description && <meta property="og:description" content={description} />}
        {keywords && keywords.length && <meta name="keywords" content={keywords.join(",")} />}
        {metaImage && <meta property="og:image" content={metaImageUrl} />}
        {metaImage && <meta name="twitter:image" content={metaImageUrl} />}
        {metaImage && <meta name="twitter:image:alt" content={`Image for ${title}`} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:site_name" content="OLake" />
        <meta property="og:locale" content="en_US" />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      </Head>

      <div className="row md:ml-8">
        <div
          className={clsx("col", {
            [styles.docItemCol]: !hideTableOfContents,
          })}
        >
          <DocBreadcrumbs />
          <DocVersionBanner versionMetadata={versionMetadata} />

          <div className={styles.docItemContainer}>
            <article className="article-content">
              {showVersionBadge && (
                <div>
                  <span className="badge badge--secondary">Version: {versionMetadata.label}</span>
                </div>
              )}

              {/* {!hideTitle && (
                                <header>
                                    <h1 className={styles.docTitle}>{title}</h1>
                                </header>
                            )} */}

              {(editUrl || lastUpdatedAt || lastUpdatedBy) && (
                <DocsInfo
                  editUrl={editUrl}
                  lastUpdatedAt={lastUpdatedAt}
                  lastUpdatedBy={lastUpdatedBy}
                  readingTimeInWords={readingTimeInWords}
                  title={title}
                />
              )}

              <MDXProvider components={MDXComponents}>
                <div className="markdown" ref={contentRef}>
                  <Content />
                </div>
              </MDXProvider>
            </article>

            <DocsFooter />

            <div className="margin-left--none margin-top--md text--center">
              <DocsRating label={unversionedId} />
            </div>
            <div className="margin-vert--lg">
              <DocPaginator previous={metadata.previous} next={metadata.next} />
            </div>
          </div>
        </div>
        {!hideTableOfContents && toc && (
          <div className="col col--3">
            <div className="sticky top-[76px] flex flex-col">
              <TOC toc={toc} />
              <div className="mt-4"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
