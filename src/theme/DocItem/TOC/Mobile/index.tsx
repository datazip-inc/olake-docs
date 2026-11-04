import React, {type ReactNode} from 'react';
import Mobile from '@theme-original/DocItem/TOC/Mobile';
import type MobileType from '@theme/DocItem/TOC/Mobile';
import type {WrapperProps} from '@docusaurus/types';
import {TabAwareTocProvider, useTocTabNavigation, useVisibleTocHighlight} from '@site/src/hooks/useTabAwareToc';

type Props = WrapperProps<typeof MobileType>;

/** Collapsible docs TOC below 1280px: same tab labels and hidden-tab handling as the desktop one. */
export default function MobileWrapper(props: Props): ReactNode {
  useTocTabNavigation();
  useVisibleTocHighlight();
  return (
    <TabAwareTocProvider>
      <Mobile {...props} />
    </TabAwareTocProvider>
  );
}
