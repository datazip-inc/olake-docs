import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import TabItem from '@theme-original/TabItem';
import type TabItemType from '@theme/TabItem';
import type {WrapperProps} from '@docusaurus/types';
import {useTabs} from '@docusaurus/theme-common/internal';

type Props = WrapperProps<typeof TabItemType>;

/**
 * Adds `olake-tab-<n>` to the tab panel, where n is the position of its tab in the tab bar. The bar
 * follows the `values` prop of <Tabs> and the panels follow the order of the children, and the two
 * can differ (docs/benchmarks/ingestion), so the position cannot be derived from the DOM order.
 * The docs table of contents (src/hooks/useTabAwareToc.tsx) uses it to name and open the right tab.
 */
export default function TabItemWrapper(props: Props): ReactNode {
  const {tabValues} = useTabs();
  const index = tabValues.findIndex((t) => t.value === props.value);
  return <TabItem {...props} className={clsx(props.className, index >= 0 && `olake-tab-${index}`)} />;
}
