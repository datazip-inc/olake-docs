import React, { FC, ReactElement } from "react";
import Link from "@docusaurus/Link";
import useGetReleases from "@site/src/hooks/useGetReleases";
import $t from "@site/utils/tools";
import GitHub from "@site/static/img/logo/gitHub.svg";
import X from "@site/static/img/logo/x.svg";
import Slack from "@site/static/img/logo/slack.svg";
import YouTube from "@site/static/img/logo/youtube.svg";
import LinkedIn from "@site/static/img/logo/linkedin.svg";

interface TProps {
  titleAlign?:
    | "start"
    | "end"
    | "left"
    | "right"
    | "center"
    | "justify"
    | "match-parent";
  // Remove maxWidth if you want full width,
  // or keep it to constrain the grid width and center it
  maxWidth?: number;
  justifyContent?: "center" | "flex-start" | "flex-end";
}

const JoinCommunity: FC<TProps> = ({
  titleAlign = "center",
  maxWidth = 720,
  justifyContent = "center",
}): ReactElement => {
  const { formatStargazersCount } = useGetReleases();

  const community = [
    {
      icon: <GitHub />,
      star: formatStargazersCount,
      title: "GitHub",
      link: "https://github.com/datazip-inc/olake",
    },
    {
      icon: <Slack />,
      title: "Slack",
      link: "https://olake.io/slack",
    },
    {
      icon: <X />,
      title: "Twitter",
      link: "https://x.com/_olake",
    },
    {
      icon: <LinkedIn />,
      title: "LinkedIn",
      link: "https://www.linkedin.com/company/datazipio",
    },
    {
      icon: <YouTube />,
      title: "YouTube",
      link: "https://www.youtube.com/@olakeio",
    },
    {
      icon: <LinkedIn />,
      title: "LinkedIn",
      link: "https://www.linkedin.com/company/datazipio",
    },
  ];

  return (
    <div className="flex flex-col gap-6 pt-8">
      {/* Section Title */}
      <h6 className="m-0 font-normal text-gray-800 dark:text-gray-100 text-center">
        {$t("Join our growing community")}
      </h6>

      {/* Community Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto"
        style={{ maxWidth: `${maxWidth}px` }} // Remove if full width is desired
      >
        {community.map((item, index) => (
          <Link to={item.link} key={index}>
            <div
              className="
                p-3 flex items-center gap-2
                bg-white dark:bg-gray-800
                border border-white dark:border-white shadow
                rounded-md
                w-full
                group
                transition-colors
                hover:bg-gray-50 dark:hover:bg-gray-700
                hover:border-gray-400 dark:hover:border-gray-300
              "
            >
              {/* Icon */}
              <div className="p-1.5 flex text-gray-800 dark:text-gray-100 ">
                {item.icon}
              </div>

              {/* Title */}
              <h6 className="m-0 font-bold text-gray-800 dark:text-gray-100 ">
                {item.title}
              </h6>

              {/* Star Count (if available) */}
              {item.star ? (
                <span className="text-sm px-1 rounded-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  🌟 {item.star} Stars
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JoinCommunity;
