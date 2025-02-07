import React, { useState } from "react";
import clsx from "clsx";
import styles from '../../css/Faq.module.css'

// A simple Accordion component
const Accordion = ({ question, answer, defaultExpanded }) => {
  const [expanded, setExpanded] = useState(defaultExpanded || false);

  return (
    <div className={styles.accordion}>
      <div
        className={styles.accordionSummary}
        onClick={() => setExpanded(!expanded)}
      >
        <div className={styles.heading}>{question}</div>
        <div className={clsx(styles.icon, { [styles.expanded]: expanded })}>
          {/* A simple down arrow which rotates when expanded */}
          &#9660;
        </div>
      </div>
      {expanded && (
        <div className={styles.accordionDetails}>
          <div className={styles.answer}>{answer}</div>
        </div>
      )}
    </div>
  );
};

const Faq = ({ data, showHeading }) => {
  return (
    <div className={styles.root}>
      {showHeading && (
        <div className={styles.headingContainer}>
          Frequently Asked Questions
        </div>
      )}
      {data?.map((item, index) => (
        <Accordion
          key={index}
          question={item.question}
          answer={item.answer}
          defaultExpanded={index === 0}
        />
      ))}
    </div>
  );
};

export default Faq;
