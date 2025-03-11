import React, { FC, ReactElement } from "react";
import Link from "@docusaurus/Link";
import useGetReleases from "@site/src/hooks/useGetReleases";
import $t from "@site/utils/tools";
import GitHub from "@site/static/img/logo/gitHub.svg";
import X from "@site/static/img/logo/x.svg";
import Slack from "@site/static/img/logo/slack.svg";
import YouTube from "@site/static/img/logo/youtube.svg";
interface TProps {
    titleAlign?:
      | "start"
      | "end"
      | "left"
      | "right"
      | "center"
      | "justify"
      | "match-parent";
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
        icon: <YouTube />,
        title: "YouTube",
        link: "https://www.youtube.com/@olakeio",
      },
    ];
  
    return (
      <div className="flex flex-col gap-6 pt-8">
        {/* Section Title */}
        <h6
          style={{ textAlign: titleAlign }}
          className="m-0 font-normal text-gray-800 dark:text-gray-100"
        >
          {$t("Join our growing community")}
        </h6>
  
        {/* Community Items */}
        <div
          className="flex flex-row flex-wrap gap-6"
          style={{ maxWidth: `${maxWidth}px`, justifyContent }}
        >
          {community.map((item, index) => (
            <Link to={item.link} key={index}>
              <div
                className="
                  p-3 flex items-center gap-2
                  bg-white dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  rounded-md
                  min-w-[340px] w-full
                  group
                  transition-colors
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  hover:border-gray-300 dark:hover:border-gray-500
                "
              >
                {/* Icon Area */}
                <div className="p-1.5 flex text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {item.icon}
                </div>
  
                {/* Title */}
                <h6 className="m-0 font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {item.title}
                </h6>
  
                {/* Star Count (if any) */}
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