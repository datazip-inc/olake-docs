/* eslint-disable */
// @ts-nocheck
import React from 'react'
import Layout from '@theme/Layout'
import SiteNavbar from '@site/src/components/landing/Navbar/SiteNavbar'
import '@site/src/components/landing/Navbar/SiteNavbar.css'
import { PiLinkedinLogo, PiYoutubeLogo, PiSlackLogo, PiXLogo } from 'react-icons/pi'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import LandingSeo from '@site/src/components/landing/seo/LandingSeo'
import LightModeEnforcer from '@site/src/components/LightModeEnforcer'
import { useHomeLogic } from '@site/src/components/landing/pages/useHomeLogic'
import { cssToObj as __css } from '@site/src/components/landing/pages/cssToObj'
import { HOME_SEO } from '@site/src/data/landing/seo'
import '@site/src/components/landing/pages/olake-home.css'
import '@site/src/components/landing/pages/overrides.css'

/**
 * / — literal port of `OLake Homepage v2 Light (standalone).html`.
 * Markup generated from the design's template; state/handlers are a verbatim
 * port of its DCLogic class (arch-canvas fit + count-up observers included).
 *
 * The design ships no SEO metadata of its own, so HOME_SEO carries the
 * previous homepage's title/OG/canonical and all five JSON-LD objects.
 */
