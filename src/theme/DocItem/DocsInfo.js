import React from "react";
import { useLocation } from "react-router-dom";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ShareButton from "./ShareButton";

function DocsInfo({ docsPluginId, ...props }) {
  const location = useLocation();

  const openDocIssueURL =
    "https://github.com/datazip-inc/olake-docs/issues/new?assignees=&labels=&template=---doc-error-report.md&title=Issue with olake.io" +
    location.pathname;
  const openOLakeIssueURL =
    "https://github.com/datazip-inc/olake/issues/new?assignees=&labels=&template=---doc-error-report.md&title=Issue with OLake, coming from the doc site at URL - olake.io" +
    location.pathname;

  const bugIconUrl = useBaseUrl("img/icon/bug-icon.svg");

  return (
    <div className="mt-2 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        {/* Left group: Last updated info & Edit link */}
        <div className="flex flex-col sm:flex-row items-start md:items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0 text-sm text-gray-600 dark:text-gray-400">
          {(props.lastUpdatedAt || props.lastUpdatedBy) && (
            <div className="flex items-center space-x-2">
              <span className="font-medium">Last updated</span>
              {props.lastUpdatedAt && (
                <>
                  <span>:</span>
                  <time
                    className="mr-2"
                    dateTime={new Date(props.lastUpdatedAt).toISOString()}
                  >
                    {new Date(props.lastUpdatedAt).toLocaleDateString()}
                  </time>
                </>
              )}
              <span>|</span>
              <span>{props.readingTimeInWords || "... min read"}</span>
            </div>
          )}
          {props.editUrl && (
            <div>
              <a
                href={props.editUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-blue-500 hover:underline"
              >
                Edit this page
              </a>
            </div>
          )}
        </div>

        {/* Right group: Issue buttons & Share button */}
        <div className="flex items-center space-x-4">

          {/* Share Button */}
          <div>
            <ShareButton title={props.title} />
          </div>
          {/* Open OLake Issue */}
          <a
            href={openOLakeIssueURL}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            <img src={bugIconUrl} alt="Bug icon" className="w-4 h-4" />
            <span className="text-gray-400">Open OLake issues</span>
          </a>

          {/* Open Doc Issue */}
          <a
            href={openDocIssueURL}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            <img src={bugIconUrl} alt="Bug icon" className="w-4 h-4" />
            <span className="text-gray-400">Open OLake doc issue</span>
          </a>

          {/* Share Button */}
          {/* <div>
            <ShareButton title={props.title} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default DocsInfo;
