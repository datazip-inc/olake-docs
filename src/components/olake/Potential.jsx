import React from "react";

const data = [
  {
    image: "/img/olake/potential-1.svg",
    heading: "Faster Parallel &  Full Load",
    subHeading:
      "Full load performance is improved by splitting large collections into smaller virtual chunks, processed in parallel.",
  },
  {
    image: "/img/olake/potential-2.svg",
    heading: "CDC cursor preservation",
    subHeading:
      "When you add new big tables after a long time of setting up the ETL, we do full load for it, in parallel to already running incremental sync. So CDC cursors are never lost. We manage overhead of data ingestion order and deduplication.",
  },
  {
    image: "/img/olake/potential-3.svg",
    heading: "Optimized Data Pull",
    subHeading:
      "Instead of directly transforming data from MongoDB during extraction, we first pull it in its native BSON format (Binary JSON, MongoDB's data format, which stores JSON-like documents more efficiently). Once we have the data, we decode it on the ETL side.",
  },
  {
    image: "/img/olake/potential-4.svg",
    heading: "Efficient Incremental Sync",
    subHeading:
      "Using MongoDB's change streams enables parallel updates for each collection. This method facilitates rapid synchronisation and ensures that data is consistently updated with near real-time updates. ",
  },
];

const Potential = () => {
  return (
    <div className="potential-box">
      <div className="potential-heading">
        <span className="bold">Unlock the</span> full potential{" "}
        <span className="bold">of Database replication with</span> O
        <span className="bold">Lake</span>
      </div>
      <div className="potential-grid">
        {data.map((val, index) => {
          return (
            <div
              className={`potential-grid-item potential-grid-item-${index + 1}`}
            >
              <img
                src={val.image}
                className="potential-grid-item-img"
                alt="potential img"
              />
              <div className="potential-grid-item-heading">{val.heading}</div>
              <div className="potential-grid-item-sub">{val.subHeading}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Potential;
