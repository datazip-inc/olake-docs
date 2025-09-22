import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';
import type { Props } from '@theme/Footer/Logo';

import styles from './styles.module.css';

function LogoImage({ logo }: Props) {
  const { withBaseUrl } = useBaseUrlUtils();
  const sources = {
    light: withBaseUrl(logo.src),
    dark: withBaseUrl(logo.srcDark ?? logo.src),
  };
  return (
    <>
      <div className={styles.logoContainer}>
        <div className={styles.olakeTitle}>OLake</div>
        <div className={styles.logoText}>
          <div className={styles.logoTitle}>Fastest</div>
          <div className={styles.logoTitle}>Data</div>
          <div className={styles.logoTitle}>Replication</div>
        </div>

        {/* Social icons row */}
        <div className={styles.socialIcons}>
          <a href="https://www.linkedin.com/company/datazipio" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
            <img src="/img/social/linkedin.svg" alt="LinkedIn" loading="lazy" decoding="async" />
          </a>
          <a href="https://www.youtube.com/@olakeio" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
            <img src="/img/social/youtube.svg" alt="YouTube" loading="lazy" decoding="async"/>
          </a>
          <a href="https://join.slack.com/t/getolake/shared_invite/zt-2uyphqf69-KQxih9Gwd4GCQRD_XFcuyw" className={styles.socialIcon} target="_blank"  rel="noopener noreferrer">
            <img src="/img/social/slack.svg" alt="Slack" loading="lazy" decoding="async" />
          </a>
          <a href="https://instagram.com/olake_io" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
            <img src="/img/social/instagram.svg" alt="Instagram" loading="lazy" decoding="async" />
          </a>
          <a href="https://x.com/_olake" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
            <img src="/img/social/x.svg" alt="X (Twitter)" loading="lazy" decoding="async" />
          </a>
        </div>
      </div>
    </>
  );
}

export default function FooterLogo({ logo }: Props): ReactNode {
  return logo.href ? (
    <Link
      href={logo.href}
      className={styles.footerLogoLink}
      target={logo.target}>
      <LogoImage logo={logo} />
    </Link>
  ) : (
    <div className={styles.footerLogoWrapper}>
      <LogoImage logo={logo} />
    </div>
  );
}
