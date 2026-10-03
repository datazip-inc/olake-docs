import { useEffect, useRef } from 'react';
import { useHistory } from '@docusaurus/router';

/**
 * Patches Docusaurus TOC sidebar links so clicking them preserves the active
 * tab query param instead of stripping it from the URL.
 *
 * Background: Docusaurus generates TOC links as bare `#hash` anchors at build
 * time with no awareness of Tabs `queryString` state. This component fixes
 * that at runtime using a MutationObserver so the patch also covers
 * late-mounted TOC nodes (e.g. mobile TOC appearing on first resize).
 *
 * The patched links are `?param=tab#hash`. A plain click on such a link is a browser navigation to a
 * different URL, i.e. a FULL PAGE RELOAD (the TOC jumped back to the top, the page flashed, the reader
 * lost their place). So left clicks are intercepted and handled inside the app instead: when the
 * heading belongs to another tab the router switches the tab (a normal client-side navigation),
 * otherwise the page just scrolls smoothly to the heading. The patched href stays for open-in-new-tab,
 * copy-link and crawlers.
 *
 * @param headingMap  Maps each tab's query-param value → the heading IDs it owns.
 * @param queryParam  The `queryString` prop value on your <Tabs>. Default: 'config-type'.
 *
 * @example
 * // Two tabs (standard connector pages)
 * <TOCTabLinker
 *   queryParam="config-type"
 *   headingMap={{
 *     'olake-ui':  ['1-navigate-to-the-source-configuration-page', '2-provide-configuration-details', '3-test-connection'],
 *     'olake-cli': ['1-create-configuration-file', '2-provide-configuration-details-1', '3-check-source-connection'],
 *   }}
 * />
 */

interface Props {
  /** Maps each tab query-param value to the heading IDs belonging to that tab. */
  headingMap: Record<string, string[]>;
  /** The query param name used on the <Tabs queryString="..."> component. */
  queryParam?: string;
}

export default function TOCTabLinker({
  headingMap,
  queryParam = 'config-type',
}: Props): null {
  const history = useHistory();
  // Build a reverse lookup: headingId → tabValue.
  // Stored in refs so the effect closure always reads the latest values
  // without needing to re-run observer setup on every render.
  const reverseMapRef = useRef<Map<string, string>>(new Map());
  const queryParamRef = useRef(queryParam);

  reverseMapRef.current = new Map(
    Object.entries(headingMap).flatMap(([tabValue, headings]) =>
      headings.map((h) => [h, tabValue])
    )
  );
  queryParamRef.current = queryParam;

  useEffect(() => {
    const patch = () => {
      document
        .querySelectorAll<HTMLAnchorElement>('.table-of-contents__link')
        .forEach((link) => {
          const href = link.getAttribute('href') ?? '';
          // Skip links already patched (no longer a bare #hash).
          if (!href.startsWith('#')) return;
          const hash = href.slice(1);
          const tabValue = reverseMapRef.current.get(hash);
          if (tabValue !== undefined) {
            link.setAttribute(
              'href',
              `?${queryParamRef.current}=${tabValue}#${hash}`
            );
          }
        });
    };

    // Left clicks on a patched link are handled in the app (see the note at the top of the file).
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.(
        '.table-of-contents__link'
      ) as HTMLAnchorElement | null;
      if (!link) return;
      const match = (link.getAttribute('href') ?? '').match(/^\?([^#=]+)=([^#]*)#(.+)$/);
      if (!match) return;
      const [, param, tab, hash] = match;

      event.preventDefault();
      event.stopImmediatePropagation();

      const params = new URLSearchParams(history.location.search);
      if (params.get(param) !== tab) {
        // Another tab owns this heading: switch tab through the router (no page load); Docusaurus
        // scrolls to the hash once the new tab has rendered.
        params.set(param, tab);
        history.push({ search: `?${params.toString()}`, hash: `#${hash}` });
        return;
      }

      const target = document.getElementById(decodeURIComponent(hash));
      if (!target) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${hash}`);
    };
    document.addEventListener('click', onClick, true);

    // Patch immediately — TOC is already in the DOM when useEffect fires.
    patch();

    // Re-patch when new TOC nodes are added (e.g. mobile TOC mounts lazily).
    const observer = new MutationObserver(patch);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.removeEventListener('click', onClick, true);
    };
  }, [history]); // Refs are stable; the history object is stable too.

  return null;
}
