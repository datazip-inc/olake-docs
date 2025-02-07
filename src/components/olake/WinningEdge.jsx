import React from "react";

const WinningEdge = () => {
  return (
    <div className="winning-edge-box">
      <div className="winning-edge-heading">
        <span className="bold"> OLake's Winning</span> Edge
      </div>
      <div className="winning-edge-list">
        <div className="winning-edge-item">
          <img src="/img/olake/speed-up-line.svg" alt="" />
          <div className="winning-edge-item-heading">6x faster</div>
          <div className="winning-edge-item-text">
            Compared to Debezium snapshots
          </div>
          <div className="winning-edge-item-text">
            As we break big collections into multiple chunks and sync them in
            parallel
          </div>
        </div>
        <div className="winning-edge-item">
          <img src="/img/olake/ChartBar.svg" alt="" />
          <div className="winning-edge-item-heading">20x faster</div>
          <div className="winning-edge-item-text">
            Compared to Debezium for Incremental CDC Sync
          </div>
          <div className="winning-edge-item-text">
            As we process multiple collections parallely
          </div>
        </div>
        <div className="winning-edge-item">
          <img
            src="/img/olake/ListMagnifyingGlass.svg"
            alt=""
          />
          <div className="winning-edge-item-heading">Cost Effective</div>
          <div className="winning-edge-item-text">
            Let's Talk
          </div>
        </div>
      </div>
      <div className="winning-edge-sub">
        Reimagining CDC{" "}
        <span className="bold">without the hassle of maintaining</span> Kafka?
      </div>
      <a className="winning-edge-cta" href="/olake?utm_source=olake_page_waitlist_btn_talk_to_us&utm_medium=olake_page&utm_campaign=olake&utm_content=olake_cta#olake-form-product">Talk to us</a>
    </div>
  );
};

export default WinningEdge;
