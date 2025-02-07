// import clsx from 'clsx';
// import Link from '@docusaurus/Link';
// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
// import HomepageFeatures from '@site/src/components/HomepageFeatures';

// import Heading from '@theme/Heading';
// import styles from './index.module.css';

// function HomepageHeader() {
//   const {siteConfig} = useDocusaurusContext();
//   return (
//     <header className={clsx('hero hero--primary', styles.heroBanner)}>
//       <div className="container">
//         <Heading as="h1" className="hero__title">
//           {siteConfig.title}
//         </Heading>
//         <p className="hero__subtitle">{siteConfig.tagline}</p>
//         <div className={styles.buttons}>
//           <Link
//             className="button button--secondary button--lg"
//             to="/docs/intro">
//             Docusaurus Tutorial - 5min ⏱️
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default function Home() {
//   const {siteConfig} = useDocusaurusContext();
//   return (
//     <Layout
//       title={`Hello from ${siteConfig.title}`}
//       description="Description will go into a meta tag in <head />">
//       <HomepageHeader />
//       <main>
//         <HomepageFeatures />
//       </main>
//     </Layout>
//   );
// }
import '../css/styles.css'

import BrowserOnly from '@docusaurus/BrowserOnly';

import React, { useEffect, useRef } from "react";
import OlakeFeatures from '@site/src/components/olake/Feature';
import Faq from '@site/src/components/olake/Faq';
import OlakeBlogList from '@site/src/components/olake/Blog';
import ScrollReveal from '@site/utils/ScrollReveal';
import { useHistory } from "react-router-dom";
import HelmetWrapper from '@site/src/components/olake/HelmetWrapper';
import { olakeProductData } from '@site/src/components/olake/metaDeta';
import Benchmarks from '@site/src/components/olake/Benchmarks';
import WinningEdge from '@site/src/components/olake/WinningEdge';
import Potential from '@site/src/components/olake/Potential';
import GetStarted from '@site/src/components/olake/GetStarted';
import useIsMobile from '@site/utils/hooks/useMobile';

const OlakeFaqs = [
  {
    question: "What is Olake, and how does it handle MongoDB data?",
    answer:
      "Olake is a data engineering tool designed to simplify and automate the real-time ingestion & normalization of complex MongoDB data. It handles the entire process — from parsing and extraction to flattening/extrapolating and transforming raw, semi-structured data into relational streams — without the need for coding.",
  },
  {
    question:
      "How does Olake ensure data accuracy and prevent data loss during transformation?",
    answer:
      "Olake provides  monitoring and alerts for schema evolution, helping you detect changes and prevent data loss and inaccuracies caused by transformation logic errors. Custom alerts can be set up to notify you of schema changes, ensuring continuous data accuracy.",
  },
  {
    question: "What data platforms and tools does Olake integrate with?",
    answer:
      "As of now, we are integrating with Apache Iceberg as a destination. You can query this from most of the big data platform like Snowflake, Databricks, Redshift and BigQuery",
  },
  {
    question:
      "How does Olake handle large data volumes and maintain performance?",
    answer:
      "Olake is designed to process millions of rows in minutes using a configuration-based approach, which reduces processing time from months to minutes. It supports efficient data pipelines by connecting to streaming platforms like Kafka and dynamically generating SQL code to optimize data handling.",
  },
  {
    question: "Can Olake be customized to fit my specific data pipeline needs?",
    answer:
      "Olake provides a highly customizable, code-free interface for tailoring data extraction, transformation, and normalization processes to your specific data pipeline requirements. It allows you to adjust settings and automate tasks to match your unique use cases.",
  },
];

const OlakeProduct = () => {
  const childRef = useRef();
  const formRef = useRef(null);
  const history = useHistory();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (childRef.current && childRef.current.init) {
      childRef.current.init();
    }
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/v2.js";
    script.async = true;
    script.onload = () => {
      window.hbspt.forms.create({
        target: "#olake-product-form",
        portalId: "21798546",
        formId: "86391f69-48e0-4b35-8ffd-13ac212d8208",
      });
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (window.location.hash === "#olake-form-product") {
      setTimeout(() => {
        window.scrollTo(0, formRef.current.offsetTop);
      }, [0]);
      console.log('hereee', window.location.pathname, window.location.search)
      history.replace({
        pathname: window.location.pathname,
        search: window.location.search,
      });
    }
  }, [history, history.location.hash]);

  return (
    <>
      <Layout>
      <HelmetWrapper {...olakeProductData} />
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => (
          <ScrollReveal
            ref={childRef}
            children={() => (
              <div className='olake-product-container'>
                <div className="olake-product-brand reveal-from-top">
                  <img
                    src="/img/olake/olake-logo.svg"
                    alt="olake logo"
                  />
                </div>
                <div className="olake-product-heading reveal-from-bottom">
                  <span className="olake-product-heading-type1">Fastest</span>{" "}
                  <span className="olake-product-heading-type2">
                    way to replicate
                  </span>{" "}
                  <br /> 
                  {/* <br /> */}
                  <span className="olake-product-heading-type3">MongoDB</span>{" "}
                  <span className="olake-product-heading-type2">
                    data in Apache Iceberg
                  </span>
                </div>
                {isMobile ? (
                  <img
                    src="/img/olake/olake-home-mobile.svg"
                    alt="olake-architecture"
                    className="olake-product-architecture reveal-from-bottom"
                  />
                ) : (
                  <img
                    src="/img/olake/olake-home.svg"
                    alt="olake-architecture"
                    className="olake-product-architecture reveal-from-bottom"
                  />
                )}

                <GetStarted />
                <OlakeFeatures />
                <Benchmarks />
                <WinningEdge />
                <Potential />
                <div
                  id="olake-form-product"
                  className="olake-product-form-container"
                  ref={formRef}
                >
                  <div className="olake-product-form-container-left">
                    <div className="olake-product-form-brand">
                      <img
                        src="/img/olake/olake-logo-vector.svg"
                        alt="olake logo vector"
                      />
                      OLake
                    </div>
                    <div className="olake-product-form-heading">
                      Interested?
                      <br /> Get Early Access.
                    </div>
                  </div>
                  <div className="olake-product-form-container-right">
                    <div id="olake-product-form"></div>
                  </div>
                </div>
                <OlakeBlogList />
                <div className="olake-product-faq">
                  <Faq data={OlakeFaqs} showHeading={true} />
                </div>
              </div>
            )}
          />
        )}
      </BrowserOnly>
      </Layout>
    </>
  );
  
};

export default OlakeProduct;
