import React from "react";
import { outerLink } from '../../../utils/functions';

const GetStarted = () => {
  return (
    <div className="get-started-box">
      <div className="get-started-heading">
        Get Started with <span className="light">O</span>Lake
      </div>
      <div className="get-started-subheading">
        Choose a plan that suits your organisation’s needs
      </div>
      <div className="get-started-list">
        <img
          src="/img/olake/get-started-bg.svg"
          className="get-started-bg-img"
          alt="get-started-bg"
        />
        <div className="get-started-item">
          <img
            src="/img/olake/olake-github.svg"
            className="get-started-item-img"
            alt="get-started-item"
          />
          <div className="get-started-item-tag">
            <img src="/img/olake/meteor.svg" alt="meteor" />
            Quick Results
          </div>
          <div className="get-started-item-heading">
            O<span className="bold">Lake Github</span>
          </div>
          <div className="get-started-item-subheading">
            Use the free & open OLake for the fastest MongoDB Replication to
            Apache Iceberg
          </div>
          <button
            className="get-started-item-cta get-started-item-cta-secondary"
            onClick={() => outerLink("https://github.com/datazip-inc/olake")}
          >
            Contribute
          </button>
        </div>
        <div className="get-started-item">
          <img
            src="/img/olake/olake-byoc.svg"
            className="get-started-item-img"
            alt="get-started-item"
          />
          <div className="get-started-item-tag">
            <img src="/img/olake/meteor.svg" alt="meteor" />
            Control your cloud
          </div>
          <div className="get-started-item-heading">
            O<span className="bold">Lake BYOC</span>
          </div>
          <div className="get-started-item-subheading">
            Use the free & open OLake for the fastest MongoDB Replication to
            Apache Iceberg
          </div>
          <a
            className="get-started-item-cta get-started-item-cta-primary"
            href="/olake?utm_source=olake_page_waitlist_btn_byoc&utm_medium=olake_page&utm_campaign=olake&utm_content=olake_cta#olake-form-product"
          >
            Join Waitlist
          </a>
        </div>
        <div className="get-started-item">
          <img
            src="/img/olake/olake-saas.svg"
            className="get-started-item-img"
            alt="get-started-item"
          />
          <div className="get-started-item-tag">
            <img src="/img/olake/meteor.svg" alt="meteor" />
            For Enterprise solutions
          </div>
          <div className="get-started-item-heading">
            O<span className="bold">Lake SAAS</span>
          </div>
          <div className="get-started-item-subheading">
            Use the free & open OLake for the fastest MongoDB Replication to
            Apache Iceberg
          </div>
          <button className="get-started-item-cta get-started-item-cta-tertiary">
            Coming soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
