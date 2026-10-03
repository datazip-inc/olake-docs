import React from "react";
import { useLocation } from "@docusaurus/router";
import { PiBug, PiPencilSimple, PiWarningCircle } from 'react-icons/pi'
import ShareButton from "./ShareButton";

// A fixed locale and time zone: toLocaleDateString() with no arguments formats in the visitor's
// locale, so the server HTML (en-US) and the browser (e.g. en-GB) disagreed and React 19 discarded
// the server-rendered tree (hydration error #418).
const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const formatLastUpdated = (timestamp) => DATE_FORMAT.format(new Date(timestamp));

/**
 * The row at the end of a doc page: last updated date, then the page actions (share, edit, report
 * an issue). Styles: `.olake-docsinfo*` in src/css/docs-content.css.
 */
function DocsInfo(props) {
  const location = useLocation();

  const openDocIssueURL =
    "https://github.com/datazip-inc/olake-docs/issues/new?assignees=&labels=&template=---doc-error-report.md&title=Issue with olake.io" +
    location.pathname;
  const openOLakeIssueURL =
    "https://github.com/datazip-inc/olake/issues/new?assignees=&labels=&template=---doc-error-report.md&title=Issue with OLake, coming from the doc site at URL - olake.io" +
    location.pathname;

  return (
    <div className="olake-docsinfo">
      <p className="olake-docsinfo__meta">
        {props.lastUpdatedAt && (
          <span className="olake-docsinfo__updated">
            Last updated{" "}
            <time dateTime={new Date(props.lastUpdatedAt).toISOString()}>
              {formatLastUpdated(props.lastUpdatedAt)}
            </time>
          </span>
        )}
      </p>

      <div className="olake-docsinfo__actions">
        <ShareButton title={props.title} />
        {props.editUrl && (
          <a
            href={props.editUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="olake-docsinfo__action"
          >
            <PiPencilSimple aria-hidden="true" size={16} />
            Edit this page
          </a>
        )}
        <a
          href={openOLakeIssueURL}
          target="_blank"
          rel="noreferrer noopener"
          className="olake-docsinfo__action"
        >
          <PiBug aria-hidden="true" size={16} />
          Open OLake issues
        </a>
        <a
          href={openDocIssueURL}
          target="_blank"
          rel="noreferrer noopener"
          className="olake-docsinfo__action"
        >
          <PiWarningCircle aria-hidden="true" size={16} />
          Open OLake doc issue
        </a>
      </div>
    </div>
  );
}

export default DocsInfo;
