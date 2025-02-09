import React from "react";
import SectionHeader from "../SectionHeader";

const Benchmarks = () => {
  return (
    <div className="mx-auto mt-10 flex max-w-[90%] flex-col p-6 sm:p-8 md:p-10">
      <SectionHeader
        heading={
          <>
            Overtaking all the <span className="font-normal">benchmarks</span>
          </>
        }
        subheading="Reimagining CDC without the hassle of maintaining Kafka."
      />
      <div className="mt-6 flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-1 rounded border border-gray-300 p-4">
          <img
            className="mx-auto w-full object-contain"
            src="/img/olake/olake-benchmark-1.svg"
            alt="benchmark-graph"
          />
        </div>
        <div className="flex-1 rounded border border-gray-300 p-4">
          <img
            className="mx-auto w-full object-contain"
            src="/img/olake/olake-benchmark-2.svg"
            alt="benchmark-graph"
          />
        </div>
      </div>
    </div>
  );
};

export default Benchmarks;
