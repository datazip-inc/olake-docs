import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import type { Props } from '@theme/Footer/Layout';
import styles from './styles.module.css';

export default function FooterLayout({
  style,
  links,
  logo,
  copyright,
}: Props): ReactNode {
  return (
    <footer
      className={clsx('footer', {
        'footer--dark': style === 'dark',
      })}>
      <div className={styles.footerContainer}>
        <div className="container">
          <div className="row">
            <div className="col col--5">
              {logo && <div className={styles.footerLogo}>{logo}</div>}
            </div>
            <div className="col col--7">
              <div className={styles.footerLinks}>
                {links}
              </div>
            </div>
          </div>
          {copyright && (
            <div className="row">
              <div className="col">
                <div className={styles.footerCopyright}>
                  {copyright}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
