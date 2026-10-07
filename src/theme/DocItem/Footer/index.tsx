import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocsInfo from '../DocsInfo';
import DocsFeedback from '@site/src/components/docs/DocsFeedback';

/**
 * Replaces the stock doc footer (tags, edit link, last updated): the feedback and community card,
 * then the last-updated date with the share / edit / report-an-issue actions.
 */
export default function DocItemFooter(): ReactNode {
  const {metadata} = useDoc();
  const {editUrl, lastUpdatedAt, lastUpdatedBy, title, id} = metadata;
  const showInfo = Boolean(editUrl || lastUpdatedAt || lastUpdatedBy);

  return (
    <footer className={clsx(ThemeClassNames.docs.docFooter, 'olake-doc-footer')}>
      <DocsFeedback label={id} />
      {showInfo && (
        <DocsInfo
          editUrl={editUrl}
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
          title={title}
        />
      )}
    </footer>
  );
}
