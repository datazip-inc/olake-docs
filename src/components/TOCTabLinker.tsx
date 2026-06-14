import { useEffect, useRef } from 'react';

/**
 * Patches Docusaurus TOC sidebar links so clicking them preserves the active
 * tab query param instead of stripping it from the URL.
 *
 * Background: Docusaurus generates TOC links as bare `#hash` anchors at build
 * time with no awareness of Tabs `queryString` state. This component fixes
 * that at runtime using a MutationObserver so the patch also covers
 * late-mounted TOC nodes (e.g. mobile TOC appearing on first resize).
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

    // Patch immediately — TOC is already in the DOM when useEffect fires.
    patch();

    // Re-patch when new TOC nodes are added (e.g. mobile TOC mounts lazily).
    const observer = new MutationObserver(patch);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []); // Refs are stable; no stale closures, no deps needed.

  return null;
}
