import React from "react";

const Benchmarks = () => {
  return (
    <div className="benchmark-container">
      <div className="benchmark-heading">
        Topping all the{" "}
        <span className="benchmark-heading-type1">benchmarks</span>
      </div>
      <div className="benchmark-subheading">
        **We carried out a test run with a huge sample of X (formerly twitter)
        data sets and compared
        <br /> metrics with Industry leaders like fivetran & Airtable.
        Presenting the results below
      </div>
      <div className="benchmark-databox">
        <div className="benchmark-databox-heading">
          <img src="/img/olake/gauge.svg" alt="gauge" />
          Speed & Performance
        </div>
        <div className="benchmark-databox-tag">Speed Comparison</div>

        <div className="benchmark-item-box">
          <div className="benchmark-item">
            <div className="benchmark-item-number">13x</div>
            <div className="benchmark-item-heading">Full Load Performance</div>
            <div className="benchmark-item-subheading">
              Full Load Benchmark (230M rows, 664.81GB)
            </div>
            <img
              className="benchmark-item-graph"
              src="/img/olake/olake-benchmark-1.svg"
              alt="benchmark-graph"
            />
            <div className="benchmark-item-conclusion">
              <div className="benchmark-item-conclusion-heading">
                Conclusion
              </div>
              <div className="benchmark-item-conclusion-result">
                Olake is up to <span className="bold">13x</span> faster than
                competitors like Airbyte, significantly reducing the time and
                resources required for full data syncs.
                <br /> <span className="bold">6x faster</span> than MongoDB
                Streams + Debezium" config
              </div>
            </div>
            <div className="benchmark-item-case">
              **Sampling a massive collection of 230 million rows (664.81GB)
              from Twitter data*, here's how Olake compares to leading
              competitors
            </div>
          </div>
          <div className="benchmark-item">
            <div className="benchmark-item-number">27x</div>
            <div className="benchmark-item-heading">
              Incremental Load Performance
            </div>
            <div className="benchmark-item-subheading">
              Incremental Sync (1M rows, 2.88GB across 10 collections)
            </div>
            <img
              className="benchmark-item-graph"
              src="/img/olake/olake-benchmark-2.svg"
              alt="benchmark-graph"
            />
            <div className="benchmark-item-conclusion">
              <div className="benchmark-item-conclusion-heading">
                Conclusion
              </div>
              <div className="benchmark-item-conclusion-result">
                Olake processes{" "}
                <span className="bold">
                  1 million records in just 28.3 seconds
                </span>
                , achieving an incredible 35,694 records per second (r/s), which
                is 6.7x faster than Fivetran and a whopping 27.3x faster than
                Airbyte!
                <br />
                As fast as airbyte as it uses debezium for incremental only.
              </div>
            </div>
            <div className="benchmark-item-case">
              **Testing with 1 million rows (2.88GB) across 10 collections{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benchmarks;
