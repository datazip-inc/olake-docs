import React, { useEffect, useRef } from "react";
import ScrollReveal from '@site/utils/ScrollReveal'
import { Link } from "react-router-dom";
import HelmetWrapper from "../../components/sections/HelmetWrapper";
import { mainOlakeData } from "../../seo/metaDeta";

const OlakeHome = () => {
  const childRef = useRef();

 useEffect(() => {
     if (childRef.current && childRef.current.init) {
       childRef.current.init();
     }
   }, []);
   
  return (
    <>
      <HelmetWrapper {...mainOlakeData} />
      <ScrollReveal
        ref={childRef}
        children={() => (
          <div className="olake-home-container">
            <div className="olake-home-heading reveal-from-top">
              <div className="olake-home-heading-1">Composable</div>
              <div className="olake-home-heading-2">Lakehouse Platform</div>
            </div>
            <div className="olake-home-subheading reveal-from-bottom">
              Seamlessly integrate with top data engineering tools and
              technologies to meet your organization's diverse needs. Datazip
              works harmoniously with existing solutions or can entirely replace
              them.
            </div>
            <div className="olake-home-img reveal-from-bottom">
              <img
                src="/img/olake/olake-home.svg"
                alt="olake architecture"
              />
            </div>
            <div className="olake-usecase">
              <div className="olake-usecase-heading reveal-from-top">
                Use Cases
              </div>
              <div className="olake-usecase-subheading reveal-from-top">
                Meet your Data and AI needs
              </div>
              <div className="olake-usecase-list reveal-from-bottom">
                <div>Ingestion</div>
                <div>Data lake</div>
                <div>Orchestration</div>
              </div>
            </div>
            <div className="olake-banner">
              <div className="olake-banner-launch reveal-from-top">
                Launching
              </div>
              <div className="olake-banner-heading reveal-from-top">
                <div className="olake-banner-heading-1">OLake</div>
                <div className="olake-banner-heading-2">By Datazip</div>
              </div>
              <div className="olake-banner-subheading reveal-from-bottom">
                <span className="olake-banner-subheading-type3">Fastest</span>{""}
                <span className="olake-banner-subheading-type1">
                  way to replicate
                </span>
                <span className="olake-banner-subheading-type2">
                  MongoDB/JSON
                </span>
                {/* <br /> */}
                <span className="olake-banner-subheading-type1">
                  data in Apache
                </span>
              </div>
              <div className="olake-banner-cta">
                <a href="/olake?utm_source=landing_page_waitlist_btn1&utm_medium=olake_page&utm_campaign=olake&utm_content=olake_cta#olake-form-product">
                  <button className="olake-banner-cta-1 reveal-from-left">
                    Join Waitlist
                  </button>
                </a>
                <Link to="/olake">
                  <button className="olake-banner-cta-2 reveal-from-right">
                    Know more
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      />
    </>
  );
};

export default OlakeHome;
