import React from "react";
import { translate } from "@docusaurus/Translate";
import JoinCommunity from "@site/src/components/JoinCommunity";
import Link from "@docusaurus/Link";
import ArrowLeft from "@site/static/img/logo/arrowleft.svg";
import ArrowRight from "@site/static/img/logo/arrowright.svg";
import clsx from "clsx";

export default function DocPaginator(props) {
  const { previous, next } = props;

  return (
    <div className="olake-bottom-footer">
      {/* Pagination Navigation */}
      <nav
        className="pagination-nav docusaurus-mt-lg"
        aria-label={translate({
          id: "theme.docs.paginator.navAriaLabel",
          message: "Docs pages navigation",
          description: "The ARIA label for the docs pagination",
        })}
      >
        {previous ? (
          <Link
            className={clsx(
              "font-medium text-sm leading-5 py-2 px-4",
              "inline-flex items-center justify-center min-h-[2.25rem] w-auto gap-2 cursor-pointer shadow",
              "rounded-md border border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-800",
              "text-gray-800 dark:text-gray-100",
              "hover:bg-gray-100 hover:text-gray-900",
              "dark:hover:bg-gray-700 dark:hover:text-gray-50",
              "transition-colors"
            )}
            to={previous?.permalink}
          >
            <ArrowLeft />
            <span className="flex-1">{previous?.title}</span>
          </Link>
        ) : (
          <i></i>
        )}

        {next && (
          <Link
            className={clsx(
              "font-medium text-sm leading-5 py-2 px-4",
              "inline-flex items-center justify-center min-h-[2.25rem] w-auto gap-2 cursor-pointer shadow",
              "rounded-md border border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-800",
              "text-gray-800 dark:text-gray-100",
              "hover:bg-gray-100 hover:text-gray-900",
              "dark:hover:bg-gray-700 dark:hover:text-gray-50",
              "transition-colors"
            )}
            to={next?.permalink}
          >
            <span className="flex-1">{next?.title}</span>
            <ArrowRight />
          </Link>
        )}
      </nav>

      {/* Community Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-2 pb-[100px]">
        <JoinCommunity
          maxWidth={720}
          justifyContent="flex-start"
          titleAlign="left"
        />
      </div>
    </div>
  );
}
