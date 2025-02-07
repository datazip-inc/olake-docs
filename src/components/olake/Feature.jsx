import React, { useEffect, useRef } from "react";
import ScrollReveal from '@site/utils/ScrollReveal'

const features = [
  {
    heading: "Iceberg as a Lakehouse format",
    subheading:
      "Avoid vendor lock-in and query from any warehouse/query engine",
    image: "/img/olake/olake-product-1.svg",
  },
  {
    heading: "Monitoring alerts & error handling",
    subheading:
      "Monitoring alert for schema changes, backup tables and columns for error handling in strict schema",
    image: "/img/olake/olake-product-2.svg",
  },
  {
    heading: "Real-time replication",
    subheading: "Achieve near real-time less than 1 min sync frequency to Apache Iceberg",
    image: "/img/olake/olake-product-3.svg",
  },
];

const OlakeFeatures = () => {
  const childRef = useRef();

  useEffect(() => {
    if (childRef.current && childRef.current.init) {
      childRef.current.init();
    }
  }, []);

  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <div className="olake-product-feature-box">
          <div className="olake-product-feature-heading reveal-from-top">
            How OLake fits your Data needs
          </div>
          <div className="olake-product-feature-list reveal-from-bottom">
            {features.map((feature) => {
              return (
                <div className="olake-product-feature">
                  <img
                    src={feature.image}
                    alt={feature.heading}
                    className="olake-product-feature-image"
                  />
                  <div className="olake-product-feature-inner-heading">
                    {feature.heading}
                  </div>
                  <div className="olake-product-feature-subheading">
                    {feature.subheading}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
};

export default OlakeFeatures;
