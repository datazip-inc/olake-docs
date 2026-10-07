import React, {type ReactNode} from 'react';
import Desktop from '@theme-original/DocItem/TOC/Desktop';
import type DesktopType from '@theme/DocItem/TOC/Desktop';
import type {WrapperProps} from '@docusaurus/types';
import {TabAwareTocProvider, useTocTabNavigation, useVisibleTocHighlight} from '@site/src/hooks/useTabAwareToc';

type Props = WrapperProps<typeof DesktopType>;

/** Docs right-hand TOC: labels repeated entries with their tab path and opens hidden tabs on click. */
export default function DesktopWrapper(props: Props): ReactNode {
  useTocTabNavigation();
  useVisibleTocHighlight();
  return (
    <TabAwareTocProvider>
      <Desktop {...props} />
    </TabAwareTocProvider>
  );
}