export default function HomePage() {
  // Derived at build time from docs/release/ingestion — see getLatestOlakeRelease()
  // in docusaurus.config.js. Keeps the BULLETIN release card from going stale.
  const { siteConfig } = useDocusaurusContext()
  const latestReleaseLabel = siteConfig.customFields?.latestOlakeReleaseLabel as string | undefined
  const latestReleasePath = siteConfig.customFields?.latestOlakeReleasePath as string | undefined

  const {
    advantageBg, advantagePos, advantageStats, resourcesOpen, contributorsOpen,
    productOpen, docsOpen, openProduct, closeProduct, openDocs, closeDocs,
    openResources, closeResources, openContributors, closeContributors,
    terminalLines, tickerLoop, engines, logosLoop, selectGo, selectFusion,
    benchmarkHref, goTabBg, goTabColor, fusionTabBg, fusionTabColor,
    whyRows, bulletin, stories, resources
  } = useHomeLogic({
    advantageImage: '/img/landing/shared/iceberg-backdrop.webp',
    advantageOverlay: 0.78,
    advantageWaterline: 74,
    latestReleaseLabel,
    latestReleasePath
  })

  return (
    <Layout title={HOME_SEO.title} description={HOME_SEO.description} wrapperClassName='landing-page' noFooter>
      <LandingSeo
        title={HOME_SEO.title}
        description={HOME_SEO.description}
        canonicalUrl={HOME_SEO.canonicalUrl}
        ogImage={HOME_SEO.ogImage}
        jsonLdSchemas={HOME_SEO.jsonLdSchemas}
      />
      <LightModeEnforcer />
      <div className='olakehome-page olake-design-page'>
      <div id="top" style={{fontFamily: "'Space Grotesk', sans-serif", backgroundColor: "#f0f2fa", backgroundImage: "linear-gradient(rgba(25, 58, 230, 0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(25, 58, 230, 0.025) 1px,transparent 1px)", backgroundSize: "80px 80px", color: "#070911", width: "100%", overflowX: "clip", position: "relative"}}>
        <SiteNavbar />
        <div style={{position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(0, 0, 0, 0.06)"}}>
          <div style={{position: "absolute", top: "-160px", left: "50%", transform: "translateX(-50%)", width: "760px", height: "400px", background: "radial-gradient(ellipse,rgba(25, 58, 230, 0.15),transparent 72%)", filter: "blur(30px)", animation: "glowPulse 5s ease-in-out infinite"}} />
          {' '}
          <div style={{position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "116px 48px 100px", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "76px", alignItems: "center"}}>
            <div>
              <div style={{display: "inline-flex", alignItems: "center", gap: "9px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#193AE6", border: "1px solid rgba(25, 58, 230, 0.3)", background: "rgba(25, 58, 230, 0.05)", borderRadius: "999px", padding: "7px 15px", marginBottom: "28px"}}>
                <span style={{width: "7px", height: "7px", borderRadius: "50%", background: "rgb(63, 168, 114)", boxShadow: "rgb(63, 168, 114) 0px 0px 8px"}} />
                {' '}Apache 2.0 licensed · Open Source
              </div>
              {' '}
              <h1 style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "500", fontSize: "60px", lineHeight: "0.98", letterSpacing: "-0.03em", color: "#000000"}}>
                Move data{' '}
                <span style={{color: "#193AE6", letterSpacing: "-2.28px"}}>fast.</span>
                <br />
                Keep it{' '}
                <span style={{color: "#193AE6", position: "relative"}}>fast.</span>
              </h1>
              {' '}
              <div style={{fontSize: "20px", lineHeight: "1.6", color: "#2d303d", maxWidth: "520px", margin: "28px 0 0"}} />
              {' '}
              <div style={{display: "flex", alignItems: "center", gap: "16px", marginTop: "38px"}}>
                <a className="olakehome-h3" href="/docs/getting-started/quickstart/" style={{color: "#ffffff", padding: "14px 30px", borderRadius: "10px", fontWeight: "600", fontSize: "16px", boxShadow: "0 6px 0 #5762da, 0 8px 14px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(0, 0, 0, 0.32)", transition: "transform 0.07s ease, box-shadow 0.07s ease", backgroundColor: "#193AE6"}}>Try OLake →</a>
                {' '}
                <a className="olakehome-h4" href="/contact" style={{color: "#0a0f23", padding: "14px 26px", borderRadius: "10px", fontWeight: "600", fontSize: "16px", border: "1px solid rgba(0, 0, 0, 0.18)", boxShadow: "0 6px 0 rgba(0, 0, 0, 0.1), 0 8px 14px rgba(255, 255, 255, 0.16), inset 0 1px 0 rgba(0, 0, 0, 0.12)", transition: "transform 0.07s ease, box-shadow 0.07s ease"}}>Get in touch</a>
              </div>
            </div>
            <div style={{position: "relative", width: "100%", maxWidth: "520px", aspectRatio: "1/1", margin: "0 auto"}}>
              <svg viewBox="0 0 520 520" style={{position: "absolute", inset: "0", width: "100%", height: "100%", overflow: "visible"}}>
                <g stroke="rgba(25, 58, 230, 0.12)" strokeWidth="2" fill="none" style={{animation: "glowPulse 5s ease-in-out infinite"}}>
                  <line x1="260" y1="260" x2="260" y2="89" />
                  {' '}
                  <line x1="260" y1="260" x2="380" y2="140" />
                  {' '}
                  <line x1="260" y1="260" x2="422" y2="260" />
                  {' '}
                  <line x1="260" y1="260" x2="380" y2="380" />
                  {' '}
                  <line x1="260" y1="260" x2="260" y2="431" />
                  {' '}
                  <line x1="260" y1="260" x2="140" y2="380" />
                  {' '}
                  <line x1="260" y1="260" x2="98" y2="260" />
                  {' '}
                  <line x1="260" y1="260" x2="140" y2="140" />
                </g>
                {' '}
                <defs>
                  <linearGradient id="spoke" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="rgba(25, 58, 230, 0.9)" />
                    {' '}
                    <stop offset="1" stopColor="rgba(25, 58, 230, 0.35)" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "20%", aspectRatio: "1/1", borderRadius: "50%", background: "radial-gradient(circle,#d5ddff,#e7ecff)", border: "1px solid rgba(25, 58, 230, 0.4)", boxShadow: "0 0 0 10px rgba(25, 58, 230, 0.08), 0 0 60px -8px rgba(25, 58, 230, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "2", animation: "hubGlow 3.2s ease-in-out infinite"}}>
                <img src="/img/landing/v2/constellation-hub-icon.png" alt="OLake" style={{width: "52%", height: "52%", objectFit: "contain", display: "block"}} />
              </div>
              <div style={{position: "absolute", left: "50%", top: "10%", transform: "translate(-50%,-50%)", width: "13.5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", animationDelay: "0.1s"}}>
                <div style={{width: "100%", aspectRatio: "1/1", borderRadius: "14px", background: "#ffffff", animation: "nodeBlink 4s ease-in-out infinite", animationDelay: "0.00s", transformOrigin: "center", border: "1px solid rgba(0, 0, 0, 0.12)", boxShadow: "0 8px 22px -10px rgba(255, 255, 255, 0.26)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16%", overflow: "hidden"}}>
                  <img src="/img/landing/v2/connector-iceberg.png" alt="Iceberg" style={{width: "100%", height: "100%", objectFit: "contain"}} />
                </div>
                {' '}
                <div style={{position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "8px", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#424865"}}>Iceberg</div>
              </div>
              {' '}
              <div style={{position: "absolute", left: "78%", top: "22%", transform: "translate(-50%,-50%)", width: "13.5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", animationDelay: "0.18s"}}>
                <div style={{width: "100%", aspectRatio: "1/1", borderRadius: "14px", background: "#ffffff", animation: "nodeBlink 4s ease-in-out infinite", animationDelay: "0.50s", transformOrigin: "center", border: "1px solid rgba(0, 0, 0, 0.12)", boxShadow: "0 8px 22px -10px rgba(255, 255, 255, 0.26)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16%", overflow: "hidden"}}>
                  <img src="/img/landing/v2/connector-kafka.png" alt="Kafka" style={{width: "100%", height: "100%", objectFit: "contain"}} />
                </div>
                {' '}
                <div style={{position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "8px", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#424865"}}>Kafka</div>
              </div>
              {' '}
              <div style={{position: "absolute", left: "88%", top: "50%", transform: "translate(-50%,-50%)", width: "13.5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", animationDelay: "0.26s"}}>
                <div style={{width: "100%", aspectRatio: "1/1", borderRadius: "14px", background: "#ffffff", animation: "nodeBlink 4s ease-in-out infinite", animationDelay: "1.00s", transformOrigin: "center", border: "1px solid rgba(0, 0, 0, 0.12)", boxShadow: "0 8px 22px -10px rgba(255, 255, 255, 0.26)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16%", overflow: "hidden"}}>
                  <img src="/img/landing/v2/connector-mongodb.png" alt="MongoDB" style={{width: "100%", height: "100%", objectFit: "contain"}} />
                </div>
                {' '}
                <div style={{position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "8px", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#424865"}}>MongoDB</div>
              </div>
              {' '}
              <div style={{position: "absolute", left: "78%", top: "78%", transform: "translate(-50%,-50%)", width: "13.5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", animationDelay: "0.34s"}}>
                <div style={{width: "100%", aspectRatio: "1/1", borderRadius: "14px", background: "#ffffff", animation: "nodeBlink 4s ease-in-out infinite", animationDelay: "1.50s", transformOrigin: "center", border: "1px solid rgba(0, 0, 0, 0.12)", boxShadow: "0 8px 22px -10px rgba(255, 255, 255, 0.26)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16%", overflow: "hidden"}}>
                  <img src="/img/landing/v2/connector-oracle.png" alt="Oracle" style={{width: "100%", height: "100%", objectFit: "contain"}} />
                </div>
                {' '}
                <div style={{position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "8px", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#424865"}}>Oracle</div>
              </div>
              {' '}
              <div style={{position: "absolute", left: "50%", top: "90%", transform: "translate(-50%,-50%)", width: "13.5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", animationDelay: "0.42s"}}>
                <div style={{width: "100%", aspectRatio: "1/1", borderRadius: "14px", background: "#ffffff", animation: "nodeBlink 4s ease-in-out infinite", animationDelay: "2.00s", transformOrigin: "center", border: "1px solid rgba(0, 0, 0, 0.12)", boxShadow: "0 8px 22px -10px rgba(255, 255, 255, 0.26)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16%", overflow: "hidden"}}>
                  <img src="/img/landing/v2/connector-mysql.png" alt="MySQL" style={{width: "100%", height: "100%", objectFit: "contain"}} />
                </div>
                {' '}
                <div style={{position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "8px", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#424865"}}>MySQL</div>
              </div>
              {' '}
              <div style={{position: "absolute", left: "22%", top: "78%", transform: "translate(-50%,-50%)", width: "13.5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", animationDelay: "0.5s"}}>
                <div style={{width: "100%", aspectRatio: "1/1", borderRadius: "14px", background: "#ffffff", animation: "nodeBlink 4s ease-in-out infinite", animationDelay: "2.50s", transformOrigin: "center", border: "1px solid rgba(0, 0, 0, 0.12)", boxShadow: "0 8px 22px -10px rgba(255, 255, 255, 0.26)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16%", overflow: "hidden"}}>
                  <img src="/img/landing/v2/connector-s3.png" alt="S3" style={{width: "100%", height: "100%", objectFit: "contain"}} />
                </div>
                {' '}
                <div style={{position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "8px", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#424865"}}>S3</div>
              </div>
              {' '}
              <div style={{position: "absolute", left: "12%", top: "50%", transform: "translate(-50%,-50%)", width: "13.5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", animationDelay: "0.58s"}}>
                <div style={{width: "100%", aspectRatio: "1/1", borderRadius: "14px", background: "#ffffff", animation: "nodeBlink 4s ease-in-out infinite", animationDelay: "3.00s", transformOrigin: "center", border: "1px solid rgba(0, 0, 0, 0.12)", boxShadow: "0 8px 22px -10px rgba(255, 255, 255, 0.26)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16%", overflow: "hidden"}}>
                  <img src="/img/landing/v2/connector-mssql.webp" alt="MSSQL" style={{width: "100%", height: "100%", objectFit: "contain"}} />
                </div>
                {' '}
                <div style={{position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "8px", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#424865"}}>MSSQL</div>
              </div>
              {' '}
              <div style={{position: "absolute", left: "22%", top: "22%", transform: "translate(-50%,-50%)", width: "13.5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", animationDelay: "0.66s"}}>
                <div style={{width: "100%", aspectRatio: "1/1", borderRadius: "14px", background: "#ffffff", animation: "nodeBlink 4s ease-in-out infinite", animationDelay: "3.50s", transformOrigin: "center", border: "1px solid rgba(0, 0, 0, 0.12)", boxShadow: "0 8px 22px -10px rgba(255, 255, 255, 0.26)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16%", overflow: "hidden"}}>
                  <img src="/img/landing/v2/connector-postgres.png" alt="Postgres" style={{width: "100%", height: "100%", objectFit: "contain"}} />
                </div>
                {' '}
                <div style={{position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "8px", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#424865"}}>Postgres</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{borderTop: "1px solid rgba(0, 0, 0, 0.06)", borderBottom: "1px solid rgba(0, 0, 0, 0.06)", padding: "44px 0", background: "#edeff8"}}>
          <div style={{textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: "0.14em", color: "#000000", marginBottom: "26px"}}>// TRUSTED BY ENGINEERS AT</div>
          {' '}
          <div style={{overflow: "hidden", width: "100%", WebkitMaskImage: "linear-gradient(90deg,transparent,#ffffff 12%,#ffffff 88%,transparent)", maskImage: "linear-gradient(90deg,transparent,#ffffff 12%,#ffffff 88%,transparent)"}}>
            <div style={{display: "flex", gap: "28px", width: "max-content", animation: "tickerScroll 26s linear infinite"}}>
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "54px", padding: "0 26px", background: "#ffffff", borderRadius: "14px", flexShrink: "0"}}>
                <img src="/img/landing/v2/logo-bitespeed.png" alt="Bitespeed" style={{maxHeight: "44px", maxWidth: "170px", width: "auto", objectFit: "contain"}} />
              </div>
              {' '}
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "54px", padding: "0 26px", background: "#ffffff", borderRadius: "14px", flexShrink: "0"}}>
                <img src="/img/landing/v2/logo-xeno.png" alt="Xeno" style={{maxHeight: "44px", maxWidth: "170px", width: "auto", objectFit: "contain"}} />
              </div>
              {' '}
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "54px", padding: "0 26px", background: "#ffffff", borderRadius: "14px", flexShrink: "0"}}>
                <img src="/img/landing/v2/logo-cordial.png" alt="Cordial" style={{maxHeight: "44px", maxWidth: "170px", width: "auto", objectFit: "contain"}} />
              </div>
              {' '}
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "54px", padding: "0 26px", background: "#ffffff", borderRadius: "14px", flexShrink: "0"}}>
                <img src="/img/landing/v2/logo-lendingkart.png" alt="Lending Kart" style={{maxHeight: "62px", maxWidth: "230px", width: "auto", objectFit: "contain"}} />
              </div>
              {' '}
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "54px", padding: "0 26px", background: "#ffffff", borderRadius: "14px", flexShrink: "0"}}>
                <img src="/img/landing/v2/logo-astrotalk.png" alt="Astro Talk" style={{maxHeight: "44px", maxWidth: "170px", width: "auto", objectFit: "contain"}} />
              </div>
              {' '}
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "54px", padding: "0 26px", background: "#ffffff", borderRadius: "14px", flexShrink: "0"}}>
                <img src="/img/landing/v2/logo-physicswallah.png" alt="Physics Wallah" style={{maxHeight: "44px", maxWidth: "170px", width: "auto", objectFit: "contain"}} />
              </div>
              {' '}
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "54px", padding: "0 26px", background: "#ffffff", borderRadius: "14px", flexShrink: "0"}}>
                <img src="/img/landing/v2/logo-bitespeed.png" alt="Bitespeed" style={{maxHeight: "44px", maxWidth: "170px", width: "auto", objectFit: "contain"}} />
              </div>
              {' '}
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "54px", padding: "0 26px", background: "#ffffff", borderRadius: "14px", flexShrink: "0"}}>
                <img src="/img/landing/v2/logo-xeno.png" alt="Xeno" style={{maxHeight: "44px", maxWidth: "170px", width: "auto", objectFit: "contain"}} />
              </div>
              {' '}
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "54px", padding: "0 26px", background: "#ffffff", borderRadius: "14px", flexShrink: "0"}}>
                <img src="/img/landing/v2/logo-cordial.png" alt="Cordial" style={{maxHeight: "44px", maxWidth: "170px", width: "auto", objectFit: "contain"}} />
              </div>
              {' '}
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "54px", padding: "0 26px", background: "#ffffff", borderRadius: "14px", flexShrink: "0"}}>
                <img src="/img/landing/v2/logo-lendingkart.png" alt="Lending Kart" style={{maxHeight: "62px", maxWidth: "230px", width: "auto", objectFit: "contain"}} />
              </div>
              {' '}
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "54px", padding: "0 26px", background: "#ffffff", borderRadius: "14px", flexShrink: "0"}}>
                <img src="/img/landing/v2/logo-astrotalk.png" alt="Astro Talk" style={{maxHeight: "44px", maxWidth: "170px", width: "auto", objectFit: "contain"}} />
              </div>
              {' '}
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "54px", padding: "0 26px", background: "#ffffff", borderRadius: "14px", flexShrink: "0"}}>
                <img src="/img/landing/v2/logo-physicswallah.png" alt="Physics Wallah" style={{maxHeight: "44px", maxWidth: "170px", width: "auto", objectFit: "contain"}} />
              </div>
            </div>
          </div>
        </div>
        <div id="platform" style={{position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "144px 48px 60px"}}>
          <div style={{display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "44px"}}>
            <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#193AE6"}}>01 / PLATFORM</div>
          </div>
          <div style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "500", fontSize: "48px", lineHeight: "1.05", letterSpacing: "-0.02em", color: "#000000", maxWidth: "760px", marginBottom: "72px"}}>One lakehouse.{' '}            <span style={{color: "#193AE6"}}>Two engines.</span></div>
          {' '}
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "34px"}}>
            {(engines || []).map((eng, engIdx) => (
              <React.Fragment key={engIdx}>
                                <a className="olakehome-h5" href={eng.href} target="_blank" rel="noopener noreferrer" style={{display: "block", position: "relative", borderRadius: "24px", padding: "40px 40px 44px", background: "linear-gradient(160deg, #4862EB, #193AE6)", border: "1px solid rgba(255, 255, 255, 0.14)", overflow: "hidden", minHeight: "340px", textDecoration: "none", color: "inherit", boxShadow: "0 22px 48px -24px rgba(25, 58, 230, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.22)", transition: "transform 0.18s ease, box-shadow 0.18s ease"}}>
                  <div style={{position: "absolute", top: "0", left: "0", right: "0", height: "44%", borderRadius: "24px 24px 60% 60%/24px 24px 22px 22px", background: "linear-gradient(180deg,rgba(255, 255, 255, 0.16),transparent)", pointerEvents: "none"}} />
                  {' '}
                  <div style={{position: "relative", display: "flex", flexDirection: "column", height: "100%"}}>
                    <div style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "34px", color: "#ffffff", marginBottom: "14px"}}>{eng.title}</div>
                    {' '}
                    <div style={{fontSize: "18px", lineHeight: "1.6", color: "#E4E8FF", maxWidth: "400px", flex: "1"}}>{eng.body}</div>
                    {' '}
                    <div style={{display: "flex", flexWrap: "wrap", gap: "8px", margin: "26px 0 24px"}}>
                      {(eng.chips || []).map((chip, chipIdx) => (
                        <React.Fragment key={chipIdx}>
                                                    <span style={{position: "relative", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#10131f", border: "1px solid rgba(16, 19, 31, 0.14)", background: "#ffffff", borderRadius: "7px", padding: "5px 11px"}}>
                            {chip.label}
                            {chip.soon ? (<>
                                                            <span style={{position: "absolute", top: "-8px", right: "-10px", background: "#14257A", color: "#ffffff", fontSize: "7px", fontWeight: "700", letterSpacing: "0.06em", padding: "2px 6px", borderRadius: "999px", whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(20,37,122,0.5)"}}>COMING SOON</span>
                            </>) : null}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                    {' '}
                    <span style={{alignSelf: "flex-start", fontWeight: "600", fontSize: "15px", color: "#ffffff"}}>{eng.link} →</span>
                  </div>
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div style={{maxWidth: "1360px", margin: "0 auto", padding: "124px 48px"}}>
          <div style={{display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "44px"}}>
            <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#193AE6"}}>02 / THE OLAKE ADVANTAGE</div>
            {' '}
            <div style={{display: "inline-flex", background: "rgba(0, 0, 0, 0.04)", border: "1px solid rgba(0, 0, 0, 0.1)", borderRadius: "999px", padding: "4px"}}>
              <div onClick={selectGo} style={{cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", padding: "7px 18px", borderRadius: "999px", fontSize: "12px", fontWeight: "500", background: `${goTabBg}`, color: `${goTabColor}`}}>Go</div>
              {' '}
              <div onClick={selectFusion} style={{cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", padding: "7px 18px", borderRadius: "999px", fontSize: "12px", fontWeight: "500", background: `${fusionTabBg}`, color: `${fusionTabColor}`}}>Fusion</div>
            </div>
          </div>
          {' '}
          <div style={{display: "block", position: "relative", borderRadius: "22px", padding: "48px 52px", backgroundImage: `${advantageBg}`, backgroundRepeat: "no-repeat, no-repeat", backgroundPosition: `${advantagePos}`, backgroundSize: "cover, cover", border: "1px solid rgba(255, 255, 255, 0.14)", overflow: "hidden", boxShadow: "0 22px 48px -24px rgba(25, 58, 230, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.22)"}}>
            <div style={{position: "absolute", top: "0", left: "0", right: "0", height: "44%", borderRadius: "22px 22px 60% 60%/22px 22px 20px 20px", background: "linear-gradient(180deg,rgba(255, 255, 255, 0.16),transparent)", pointerEvents: "none"}} />
            {' '}
            <div style={{position: "relative", display: "flex", alignItems: "center", gap: "56px"}}>
              {(advantageStats || []).map((stat, statIdx) => (
                <React.Fragment key={statIdx}>
                                    <div style={{flex: "1"}}>
                    <div data-countup={stat.num} data-prefix={stat.prefix} data-suffix={stat.suffix} data-decimals={stat.decimals} style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "600", fontSize: "96px", lineHeight: "0.9", letterSpacing: "-0.03em", color: "#ffffff"}}>{stat.value}</div>
                    {' '}
                    <div style={{fontSize: "18px", color: "#FFFFFF", marginTop: "18px"}}>{stat.label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{textAlign: "center", marginTop: "32px"}}>
            <a href={benchmarkHref} target="_blank" rel="noopener noreferrer" style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: "#193AE6"}}>view detailed benchmarks →</a>
          </div>
        </div>
        <div style={{padding: "112px 0 124px"}}>
          <div style={{maxWidth: "1360px", margin: "0 auto 34px", padding: "0 48px"}}>
            <div style={{display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "38px"}}>
              <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#193AE6"}}>03 / ARCHITECTURE</div>
            </div>
            {' '}
            <div style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "34px", color: "#000000", marginBottom: "12px"}}>Works with what you run</div>
            {' '}
            <div style={{fontSize: "17px", lineHeight: "1.6", color: "#03071a", maxWidth: "100%", width: "100%"}}>
              OLake Go supports ingestion from 8 different sources into Iceberg and Parquet.{' '}
              <br />
              OLake Fusion keeps your Iceberg tables fast, helping you scheduled compaction and maintenance.
            </div>
          </div>
          {' '}
          <div style={{maxWidth: "100%", margin: "0", padding: "0"}}>
            <div id="archFrame" style={{width: "100%", overflow: "hidden", border: "none", background: "transparent", height: "400px"}}>
              <div id="archCanvas" style={{width: "1680px", height: "452px", transform: "scale(0.66949)", transformOrigin: "top left"}}>
                <div style={{position: "relative", width: "1680px", height: "490px", margin: "0 auto", top: "16px"}}>
                  <svg viewBox="0 0 1680 490" style={{position: "absolute", inset: "0", width: "100%", height: "100%", zIndex: "1", overflow: "visible"}}>
                    <defs>
                      <marker id="ahd" markerWidth="10" markerHeight="10" refX="7" refY="4.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L9 4.5 L0 9 Z" fill="#6E7CFF" /></marker>
                    </defs>
                    {' '}
                    <g fill="none" stroke="#4F5BFF" strokeWidth="3" strokeDasharray="9 10" strokeLinecap="round">
                      <path id="flowA" d="M354 230 H480" />
                      {' '}
                      <path id="flowB" d="M784 230 H847 V130 H910" markerEnd="url(#ahd)" />
                      {' '}
                      <path id="flowC" d="M784 230 H847 V300 H910" markerEnd="url(#ahd)" />
                      {' '}
                      <path id="flowD" d="M1336 130 H1210" markerEnd="url(#ahd)" />
                    </g>
                    {' '}
                    <g fill="#8C97F5">
                      <circle r="5">
                        <animateMotion dur="1.9s" repeatCount="indefinite" calcMode="linear"><mpath href="#flowA" /></animateMotion>
                      </circle>
                      {' '}
                      <circle r="5">
                        <animateMotion dur="1.9s" begin="-0.95s" repeatCount="indefinite" calcMode="linear"><mpath href="#flowA" /></animateMotion>
                      </circle>
                      {' '}
                      <circle r="5">
                        <animateMotion dur="2.4s" repeatCount="indefinite" calcMode="linear"><mpath href="#flowB" /></animateMotion>
                      </circle>
                      {' '}
                      <circle r="5">
                        <animateMotion dur="2.4s" begin="-1.2s" repeatCount="indefinite" calcMode="linear"><mpath href="#flowB" /></animateMotion>
                      </circle>
                      {' '}
                      <circle r="5">
                        <animateMotion dur="2.4s" begin="-0.6s" repeatCount="indefinite" calcMode="linear"><mpath href="#flowC" /></animateMotion>
                      </circle>
                      {' '}
                      <circle r="5">
                        <animateMotion dur="2.4s" begin="-1.8s" repeatCount="indefinite" calcMode="linear"><mpath href="#flowC" /></animateMotion>
                      </circle>
                      {' '}
                      <circle r="4.5" fill="#AEB9FF">
                        <animateMotion dur="1.4s" repeatCount="indefinite" calcMode="linear"><mpath href="#flowD" /></animateMotion>
                      </circle>
                    </g>
                  </svg>
                  <div style={{position: "absolute", left: "28px", top: "85px", width: "320px", height: "298px", background: "#ffffff", border: "1px solid rgba(16,24,64,0.1)", borderRadius: "22px", padding: "28px 24px", zIndex: "2"}}>
                    <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", letterSpacing: "2px", color: "#6b7396", textAlign: "center", marginBottom: "22px"}}>SOURCES</div>
                    {' '}
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "13px"}}>
                      <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", color: "#2a3355", background: "#eef1fb", border: "1px solid rgba(16,24,64,0.1)", borderRadius: "11px", padding: "10px 16px"}}>Postgres</span>
                      {' '}
                      <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", color: "#2a3355", background: "#eef1fb", border: "1px solid rgba(16,24,64,0.1)", borderRadius: "11px", padding: "10px 16px"}}>MySQL</span>
                      {' '}
                      <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", color: "#2a3355", background: "#eef1fb", border: "1px solid rgba(16,24,64,0.1)", borderRadius: "11px", padding: "10px 16px"}}>MongoDB</span>
                      {' '}
                      <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", color: "#2a3355", background: "#eef1fb", border: "1px solid rgba(16,24,64,0.1)", borderRadius: "11px", padding: "10px 16px"}}>Oracle</span>
                      {' '}
                      <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", color: "#2a3355", background: "#eef1fb", border: "1px solid rgba(16,24,64,0.1)", borderRadius: "11px", padding: "10px 16px"}}>Kafka</span>
                      {' '}
                      <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", color: "#2a3355", background: "#eef1fb", border: "1px solid rgba(16,24,64,0.1)", borderRadius: "11px", padding: "10px 16px"}}>S3</span>
                      {' '}
                      <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", color: "#2a3355", background: "#eef1fb", border: "1px solid rgba(16,24,64,0.1)", borderRadius: "11px", padding: "10px 16px"}}>DB2 LUW</span>
                      {' '}
                      <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", color: "#2a3355", background: "#eef1fb", border: "1px solid rgba(16,24,64,0.1)", borderRadius: "11px", padding: "10px 16px"}}>MSSQL</span>
                    </div>
                  </div>
                  <div style={{position: "absolute", left: "480px", top: "100px", width: "304px", height: "260px", border: "2px solid #4F5BFF", borderRadius: "26px", padding: "34px 28px", textAlign: "center", zIndex: "2", color: "#132672", backgroundColor: "#193AE6"}}>
                    <div style={{width: "80px", height: "80px", margin: "0 auto 18px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(120,140,255,0.4)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <img src="/img/landing/shared/olake-mark-small.svg" alt="" style={{width: "46px", height: "46px", objectFit: "contain"}} />
                    </div>
                    {' '}
                    <div style={{fontWeight: "700", fontSize: "26px", color: "#ffffff"}}>OLake Go</div>
                    {' '}
                    <div style={{fontSize: "16px", color: "#FFFFFF", marginTop: "3px"}}>Ingestion engine</div>
                    {' '}
                    <div style={{display: "flex", justifyContent: "center", gap: "11px", marginTop: "20px"}}>
                      <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: "#FFFFFF", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(120,140,255,0.4)", borderRadius: "9px", padding: "7px 13px"}}>CDC</span>
                      {' '}
                      <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: "#FFFFFF", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(120,140,255,0.4)", borderRadius: "9px", padding: "7px 13px"}}>Chunking</span>
                    </div>
                  </div>
                  <div style={{position: "absolute", left: "910px", top: "65px", width: "300px", height: "130px", background: "#ffffff", border: "1px solid rgba(16,24,64,0.1)", borderRadius: "18px", boxShadow: "0 16px 40px -26px rgba(16,24,64,0.18)", display: "flex", alignItems: "center", gap: "16px", padding: "0 24px", zIndex: "2"}}>
                    <img src="/img/landing/v2/connector-iceberg.png" alt="Iceberg" style={{width: "64px", height: "64px", objectFit: "contain", flexShrink: "0"}} />
                    {' '}
                    <div>
                      <div style={{fontWeight: "700", fontSize: "22px", color: "#0a0f23"}}>Iceberg</div>
                      {' '}
                      <div style={{fontSize: "14px", color: "#5b6486", marginTop: "2px"}}>Tables & metadata</div>
                    </div>
                  </div>
                  <div style={{position: "absolute", left: "910px", top: "235px", width: "300px", height: "130px", background: "#ffffff", border: "1px solid rgba(16,24,64,0.1)", borderRadius: "18px", boxShadow: "0 16px 40px -26px rgba(16,24,64,0.18)", display: "flex", alignItems: "center", gap: "16px", padding: "0 24px", zIndex: "2"}}>
                    <img src="/img/landing/shared/parquet-icon.png" alt="Parquet" style={{width: "64px", height: "64px", objectFit: "contain", flexShrink: "0"}} />
                    {' '}
                    <div>
                      <div style={{fontWeight: "700", fontSize: "22px", color: "#0a0f23"}}>Parquet on S3</div>
                      {' '}
                      <div style={{fontSize: "14px", color: "#5b6486", marginTop: "2px"}}>Columnar tables</div>
                    </div>
                  </div>
                  <div style={{position: "absolute", left: "1336px", top: "70px", width: "287px", height: "311px", border: "2px solid #4F5BFF", borderRadius: "26px", padding: "34px 28px", textAlign: "center", zIndex: "2", backgroundColor: "#193AE6"}}>
                    <div style={{width: "80px", height: "80px", margin: "0 auto 18px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(120,140,255,0.4)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <img src="/img/landing/shared/olake-mark-small.svg" alt="" style={{width: "46px", height: "46px", objectFit: "contain"}} />
                    </div>
                    {' '}
                    <div style={{fontWeight: "700", fontSize: "26px", color: "#ffffff"}}>OLake Fusion</div>
                    {' '}
                    <div style={{fontSize: "16px", color: "#FFFFFF", marginTop: "3px"}}>Maintenance engine</div>
                    {' '}
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "11px", marginTop: "20px"}}>
                      <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", borderRadius: "9px", padding: "8px 13px", background: "rgba(25,58,230,0.32)", border: "1px solid #6E7CFF", color: "#FFFFFF"}}>Compaction</span>
                      {' '}
                      <span style={{position: "relative", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", borderRadius: "9px", padding: "8px 13px", background: "rgba(25,58,230,0.32)", border: "1px solid #6E7CFF", color: "#FFFFFF"}}>
                        Cleanup
                        <span style={{position: "absolute", top: "-12px", right: "-15px", fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.3px", color: "#ffffff", background: "#14257A", borderRadius: "7px", padding: "3px 7px", whiteSpace: "nowrap", boxShadow: "0 3px 8px -2px rgba(20,37,122,0.6)"}}>COMING SOON</span>
                      </span>
                      {' '}
                      <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", borderRadius: "9px", padding: "8px 13px", background: "rgba(25,58,230,0.32)", border: "1px solid #6E7CFF", color: "#FFFFFF"}}>Logs & metrics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{maxWidth: "1360px", margin: "0 auto", padding: "104px 48px 124px"}}>
          <div style={{display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "56px"}}>
            <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#193AE6"}}>04 / WHY OLAKE</div>
          </div>
          {' '}
          <div style={{display: "flex", flexDirection: "column", gap: "0"}}>
            {(whyRows || []).map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                                <div style={{position: "sticky", top: `${row.stickyTop}px`, zIndex: `${row.z}`, paddingBottom: "26px"}}>
                  <div style={{border: "1px solid rgba(0, 0, 0, 0.1)", borderTop: `3px solid ${row.accent}`, borderRadius: "18px", background: "linear-gradient(160deg,#e7ecff,#f2f5ff)", boxShadow: "0 -24px 60px -20px rgba(255, 255, 255, 0.85)", overflow: "hidden"}}>
                    <div style={{display: "flex", alignItems: "center", gap: "16px", height: "40px", padding: "0 48px", boxSizing: "border-box", background: "linear-gradient(160deg, #4862EB, #193AE6)", borderBottom: "1px solid rgba(212, 215, 228, 0.12)"}}>
                      <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#F6F6F9"}}>{row.num}</div>
                      {' '}
                      <div style={{width: "9px", height: "9px", borderRadius: "50%", background: `${row.accent}`, boxShadow: `0 0 10px ${row.accent}`}} />
                      {' '}
                      <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", letterSpacing: "0.16em", fontWeight: "600", color: "#EFF0F4"}}>{row.kicker}</div>
                    </div>
                    {' '}
                    <div style={{padding: "8px 48px 44px", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "40px", alignItems: "start"}}>
                      <div style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "400", fontSize: "30px", lineHeight: "1.12", color: "#000000"}}>{row.title}</div>
                      {' '}
                      <div style={{fontSize: "17px", lineHeight: "1.7", color: "#121212", paddingTop: "8px"}}>{row.body}</div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div style={{maxWidth: "1360px", margin: "0 auto", padding: "0 48px 132px"}}>
          <div style={{maxWidth: "1360px", margin: "0 auto", padding: "0 48px 132px"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "60px", marginBottom: "48px", flexWrap: "wrap"}}>
              <div style={{flex: "1", minWidth: "300px"}}>
                <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#193AE6", marginBottom: "20px"}}>06 / USER STORIES</div>
                {' '}
                <div style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "44px", lineHeight: "1.08", letterSpacing: "-0.02em", color: "#000000", maxWidth: "520px", width: "630px", height: "42px"}}>
                  {' '}In OLake, they{' '}
                  <span style={{color: "rgb(25, 58, 230)"}}>trust.</span>
                </div>
              </div>
              {' '}
              <div style={{flex: "1", minWidth: "300px", maxWidth: "520px", paddingTop: "44px"}} />
            </div>
            {' '}
            <div style={{display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px"}}>
              <a href="/customer-stories/xeno-aws-dms-alternative-mysql-cdc" aria-label="Read the customer story" style={{display: "block", position: "relative", borderRadius: "18px", overflow: "hidden", minHeight: "460px", display: "flex", flexDirection: "column", justifyContent: "flex-end", boxShadow: "0 24px 50px -26px rgba(0,0,0,0.5)"}}>
                <img src="/img/landing/v2/story-xeno.svg" alt="Xeno customer story" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", background: "#0a0f23"}} />
                {' '}
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(8,11,26,0.05) 0%, rgba(8,11,26,0.35) 42%, rgba(8,11,26,0.92) 100%)", pointerEvents: "none"}} />
                {' '}
                <div style={{position: "absolute", top: "24px", left: "24px", background: "#ffffff", borderRadius: "11px", padding: "11px 17px", display: "flex", alignItems: "center", boxShadow: "0 6px 18px -8px rgba(0,0,0,0.5)"}}>
                  <img src="/img/landing/v2/logo-xeno.png" alt="Xeno" style={{height: "26px", width: "auto", objectFit: "contain", display: "block"}} />
                </div>
                {' '}
                <div style={{position: "relative", padding: "30px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "25px", lineHeight: "1.28", color: "#ffffff"}}>
                  <span style={{color: "#93A6FF"}}>Zero pipeline failure</span>
                  , 50% faster loads.
                </div>
              </a>
              {' '}
              <a href="/customer-stories/cordial-real-time-data-sync" aria-label="Read the customer story" style={{display: "block", position: "relative", borderRadius: "18px", overflow: "hidden", minHeight: "460px", display: "flex", flexDirection: "column", justifyContent: "flex-end", boxShadow: "0 24px 50px -26px rgba(0,0,0,0.5)"}}>
                <img src="/img/landing/v2/story-cordial.svg" alt="Cordial customer story" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", background: "#0a0f23"}} />
                {' '}
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(8,11,26,0.05) 0%, rgba(8,11,26,0.35) 42%, rgba(8,11,26,0.92) 100%)", pointerEvents: "none"}} />
                {' '}
                <div style={{position: "absolute", top: "24px", left: "24px", background: "#ffffff", borderRadius: "11px", padding: "11px 17px", display: "flex", alignItems: "center", boxShadow: "0 6px 18px -8px rgba(0,0,0,0.5)"}}>
                  <img src="/img/landing/v2/logo-cordial.png" alt="Cordial" style={{height: "26px", width: "auto", objectFit: "contain", display: "block"}} />
                </div>
                {' '}
                <div style={{position: "relative", padding: "30px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "25px", lineHeight: "1.28", color: "#ffffff"}}>
                  Cordial's path to an{' '}
                  <span style={{color: "#93A6FF"}}>AI-ready lakehouse</span>
                  .
                </div>
              </a>
              {' '}
              <a href="/customer-stories/bitespeed-segmentation-queries" aria-label="Read the customer story" style={{display: "block", position: "relative", borderRadius: "18px", overflow: "hidden", minHeight: "460px", display: "flex", flexDirection: "column", justifyContent: "flex-end", boxShadow: "0 24px 50px -26px rgba(0,0,0,0.5)"}}>
                <img src="/img/landing/v2/story-bitespeed.svg" alt="Bitespeed customer story" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", background: "#0a0f23"}} />
                {' '}
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(8,11,26,0.05) 0%, rgba(8,11,26,0.35) 42%, rgba(8,11,26,0.92) 100%)", pointerEvents: "none"}} />
                {' '}
                <div style={{position: "absolute", top: "24px", left: "24px", background: "#ffffff", borderRadius: "11px", padding: "11px 17px", display: "flex", alignItems: "center", boxShadow: "0 6px 18px -8px rgba(0,0,0,0.5)"}}>
                  <img src="/img/landing/v2/logo-bitespeed.png" alt="Bitespeed" style={{height: "26px", width: "auto", objectFit: "contain", display: "block"}} />
                </div>
                {' '}
                <div style={{position: "relative", padding: "30px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "25px", lineHeight: "1.28", color: "#ffffff"}}>
                  From{' '}
                  <span style={{color: "#93A6FF"}}>40-minute to sub-minute</span>
                  {' '}segmentation queries.
                </div>
              </a>
            </div>
            {' '}
            <div style={{display: "flex", justifyContent: "flex-end", marginTop: "36px"}}>
              <a href="/customer-stories/" style={{display: "inline-flex", alignItems: "center", gap: "10px", color: "#193AE6", fontWeight: "600", fontSize: "16px"}}>Explore our case studies →</a>
            </div>
          </div>
          <div id="enterprise" style={{maxWidth: "1360px", margin: "0 auto 132px", padding: "0 48px", scrollMarginTop: "90px"}}>
            <div style={{position: "relative", border: "1px solid rgba(212, 215, 228, 0.12)", borderRadius: "24px", padding: "72px 56px", background: "linear-gradient(180deg,#191d29,#262b3b)", overflow: "hidden"}}>
              {/* image-slot: Drop the Apache Iceberg background image */}
              {' '}
              <div style={{position: "absolute", inset: "0", background: "linear-gradient(90deg, rgba(25, 29, 41, 0.94), rgba(25, 29, 41, 0.6) 60%, rgba(25, 29, 41, 0.3))", pointerEvents: "none"}} />
              {' '}
              <div style={{position: "absolute", inset: "0", backgroundImage: "linear-gradient(rgba(25, 58, 230, 0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(25, 58, 230, 0.08) 1px,transparent 1px)", backgroundSize: "44px 44px", WebkitMaskImage: "radial-gradient(ellipse 60% 100% at 100% 50%,#ffffff,transparent)", maskImage: "radial-gradient(ellipse 60% 100% at 100% 50%,#ffffff,transparent)", background: "url(\"/img/landing/v2/enterprise-cta-bg.webp\") center / cover no-repeat", overflow: "visible", top: "-1px"}} />
              {' '}
              <div style={{position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px", flexWrap: "wrap"}}>
                <div style={{maxWidth: "620px"}}>
                  <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: "0.08em", color: "#F6F8FE", marginBottom: "16px"}}>// OLAKE FOR ENTERPRISES</div>
                  {' '}
                  <div style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "42px", lineHeight: "1.1", letterSpacing: "-0.02em", color: "#d9dceb", marginBottom: "18px"}}>Built for the way your team runs data.</div>
                  {' '}
                  <div style={{fontSize: "18px", lineHeight: "1.65", color: "#FFFFFF"}}>
                    Custom pricing and packages for enterprises based on your requirements. Leave your contact information and our team will get in touch.
                  </div>
                </div>
                {' '}
                <a className="olakehome-h3" href="/contact" style={{background: "#193AE6", color: "#ffffff", padding: "16px 36px", borderRadius: "11px", fontWeight: "600", fontSize: "17px", whiteSpace: "nowrap", boxShadow: "0 6px 0 #5762da, 0 8px 14px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(0, 0, 0, 0.32)", transition: "transform 0.07s ease, box-shadow 0.07s ease"}}>Get in Touch →</a>
              </div>
            </div>
          </div>
          {' '}
          <div style={{maxWidth: "1360px", margin: "0 auto", padding: "0 48px 132px"}}>
            <div style={{display: "flex", alignItems: "baseline", gap: "22px", flexWrap: "wrap", marginBottom: "48px"}}>
              <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#193AE6"}}>05 / BULLETIN</div>
              <a href="/blog" style={{color: "#193AE6", fontWeight: "600", fontSize: "15px", marginLeft: "auto"}}>View all →</a>
            </div>
            {' '}
            <div style={{display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "48px"}}>
              {(bulletin || []).map((post, postIdx) => (
                <React.Fragment key={postIdx}>
                                    <a className="olakehome-h6" href={post.url} target="_blank" rel="noopener noreferrer" style={{display: "flex", gap: "22px", alignItems: "flex-start", color: "inherit", textDecoration: "none"}}>
                    <div style={{width: "99px", height: "83px", flexShrink: "0", borderRadius: "10px", overflow: "hidden", background: "#e7ecff"}}>
                      <img src={post.img} alt={post.title} style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} />
                    </div>
                    {' '}
                    <div style={{flex: "1", paddingTop: "4px"}}>
                      <div style={{display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: "500", letterSpacing: "0.08em", color: "#193AE6", border: "1px solid rgba(25,58,230,0.4)", borderRadius: "4px", padding: "5px 10px", marginBottom: "16px"}}>{post.tag}</div>
                      {' '}
                      <div style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "600", fontSize: "18px", color: "#070911", lineHeight: "1.3", textDecoration: "underline", textUnderlineOffset: "4px", textDecorationThickness: "1px", textDecorationColor: "rgba(0,0,0,0.35)", width: "156px", height: "35px"}}>{post.title}</div>
                    </div>
                  </a>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{maxWidth: "1360px", margin: "0 auto", padding: "0 48px 132px"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "40px", marginBottom: "40px", flexWrap: "wrap"}}>
              <div style={{flex: "1", minWidth: "300px"}}>
                <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#193AE6", marginBottom: "20px"}}>07 / ADDITIONAL RESOURCES</div>
              </div>
              {' '}
              <a href="/blog" style={{color: "#193AE6", fontWeight: "600", fontSize: "16px", whiteSpace: "nowrap"}}>All resources →</a>
            </div>
            {' '}
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "start"}}>
              <a className="olakehome-h7" href="https://youtu.be/IcAJmW72d2A?si=hhKFCgp0Dsl2pRGp" target="_blank" rel="noopener noreferrer" style={{position: "relative", background: "#111319", borderRadius: "20px", padding: "18px", display: "flex", flexDirection: "column", overflow: "hidden", color: "inherit", textDecoration: "none", transition: "transform 0.3s ease, box-shadow 0.3s ease"}}>
                <div style={{position: "relative", aspectRatio: "16/10", borderRadius: "12px", overflow: "hidden", background: "#5B8DEF", backgroundImage: "linear-gradient(rgba(255,255,255,0.16) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.16) 1px,transparent 1px)", backgroundSize: "22px 22px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <div style={{width: "47%", background: "#ffffff", borderRadius: "7px", padding: "20px 20px 24px", boxShadow: "0 24px 48px -14px rgba(0,0,0,0.4)", transform: "rotate(-0.5deg)"}}>
                    <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.1em", color: "#193AE6", marginBottom: "12px"}}>DOCUMENTATION</div>
                    {' '}
                    <img src="/img/landing/shared/olake-logo.svg" alt="OLake" style={{height: "20px", width: "auto", display: "block", marginBottom: "18px"}} />
                    {' '}
                    <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                      <div style={{height: "7px", width: "70%", borderRadius: "3px", background: "#c9dbff"}} />
                      {' '}
                      <div style={{height: "7px", width: "52%", borderRadius: "3px", background: "#c9dbff"}} />
                      {' '}
                      <div style={{height: "7px", width: "88%", borderRadius: "3px", background: "#e3ecff"}} />
                      {' '}
                      <div style={{height: "7px", width: "80%", borderRadius: "3px", background: "#e3ecff"}} />
                      {' '}
                      <div style={{height: "7px", width: "90%", borderRadius: "3px", background: "#e3ecff"}} />
                      {' '}
                      <div style={{height: "7px", width: "64%", borderRadius: "3px", background: "#e3ecff"}} />
                    </div>
                  </div>
                </div>
                {' '}
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "26px 12px 14px", gap: "20px"}}>
                  <div style={{flex: "1"}}>
                    <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: "0.1em", color: "#9AA0BD", marginBottom: "16px"}}>DOCUMENTATION</div>
                    {' '}
                    <div style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "25px", lineHeight: "1.15", color: "#ffffff"}}>New to OLake?{' '}                      <br />Head to our docs</div>
                  </div>
                  {' '}
                  <div style={{fontSize: "26px", color: "#ffffff", lineHeight: "1"}}>→</div>
                </div>
              </a>
              {' '}
              <div style={{display: "flex", flexDirection: "column", borderBottom: "1px solid rgba(0, 0, 0, 0.12)"}}>
                {(resources || []).map((res, resIdx) => (
                  <React.Fragment key={resIdx}>
                                        <a className="olakehome-h8" href={res.href} target="_blank" rel="noopener noreferrer" style={{borderTop: "1px solid rgba(0, 0, 0, 0.12)", padding: "26px 0", display: "flex", flexDirection: "column", gap: "14px", color: "inherit"}}>
                      <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: "500", letterSpacing: "0.1em", color: "#193AE6"}}>{res.type}</div>
                      {' '}
                      <div style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "21px", lineHeight: "1.28", color: "#070911"}}>{res.title} →</div>
                    </a>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="footer-wrap" style={{background: "#F7F8FA", padding: "64px 64px 0", overflow: "hidden", position: "relative"}}>
          <div style={{maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", gap: "40px", flexWrap: "wrap", position: "relative", zIndex: "1"}}>
            <div>
              <div style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "24px", color: "#3D4FF0", marginBottom: "20px"}}>OLake</div>
              <h2 className="footer-hero" style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "600", fontSize: "38px", lineHeight: "1.15", color: "#10173A", maxWidth: "480px"}}>Fastest{' '}<span style={{fontWeight: "800"}}>Data Replication</span></h2>
              <div style={{display: "flex", alignItems: "center", gap: "16px", marginTop: "28px"}}>
          <a className="olake-footer-social" href="https://www.linkedin.com/company/datazipio/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #DADEEA", display: "flex", alignItems: "center", justifyContent: "center", color: "#5B6484"}}><PiLinkedinLogo size={17} aria-hidden /></a>
          <a className="olake-footer-social" href="https://www.youtube.com/@olakeio" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #DADEEA", display: "flex", alignItems: "center", justifyContent: "center", color: "#5B6484"}}><PiYoutubeLogo size={17} aria-hidden /></a>
          <a className="olake-footer-social" href="/slack" aria-label="Slack" style={{width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #DADEEA", display: "flex", alignItems: "center", justifyContent: "center", color: "#5B6484"}}><PiSlackLogo size={17} aria-hidden /></a>
          <a className="olake-footer-social" href="https://x.com/_olake" target="_blank" rel="noopener noreferrer" aria-label="X" style={{width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #DADEEA", display: "flex", alignItems: "center", justifyContent: "center", color: "#5B6484"}}><PiXLogo size={17} aria-hidden /></a>
              </div>
            </div>
            <div style={{display: "flex", gap: "64px", flexWrap: "wrap"}}>
            <div>
              <div style={{fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", letterSpacing: "0.08em", fontWeight: "700", color: "#10173A", marginBottom: "18px"}}>COMPANY</div>
              <div style={{display: "flex", flexDirection: "column", gap: "14px", fontSize: "15px", color: "#8890A8"}}>
              <a className="olake-footer-link" href="/about-us" style={{color: "#8890A8"}}>About us</a>
              <a className="olake-footer-link" href="/contact" style={{color: "#8890A8"}}>Contact us</a>
              <a className="olake-footer-link" href="/branding" style={{color: "#8890A8"}}>Branding</a>
              <a className="olake-footer-link" href="/terms-of-use" style={{color: "#8890A8"}}>Terms of Use</a>
              <a className="olake-footer-link" href="/privacy-policy" style={{color: "#8890A8"}}>Privacy Policy</a>
              </div>
            </div>
            <div>
              <div style={{fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", letterSpacing: "0.08em", fontWeight: "700", color: "#10173A", marginBottom: "18px"}}>RESOURCES</div>
              <div style={{display: "flex", flexDirection: "column", gap: "14px", fontSize: "15px", color: "#8890A8"}}>
              <a className="olake-footer-link" href="/blog" style={{color: "#8890A8"}}>Blogs</a>
              <a className="olake-footer-link" href="/docs" style={{color: "#8890A8"}}>Docs</a>
              <a className="olake-footer-link" href="/search" style={{color: "#8890A8"}}>Search</a>
              </div>
            </div>
            <div>
              <div style={{fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", letterSpacing: "0.08em", fontWeight: "700", color: "#10173A", marginBottom: "18px"}}>TOP READS</div>
              <div style={{display: "flex", flexDirection: "column", gap: "14px", fontSize: "15px", color: "#8890A8", maxWidth: "180px"}}>
              <a className="olake-footer-link" href="/blog/issues-debezium-kafka" style={{color: "#8890A8"}}>Issues with Debezium</a>
              <a className="olake-footer-link" href="/blog/olake-architecture" style={{color: "#8890A8"}}>OLake Architecture</a>
              </div>
            </div>
            </div>
          </div>
          <div style={{maxWidth: "1280px", margin: "40px auto 0", position: "relative", zIndex: "1", fontSize: "13px", color: "#AEB4C4", paddingBottom: "24px"}}>By Datazip</div>
          <div className="footer-watermark" style={{fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "260px", lineHeight: "1", color: "#EDEFF4", whiteSpace: "nowrap", textAlign: "center", userSelect: "none"}}>OLake</div>
        </div>
      </div>
      </div>
    </Layout>
  )
}
