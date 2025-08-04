import React, { type ReactNode } from 'react';
import type { Props } from '@theme/Footer/Copyright';
import styles from './styles.module.css';

export default function FooterCopyright({ copyright }: Props): ReactNode {
  return (
    <div className={styles.footerCopyright}>
      <div
        // Developer provided the HTML, so assume it's safe.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: copyright }}
      />
    </div>
  );
}
