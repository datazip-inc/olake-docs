import React, {type ReactNode, useCallback, useEffect, useRef} from 'react';
import {useLocation} from '@docusaurus/router';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import Details from '@theme/Details';

type Props = {
  id: string;
  summary: ReactNode;
  children: ReactNode;
};

/** Collapsible section that opens and scrolls into view when a link points to its id. */
export default function AnchoredDetails({id, summary, children}: Props) {
  useBrokenLinks().collectAnchor(id);
  const wrapper = useRef<HTMLDivElement>(null);
  const {hash} = useLocation();

  const openAndScroll = useCallback(() => {
    const details = wrapper.current?.querySelector('details');
    if (details && !details.open) {
      details.querySelector('summary')?.click();
    }
    requestAnimationFrame(() => wrapper.current?.scrollIntoView());
  }, []);

  useEffect(() => {
    if (hash === `#${id}`) {
      openAndScroll();
    }
  }, [hash, id, openAndScroll]);

  // The hash doesn't change when the same link is clicked again after closing the section
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.('a');
      if (link?.getAttribute('href')?.endsWith(`#${id}`)) {
        openAndScroll();
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [id, openAndScroll]);

  return (
    <div id={id} ref={wrapper}>
      <Details summary={<summary>{summary}</summary>}>{children}</Details>
    </div>
  );
}
