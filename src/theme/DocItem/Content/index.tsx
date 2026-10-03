import React, {useMemo, type ReactNode} from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import {DocProvider, useDoc} from '@docusaurus/plugin-content-docs/client';

type Props = WrapperProps<typeof ContentType>;

/**
 * Wraps the stock doc content. The stock content renders the front matter title as an <h1> when the
 * page has no `# heading`. The Iceberg query-engine docs render their own title in JSX, so the
 * synthetic one stays off there (it would be a second h1); every other doc gets it.
 * The "last updated / edit / share / issues" row lives at the end of the page (DocItem/Footer).
 */
export default function ContentWrapper(props: Props): ReactNode {
  const doc = useDoc();
  const {permalink} = doc.metadata;

  const suppressSyntheticTitle = permalink.startsWith('/iceberg/');
  const docWithoutSyntheticTitle = useMemo(
    () => (suppressSyntheticTitle ? {...doc, frontMatter: {...doc.frontMatter, hide_title: true}} : doc),
    [doc, suppressSyntheticTitle],
  );

  return (
    <DocProvider content={docWithoutSyntheticTitle as any}>
      <Content {...props} />
    </DocProvider>
  );
}
