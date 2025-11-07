import React from 'react';
import Admonition from '@theme/Admonition';

export default function DateTimeHandling(): React.ReactElement {
  return (
    <>
      <p>
        During transfer, values in date, time, and timestamp columns are modified to ensure valid calendar ranges and destination compatibility.
      </p>
      <ul>
        <li>
          <strong>Case I (Year 0000)</strong>:
          <br/> 
          Source dates with year <code>0000</code> are not valid in most destinations, so we change them to the epoch start date.
          <br/>
          <em>Example</em>: <code>0000-05-10 → 1970-01-01</code>
        </li>
        <li>
          <strong>Case II (Year &gt; 9999)</strong>: 
          <br/>
          Extremely large years are capped at <code>9999</code>. The month and date are not affected.
          <br/>
          <em>Examples</em>: <code>10000-03-12 → 9999-03-12</code>
        </li>
        <li>
          <strong> Case III (Invalid month/day)</strong>: 
          <br/>
          When the month or day exceeds valid ranges (i.e. month &gt; 12 or day &gt; 31), or the
          combined date is invalid, the value is replaced with the epoch start date.
          <br/>
          <em>Examples</em>: <code>2024-13-15 → 1970-01-01</code>,
          <code> 2023-04-31 → 1970-01-01</code>
        </li>
      </ul>
      <Admonition type="tip" title="Note">
        <p>These rules apply to date, time, and timestamp columns during transfer.</p>
      </Admonition>
    </>
  );
}


