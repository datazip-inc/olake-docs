import React, { FC, ReactElement, useEffect, useState } from "react";
import Close from "@site/static/img/logo/close.svg";
import CheckIcon from "./CheckIcon";
import $t from "@site/utils/tools";

const TryCloudCard: FC = (): ReactElement => {
  // Initialize hidden state based on sessionStorage
  const [hidden, setHidden] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("OLAKE_TOC_CARD") === "closed";
    }
    return false; // Default value for SSR
  });

  // Update sessionStorage when hidden becomes true
  useEffect(() => {
    if (hidden) {
      sessionStorage.setItem("OLAKE_TOC_CARD", "closed");
    }
  }, [hidden]);

  const closeCard = () => {
    setHidden(true);
  };

  const features = [
    $t("Low-cost"),
    $t("Fast Analytics"),
    $t("Easy Data Ingestion"),
    $t("Elastic Scaling"),
  ];

  return (
    <>
      {!hidden && (
        <div className="bg-blue-100 dark:bg-gray-900 rounded-lg mb-3 p-4 mt-3 relative z-[2] max-w-[300px]">
          <div className="flex items-start flex-nowrap justify-between">
            <h6 className="text-base font-bold mb-4">
              {$t("Join OLake Cloud waitlist")}
            </h6>
            <span onClick={closeCard} className="cursor-pointer opacity-70">
              <Close />
            </span>
          </div>
          <div className="text-sm font-normal mb-4 flex flex-col gap-1.5">
            {features.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <span className="flex items-center justify-center min-w-[24px]">
                  <CheckIcon />
                </span>
                <span className="flex-1">{item}</span>
              </div>
            ))}
          </div>
          <a
            href="https://olake.io/#olake-form-product/"
            role="button"
            className="inline-block border-0 rounded px-3 h-8 leading-8 bg-blue-600 dark:bg-blue-700 text-white hover:text-white hover:opacity-90"
          >
            Try it today
          </a>
        </div>
      )}
    </>
  );
};

export default TryCloudCard;
