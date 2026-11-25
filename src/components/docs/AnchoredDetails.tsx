import React, {type ReactNode, useCallback, useEffect, useRef} from 'react';
import {useLocation} from '@docusaurus/router';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import Details from '@theme/Details';

type Props = {
  id: string;
  summary: ReactNode;
  children: ReactNode;
};

/**
 * Collapsible section that opens and scrolls into view when a link points to its id,
 * or to the id of a heading inside it.
 */
export default function AnchoredDetails({id, summary, children}: Props) {
  useBrokenLinks().collectAnchor(id);
  const wrapper = useRef<HTMLDivElement>(null);
  const {hash} = useLocation();

  /** The element a hash points to, if it is this section or inside it. */
  const targetOf = useCallback(
    (h: string): Element | null => {
      const target = h.slice(1);
      if (!target) return null;
      if (target === id) return wrapper.current;
      return wrapper.current?.querySelector(`[id="${CSS.escape(decodeURIComponent(target))}"]`) ?? null;
    },
    [id],
  );

  const openAndScroll = useCallback((target: Element) => {
    const details = wrapper.current?.querySelector('details');
    if (details && !details.open) {
      details.querySelector('summary')?.click();
    }
    requestAnimationFrame(() => target.scrollIntoView());
  }, []);

  useEffect(() => {
    const target = targetOf(hash);
    if (target) openAndScroll(target);
  }, [hash, targetOf, openAndScroll]);

  // The hash doesn't change when the same link is clicked again after closing the section
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const href = (event.target as Element).closest?.('a')?.getAttribute('href');
      const target = href?.includes('#') ? targetOf(href.slice(href.indexOf('#'))) : null;
      if (target) openAndScroll(target);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [targetOf, openAndScroll]);

  return (
    // Same offset as headings (custom.css), so the jump stops below the sticky navbar
    <div id={id} ref={wrapper} style={{scrollMarginTop: 'calc(var(--ifm-navbar-height) + 2.5rem)'}}>
      <Details summary={<summary>{summary}</summary>}>{children}</Details>
    </div>
  );
}
