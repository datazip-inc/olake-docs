import React, {useEffect, useMemo, useState, type ReactNode} from 'react';
import {DocProvider, useDoc} from '@docusaurus/plugin-content-docs/client';
import type {TOCItem} from '@docusaurus/mdx-loader';

/**
 * Pages that put the same sections inside several <Tabs> panels (Prerequisites / Configuration /
 * Troubleshooting once per catalog, once per database ...) get one TOC entry per panel, all with
 * the same text. This hook finds, in the rendered article, which tab path each heading sits in and
 * appends that path to the entries whose text is repeated, so "Prerequisites" becomes
 * "Prerequisites" plus a small "Lakekeeper" tag. Entries with unique text, and headings outside any tab, are left alone.
 *
 * The TOC is first rendered unchanged (server HTML and first client render must match), then
 * relabelled in an effect. Ids and hrefs never change, so the active-heading highlight and
 * TOCTabLinker keep working. Clicking an entry whose panel is hidden is handled by
 * `TocTabNavigator` below.
 */

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const stripTags = (html: string) =>
  html.replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

/** One tab panel the heading sits in: its label and the tab button that opens it. */
export type TabStep = {label: string; tab: HTMLElement; selected: boolean};

/** Tab panels around an element, outermost first. */
export function getTabPath(el: Element): TabStep[] {
  const steps: TabStep[] = [];
  let node: Element | null = el.parentElement;
  while (node) {
    if (node.getAttribute('role') === 'tabpanel') {
      const holder = node.parentElement;
      const container = holder?.parentElement;
      const tabList = container?.querySelector(':scope > ul[role="tablist"]');
      // `olake-tab-<n>` comes from theme/TabItem: the panel order can differ from the tab bar order.
      const marked = /(?:^|\s)olake-tab-(\d+)(?:\s|$)/.exec(node.getAttribute('class') ?? '');
      const index = marked ? Number(marked[1]) : holder ? Array.prototype.indexOf.call(holder.children, node) : -1;
      const tab = tabList?.children[index] as HTMLElement | undefined;
      if (tab) {
        steps.unshift({
          label: (tab.textContent ?? '').trim(),
          tab,
          selected: tab.getAttribute('aria-selected') === 'true',
        });
      }
    }
    node = node.parentElement;
  }
  return steps;
}

function relabel(toc: TOCItem[]): TOCItem[] {
  const byText = new Map<string, number[]>();
  toc.forEach((item, i) => {
    const key = stripTags(item.value);
    byText.set(key, [...(byText.get(key) ?? []), i]);
  });

  const labels = new Map<number, string>();
  byText.forEach((indexes) => {
    if (indexes.length < 2) return;
    const paths = indexes.map((i) => {
      const el = document.getElementById(toc[i]!.id);
      return el ? getTabPath(el).map((s) => s.label) : [];
    });
    // Drop the leading tab names every duplicate shares; only what tells them apart is shown.
    let shared = 0;
    while (
      paths.every((p) => p.length > shared) &&
      paths.every((p) => p[shared] === paths[0]![shared])
    ) {
      shared += 1;
    }
    indexes.forEach((i, k) => {
      const label = paths[k]!.slice(shared).join(' / ');
      if (label) labels.set(i, label);
    });
  });

  if (labels.size === 0) return toc;
  return toc.map((item, i) =>
    labels.has(i)
      ? {...item, value: `${item.value} <span class="toc-tab-tag">${escapeHtml(labels.get(i)!)}</span>`}
      : item,
  );
}

/** Wraps `children` in a DocProvider whose toc carries the tab labels. */
export function TabAwareTocProvider({children}: {children: ReactNode}): ReactNode {
  const doc = useDoc();
  const [toc, setToc] = useState<TOCItem[]>(doc.toc as TOCItem[]);

  useEffect(() => {
    setToc(relabel(doc.toc as TOCItem[]));
  }, [doc.toc, doc.metadata.permalink]);

  const value = useMemo(() => ({...doc, toc}), [doc, toc]);
  return <DocProvider content={value as any}>{children}</DocProvider>;
}

/**
 * A TOC entry can point at a heading inside tab panels, often hidden ones. Opening it has to select
 * every tab around the heading (outermost first) and then scroll. The tab path is read from the
 * rendered page, so it is right even when a page's TOCTabLinker heading map is stale or only knows
 * the outer tab. Runs on window capture, so it sees the click before TOCTabLinker (which skips
 * clicks that are already handled). Headings outside any tab are left to the browser and Docusaurus.
 */
export function useTocTabNavigation(): void {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.('.table-of-contents__link') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      if (!href.includes('#')) return;
      const hash = href.slice(href.indexOf('#') + 1);
      const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
      if (!target) return;
      const path = getTabPath(target);
      if (path.length === 0) return;

      event.preventDefault();
      const closed = path.filter((s) => !s.selected);
      closed.forEach((s) => s.tab.click());
      const scroll = () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'});
        window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${hash}`);
      };
      // Tabs restore the scroll position on the next frame; scroll after that.
      if (closed.length > 0) window.setTimeout(scroll, 60);
      else scroll();
    };
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, []);
}

/**
 * Active-heading highlight for pages with hidden tab panels. Docusaurus' own highlight counts the
 * anchors of hidden panels too (they have no box, so it falls back to a parent's position) and ends
 * up marking an entry from a tab nobody is looking at. This runs after it on every scroll and, only
 * while some panel is hidden, marks the last VISIBLE heading above the top of the window instead.
 * Pages without hidden panels keep the stock behaviour untouched.
 */
export function useVisibleTocHighlight(): void {
  useEffect(() => {
    const ACTIVE = 'table-of-contents__link--active';
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!document.querySelector('.theme-doc-markdown [role="tabpanel"][hidden]')) return;
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.table-of-contents__link.toc-highlight'));
      const offset = (document.querySelector('.navbar')?.clientHeight ?? 60) + 8;
      let active: HTMLAnchorElement | null = null;
      for (const link of links) {
        const href = link.getAttribute('href') ?? '';
        const heading = document.getElementById(decodeURIComponent(href.slice(href.indexOf('#') + 1)));
        if (!heading || heading.getClientRects().length === 0) continue;
        if (heading.getBoundingClientRect().top <= offset + 1) active = link;
      }
      links.forEach((link) => link.classList.toggle(ACTIVE, link === active));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    document.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}
