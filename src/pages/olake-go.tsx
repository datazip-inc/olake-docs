// @ts-nocheck
import React from 'react'
import Layout from '@theme/Layout'
import LandingSeo from '@site/src/components/landing/seo/LandingSeo'
import LightModeEnforcer from '@site/src/components/LightModeEnforcer'
import { useGoLogic } from '@site/src/components/landing/pages/useGoLogic'
import { cssToObj as __css } from '@site/src/components/landing/pages/cssToObj'
import { GO_SEO } from '@site/src/data/landing/seo'
import '@site/src/components/landing/pages/olake-go.css'
import '@site/src/components/landing/pages/overrides.css'

export default function OLakeGoPage() {
  const {
    icebergStyle,
    problemSentences,
    features,
    benchSources,
    benchModes,
    benchModeIndicatorLeft,
    benchCols,
    benchTable,
    benchComingSoon,
    benchHasData,
    benchSourceName,
    faqs,
    toggleFaq,
    selectFeature,
    benchmarksInfoOpen,
    benchmarkInfoArrow,
    toggleBenchmarkInfo,
    mobileMenuOpen,
    toggleMobileMenu,
    resourcesOpen,
    productOpen,
    openProduct,
    closeProduct,
    contributorsOpen,
    openResources,
    closeResources,
    openContributors,
    closeContributors
  } = useGoLogic({ icebergPosX: 54, icebergPosY: 53, icebergZoom: 100, icebergOpacity: 65 })

  return (
    <Layout
      title={GO_SEO.title}
      description={GO_SEO.description}
      wrapperClassName='landing-page'
    >
      <LandingSeo
        title={GO_SEO.title}
        description={GO_SEO.description}
        twitterDescription={GO_SEO.twitterDescription}
        canonicalUrl={GO_SEO.canonicalUrl}
        ogImage={GO_SEO.ogImage}
        jsonLdSchemas={GO_SEO.jsonLdSchemas}
      />
      <LightModeEnforcer />
      <div className='olakego-page olake-design-page'>
        <div
          style={{
            position: 'fixed',
            inset: '0',
            zIndex: '-1',
            pointerEvents: 'none',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-140px',
              left: '-120px',
              width: '520px',
              height: '520px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(61,79,240,0.13), transparent 70%)',
              filter: 'blur(18px)'
            }}
          />{' '}
          <div
            style={{
              position: 'absolute',
              top: '32%',
              right: '-160px',
              width: '560px',
              height: '560px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(110,124,255,0.11), transparent 70%)',
              filter: 'blur(20px)'
            }}
          />{' '}
          <div
            style={{
              position: 'absolute',
              bottom: '-180px',
              left: '24%',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(140,151,245,0.10), transparent 70%)',
              filter: 'blur(24px)'
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#10173A',
            background: 'transparent',
            width: '100%',
            overflowX: 'hidden'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              scrollSnapAlign: 'start'
            }}
          >
            <div
              className='hero-wrap'
              style={{
                position: 'relative',
                padding: '56px 64px 36px',
                maxWidth: '1120px',
                margin: '0 auto',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  zIndex: '-1',
                  left: '50%',
                  top: '-30px',
                  transform: 'translateX(-50%)',
                  width: 'min(640px,90%)',
                  height: '300px',
                  background:
                    'radial-gradient(ellipse at center, rgba(61,79,240,0.18), transparent 70%)'
                }}
              />{' '}
              <div
                style={{
                  position: 'absolute',
                  zIndex: '-1',
                  left: '50%',
                  top: '28px',
                  transform: 'translateX(-50%)',
                  width: 'calc(100% - 16px)',
                  height: 'calc(100% - 28px)',
                  borderRadius: '30px',
                  background: 'linear-gradient(180deg,#FFFFFF 0%, #EEF1FF 100%)',
                  border: '1px solid rgba(61,79,240,0.12)',
                  boxShadow:
                    '0 44px 90px -44px rgba(61,79,240,0.32), 0 2px 0 rgba(255,255,255,0.9) inset'
                }}
              />{' '}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#EEF0FE',
                  border: '1px solid #C7CEFB',
                  borderRadius: '999px',
                  padding: '8px 18px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  color: '#3D4FF0',
                  marginBottom: '32px'
                }}
              >
                <img
                  loading='lazy'
                  decoding='async'
                  src='/img/landing/shared/olake-mark-mono.svg'
                  alt=''
                  style={{ width: '12px', height: '12px' }}
                />{' '}
                OLAKE GO
              </div>{' '}
              <h1
                className='hero-title'
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: '500',
                  fontSize: '49px',
                  lineHeight: '1.12',
                  letterSpacing: '-0.01em',
                  color: '#0D1230',
                  margin: '0'
                }}
              >
                Fastest Replication to Iceberg & S3
              </h1>{' '}
              <div
                className='hero-btns'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  marginTop: '36px'
                }}
              >
                <a
                  className='olakego-h2'
                  href='/docs/getting-started/quickstart/'
                  style={{
                    color: '#fff',
                    background: '#3D4FF0',
                    padding: '14px 28px',
                    borderRadius: '9px',
                    fontWeight: '600',
                    fontSize: '15px',
                    border: '2px solid #3D4FF0',
                    boxShadow: '0 5px 0 #23309E',
                    transform: 'translateY(-2px)',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  Get Started
                </a>{' '}
                <a
                  className='olakego-h3'
                  href='/contact'
                  style={{
                    color: '#10173A',
                    background: '#fff',
                    padding: '14px 28px',
                    borderRadius: '9px',
                    fontWeight: '600',
                    fontSize: '15px',
                    border: '2px solid #10173A',
                    boxShadow: '0 5px 0 #10173A',
                    transform: 'translateY(-2px)',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  Talk to us
                </a>
              </div>
            </div>
          </div>
          <div
            className='arch-wrap'
            style={{
              maxWidth: '900px',
              width: '100%',
              margin: '28px auto 56px',
              padding: '20px 40px',
              position: 'relative',
              zIndex: '10'
            }}
          >
            <div
              className='arch-inner'
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'start',
                height: '326px',
                position: 'relative'
              }}
            >
              <svg
                id='arch-links'
                style={{
                  position: 'absolute',
                  inset: '0',
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  overflow: 'visible',
                  zIndex: '-1'
                }}
              />
              <div
                className='arch-sources'
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '7px',
                  flexShrink: '0',
                  justifySelf: 'start'
                }}
              >
                <div
                  className='arch-src-label'
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '10px',
                    letterSpacing: '0.09em',
                    color: '#8890A8',
                    fontWeight: '600',
                    marginBottom: '3px',
                    textAlign: 'center'
                  }}
                >
                  SOURCES
                </div>{' '}
                <div
                  className='src-box'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    background: '#fff',
                    border: '1.5px solid #E1E4F3',
                    borderRadius: '9px',
                    padding: '6px 12px'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#336791',
                      flexShrink: '0'
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10173A',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Postgres
                  </span>
                </div>{' '}
                <div
                  className='src-box'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    background: '#fff',
                    border: '1.5px solid #E1E4F3',
                    borderRadius: '9px',
                    padding: '6px 12px'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#47A248',
                      flexShrink: '0'
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10173A',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    MongoDB
                  </span>
                </div>{' '}
                <div
                  className='src-box'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    background: '#fff',
                    border: '1.5px solid #E1E4F3',
                    borderRadius: '9px',
                    padding: '6px 12px'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#E48E00',
                      flexShrink: '0'
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10173A',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    MySQL
                  </span>
                </div>{' '}
                <div
                  className='src-box'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    background: '#fff',
                    border: '1.5px solid #E1E4F3',
                    borderRadius: '9px',
                    padding: '6px 12px'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#231F20',
                      flexShrink: '0'
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10173A',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Kafka
                  </span>
                </div>{' '}
                <div
                  className='src-box'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    background: '#fff',
                    border: '1.5px solid #E1E4F3',
                    borderRadius: '9px',
                    padding: '6px 12px'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#E25444',
                      flexShrink: '0'
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10173A',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    S3
                  </span>
                </div>{' '}
                <div
                  className='src-box'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    background: '#fff',
                    border: '1.5px solid #E1E4F3',
                    borderRadius: '9px',
                    padding: '6px 12px'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#C74634',
                      flexShrink: '0'
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10173A',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Oracle
                  </span>
                </div>{' '}
                <div
                  className='src-box'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    background: '#fff',
                    border: '1.5px solid #E1E4F3',
                    borderRadius: '9px',
                    padding: '6px 12px'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#A91D22',
                      flexShrink: '0'
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10173A',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    MSSQL
                  </span>
                </div>{' '}
                <div
                  className='src-box'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    background: '#fff',
                    border: '1.5px solid #E1E4F3',
                    borderRadius: '9px',
                    padding: '6px 12px'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#1F70C1',
                      flexShrink: '0'
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10173A',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    DB2 LUW
                  </span>
                </div>
              </div>
              <div
                className='arch-node'
                style={{
                  textAlign: 'center',
                  flexShrink: '0',
                  justifySelf: 'center',
                  transform: 'translateY(68px)'
                }}
              >
                <div
                  id='olake-node'
                  style={{
                    width: '116px',
                    height: '116px',
                    borderRadius: '22px',
                    border: '2px solid #8EA0FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    animation: 'fusionPulseRing 2.4s ease-in-out infinite',
                    backgroundColor: '#193AE6'
                  }}
                >
                  <img
                    loading='lazy'
                    decoding='async'
                    src='/img/landing/shared/olake-mark-small.svg'
                    alt='OLake Go'
                    style={{ width: '42px', height: '42px' }}
                  />
                </div>{' '}
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: '700',
                    fontSize: '14px',
                    color: '#10173A',
                    marginTop: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  OLake Go
                </div>{' '}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '14px',
                    justifyContent: 'center'
                  }}
                >
                  <div
                    style={{
                      border: '1px solid #E1E4F3',
                      color: '#10173A',
                      fontSize: '11px',
                      padding: '5px 10px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      animation: 'lightUp1 4s ease-in-out infinite'
                    }}
                  >
                    Full Load
                  </div>{' '}
                  <div
                    style={{
                      border: '1px solid #E1E4F3',
                      color: '#10173A',
                      fontSize: '11px',
                      padding: '5px 10px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      animation: 'lightUp2 4s ease-in-out infinite'
                    }}
                  >
                    CDC
                  </div>{' '}
                  <div
                    style={{
                      border: '1px solid #E1E4F3',
                      color: '#10173A',
                      fontSize: '11px',
                      padding: '5px 10px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      animation: 'lightUp3 4s ease-in-out infinite'
                    }}
                  >
                    Incremental
                  </div>
                </div>
              </div>
              <div
                id='opt-node'
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  flexShrink: '0',
                  justifySelf: 'end',
                  transform: 'translateY(96px)'
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '10px',
                    letterSpacing: '0.09em',
                    color: '#8890A8',
                    fontWeight: '600'
                  }}
                >
                  DESTINATIONS
                </div>{' '}
                <div
                  className='dest-box'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#fff',
                    border: '2px solid #3D4FF0',
                    borderRadius: '14px',
                    padding: '11px 16px',
                    boxShadow: '0 0 0 6px rgba(61,79,240,0.08)'
                  }}
                >
                  <img
                    loading='lazy'
                    decoding='async'
                    src='/img/landing/shared/iceberg-icon.webp'
                    alt='Iceberg'
                    style={{ height: '20px', width: 'auto' }}
                  />{' '}
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: '600',
                      fontSize: '13px',
                      color: '#10173A',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Iceberg Tables
                  </span>
                </div>{' '}
                <div
                  className='dest-box'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#fff',
                    border: '1.5px solid #E1E4F3',
                    borderRadius: '14px',
                    padding: '11px 16px'
                  }}
                >
                  <img
                    loading='lazy'
                    decoding='async'
                    src='/img/landing/shared/parquet-icon.webp'
                    alt='Parquet'
                    style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                  />{' '}
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: '600',
                      fontSize: '13px',
                      color: '#10173A',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Parquet Files
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            minHeight: '65vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            scrollSnapAlign: 'start',
            borderTop: '1px solid rgba(27,30,43,0.08)'
          }}
        >
          <div
            className='problem-wrap'
            style={{
              maxWidth: '1160px',
              width: '100%',
              margin: '0 auto',
              padding: '48px 64px 90px',
              textAlign: 'center',
              color: '#000000'
            }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                letterSpacing: '0.08em',
                color: '#3D4FF0',
                fontWeight: '500',
                marginBottom: '32px'
              }}
            >
              THE PROBLEM
            </div>{' '}
            <div
              className='problem-cloud'
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '920px',
                height: '400px',
                margin: '0 auto'
              }}
            >
              <svg
                viewBox='0 0 820 330'
                preserveAspectRatio='none'
                style={{
                  position: 'absolute',
                  inset: '-6% -4%',
                  width: '108%',
                  height: '112%',
                  zIndex: '0'
                }}
              >
                <defs>
                  <linearGradient id='cloudFill' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#FBFBFE' />{' '}
                    <stop offset='100%' stopColor='#F4F5FC' />
                  </linearGradient>
                </defs>{' '}
                <path
                  d='M205,278 C150,278 108,246 100,206 C60,200 34,168 34,132 C34,96 62,66 100,60 C108,26 146,2 192,2 C224,2 253,15 272,37 C296,16 331,4 370,4 C424,4 470,32 486,72 C505,58 530,50 557,50 C607,50 650,80 662,120 C712,120 752,152 752,192 C752,228 720,258 678,262 C670,290 636,310 596,310 C572,310 550,303 533,290 C512,306 481,316 447,316 C420,316 396,310 377,299 C356,314 328,323 297,323 C258,323 224,308 205,278 Z'
                  fill='url(#cloudFill)'
                  stroke='#DADEF2'
                  strokeWidth='1.5'
                />
              </svg>{' '}
              {(problemSentences || []).map((s, sIdx) => (
                <React.Fragment key={sIdx}>
                  <div
                    style={{
                      position: 'absolute',
                      top: `${s.top}%`,
                      left: `${s.left}%`,
                      transform: `translate(-50%,-50%) rotate(${s.rot}deg)`,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <div
                      style={{
                        animation: 'wordFloat 5s ease-in-out infinite',
                        animationDelay: `${s.delay}s`
                      }}
                    >
                      {(s.words || []).map((w, wIdx) => (
                        <React.Fragment key={wIdx}>
                          <span
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: `${w.weight}`,
                              fontSize: `${w.size}px`,
                              lineHeight: '1.1',
                              color: `${w.color}`,
                              opacity: `${w.opacity}`
                            }}
                          >
                            {w.text}{' '}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>{' '}
            <h2
              className='problem-title'
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: '500',
                fontSize: '38px',
                lineHeight: '1.3',
                color: '#0D1230',
                maxWidth: '760px',
                margin: '56px auto 0'
              }}
            >
              Replicate any source into your lakehouse, seamlessly
            </h2>
          </div>
        </div>
        <div
          style={{
            height: '120px',
            background:
              'linear-gradient(180deg, #F5F6FA 0%, #EDEFFB 35%, #7385DD 80%, #3C52CC 100%)'
          }}
        />
        <div style={{ scrollSnapAlign: 'start' }}>
          <div
            className='features-wrap'
            id='features'
            style={{ padding: '60px 64px 20px', backgroundColor: '#3C52CCE5' }}
          >
            <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    color: '#C3CBFA',
                    fontWeight: '500',
                    marginBottom: '14px'
                  }}
                >
                  THE FUNDAMENTAL
                </div>{' '}
                <h2
                  className='sec-title'
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: '500',
                    fontSize: '38px',
                    color: '#fff',
                    margin: '0'
                  }}
                >
                  Experience the most seamless workflow
                </h2>
              </div>{' '}
              <div
                className='features-grid'
                style={{
                  display: 'grid',
                  gridTemplateColumns: '0.8fr 1.2fr',
                  gap: '56px',
                  alignItems: 'start'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {(features || []).map((feat, featIdx) => (
                    <React.Fragment key={featIdx}>
                      <div
                        onClick={feat.onSelect}
                        style={{ cursor: 'pointer', padding: '20px 0', position: 'relative' }}
                      >
                        <div
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: '600',
                            fontSize: '17px',
                            letterSpacing: '0.02em',
                            color: `${feat.titleColor}`,
                            transition: 'color 0.3s'
                          }}
                        >
                          {feat.title}
                        </div>{' '}
                        <div
                          style={{
                            height: '2px',
                            background: '#6E7EDC',
                            marginTop: '14px',
                            borderRadius: '2px',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              background: '#3D4FF0',
                              width: `${feat.progress}%`,
                              transition: 'width 0.1s linear'
                            }}
                          />
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>{' '}
                <div style={{ minHeight: '220px' }}>
                  {(features || []).map((feat, featIdx) => (
                    <React.Fragment key={featIdx}>
                      {feat.active ? (
                        <>
                          <div
                            className='features-card'
                            style={{
                              border: '1px solid #E4E7F2',
                              borderRadius: '18px',
                              padding: '40px',
                              background: '#fff',
                              boxShadow: '0 24px 50px -30px rgba(10,14,39,0.5)',
                              animation: 'fadeSlideIn 0.5s ease'
                            }}
                          >
                            <div
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg,#3D4FF0,#6E7CFF)',
                                marginBottom: '22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {feat.isTiered ? (
                                <>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-end',
                                      gap: '3px',
                                      height: '20px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '5px',
                                        height: '8px',
                                        background: 'rgba(255,255,255,0.55)',
                                        borderRadius: '2px'
                                      }}
                                    />{' '}
                                    <div
                                      style={{
                                        width: '5px',
                                        height: '14px',
                                        background: 'rgba(255,255,255,0.8)',
                                        borderRadius: '2px'
                                      }}
                                    />{' '}
                                    <div
                                      style={{
                                        width: '5px',
                                        height: '20px',
                                        background: '#fff',
                                        borderRadius: '2px'
                                      }}
                                    />
                                  </div>
                                </>
                              ) : null}{' '}
                              {feat.isDecay ? (
                                <>
                                  <div
                                    style={{ position: 'relative', width: '22px', height: '22px' }}
                                  >
                                    <div
                                      style={{
                                        position: 'absolute',
                                        inset: '0',
                                        border: '2.5px solid rgba(255,255,255,0.5)',
                                        borderRadius: '5px'
                                      }}
                                    />{' '}
                                    <div
                                      style={{
                                        position: 'absolute',
                                        right: '-3px',
                                        bottom: '-3px',
                                        width: '12px',
                                        height: '12px',
                                        background: '#fff',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '6px',
                                          height: '2px',
                                          background: '#3D4FF0',
                                          borderRadius: '1px'
                                        }}
                                      />
                                      <div
                                        style={{
                                          position: 'absolute',
                                          width: '2px',
                                          height: '6px',
                                          background: '#3D4FF0',
                                          borderRadius: '1px'
                                        }}
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : null}{' '}
                              {feat.isChunk ? (
                                <>
                                  <div
                                    style={{ display: 'flex', gap: '3px', alignItems: 'center' }}
                                  >
                                    <div
                                      style={{
                                        width: '4px',
                                        height: '20px',
                                        background: '#fff',
                                        borderRadius: '2px'
                                      }}
                                    />{' '}
                                    <div
                                      style={{
                                        width: '4px',
                                        height: '20px',
                                        background: 'rgba(255,255,255,0.75)',
                                        borderRadius: '2px'
                                      }}
                                    />{' '}
                                    <div
                                      style={{
                                        width: '4px',
                                        height: '20px',
                                        background: 'rgba(255,255,255,0.55)',
                                        borderRadius: '2px'
                                      }}
                                    />{' '}
                                    <div
                                      style={{
                                        width: '4px',
                                        height: '20px',
                                        background: 'rgba(255,255,255,0.4)',
                                        borderRadius: '2px'
                                      }}
                                    />
                                  </div>
                                </>
                              ) : null}{' '}
                              {feat.isResume ? (
                                <>
                                  <div
                                    style={{
                                      width: '20px',
                                      height: '20px',
                                      border: '2.5px solid #fff',
                                      borderTopColor: 'transparent',
                                      borderRadius: '50%',
                                      position: 'relative'
                                    }}
                                  >
                                    <div
                                      style={{
                                        position: 'absolute',
                                        top: '-3px',
                                        right: '-1px',
                                        width: '0',
                                        height: '0',
                                        borderLeft: '5px solid #fff',
                                        borderTop: '3px solid transparent',
                                        borderBottom: '3px solid transparent',
                                        transform: 'rotate(20deg)'
                                      }}
                                    />
                                  </div>
                                </>
                              ) : null}
                            </div>{' '}
                            <h3
                              style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: '700',
                                fontSize: '20px',
                                letterSpacing: '0.03em',
                                color: '#10173A',
                                margin: '0 0 22px'
                              }}
                            >
                              {feat.title}
                            </h3>{' '}
                            {feat.isTiered ? (
                              <>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '26px' }}>
                                  <div
                                    style={{
                                      flex: '1',
                                      background: '#F6F7FC',
                                      border: '1px solid #EEF0F8',
                                      borderRadius: '12px',
                                      padding: '16px 14px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        letterSpacing: '0.05em',
                                        color: '#3D4FF0',
                                        marginBottom: '12px'
                                      }}
                                    >
                                      FULL
                                    </div>{' '}
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        gap: '3px',
                                        height: '34px'
                                      }}
                                    >
                                      <div
                                        style={{
                                          flex: '1',
                                          height: '100%',
                                          background: '#3D4FF0',
                                          borderRadius: '3px'
                                        }}
                                      />
                                      <div
                                        style={{
                                          flex: '1',
                                          height: '100%',
                                          background: '#3D4FF0',
                                          borderRadius: '3px'
                                        }}
                                      />
                                      <div
                                        style={{
                                          flex: '1',
                                          height: '100%',
                                          background: '#3D4FF0',
                                          borderRadius: '3px'
                                        }}
                                      />
                                    </div>{' '}
                                    <div
                                      style={{
                                        fontSize: '11px',
                                        color: '#5B6484',
                                        marginTop: '10px'
                                      }}
                                    >
                                      one-time load
                                    </div>
                                  </div>{' '}
                                  <div
                                    style={{
                                      flex: '1',
                                      background: '#F6F7FC',
                                      border: '1px solid #EEF0F8',
                                      borderRadius: '12px',
                                      padding: '16px 14px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        letterSpacing: '0.05em',
                                        color: '#4F5FF5',
                                        marginBottom: '12px'
                                      }}
                                    >
                                      INCREMENTAL
                                    </div>{' '}
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        gap: '3px',
                                        height: '34px'
                                      }}
                                    >
                                      <div
                                        style={{
                                          flex: '1',
                                          height: '38%',
                                          background: '#4F5FF5',
                                          borderRadius: '3px'
                                        }}
                                      />
                                      <div
                                        style={{
                                          flex: '1',
                                          height: '60%',
                                          background: '#4F5FF5',
                                          borderRadius: '3px'
                                        }}
                                      />
                                      <div
                                        style={{
                                          flex: '1',
                                          height: '48%',
                                          background: '#4F5FF5',
                                          borderRadius: '3px'
                                        }}
                                      />
                                    </div>{' '}
                                    <div
                                      style={{
                                        fontSize: '11px',
                                        color: '#5B6484',
                                        marginTop: '10px'
                                      }}
                                    >
                                      on schedule
                                    </div>
                                  </div>{' '}
                                  <div
                                    style={{
                                      flex: '1',
                                      background: '#F6F7FC',
                                      border: '1px solid #EEF0F8',
                                      borderRadius: '12px',
                                      padding: '16px 14px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        letterSpacing: '0.05em',
                                        color: '#6E7CFF',
                                        marginBottom: '12px'
                                      }}
                                    >
                                      CDC
                                    </div>{' '}
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        height: '34px'
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '9px',
                                          height: '9px',
                                          borderRadius: '50%',
                                          background: '#6E7CFF',
                                          animation: 'wordFloat 1.6s ease-in-out infinite'
                                        }}
                                      />
                                      <div
                                        style={{
                                          flex: '1',
                                          height: '2px',
                                          background: 'linear-gradient(90deg,#6E7CFF,transparent)',
                                          borderRadius: '2px'
                                        }}
                                      />
                                    </div>{' '}
                                    <div
                                      style={{
                                        fontSize: '11px',
                                        color: '#5B6484',
                                        marginTop: '10px'
                                      }}
                                    >
                                      real-time
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : null}{' '}
                            {feat.isDecay ? (
                              <>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    marginBottom: '26px'
                                  }}
                                >
                                  <div
                                    style={{
                                      flex: '1',
                                      background: '#F6F7FC',
                                      border: '1px solid #EEF0F8',
                                      borderRadius: '12px',
                                      overflow: 'hidden'
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        letterSpacing: '0.04em',
                                        color: '#8890C4',
                                        padding: '10px 14px',
                                        borderBottom: '1px solid #EEF0F8'
                                      }}
                                    >
                                      SOURCE TABLE
                                    </div>{' '}
                                    <div
                                      style={{
                                        padding: '8px 14px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '7px'
                                      }}
                                    >
                                      <div
                                        style={{
                                          height: '7px',
                                          width: '80%',
                                          background: '#D5D9EC',
                                          borderRadius: '3px'
                                        }}
                                      />{' '}
                                      <div
                                        style={{
                                          height: '7px',
                                          width: '65%',
                                          background: '#D5D9EC',
                                          borderRadius: '3px'
                                        }}
                                      />{' '}
                                      <div
                                        style={{
                                          height: '7px',
                                          width: '72%',
                                          background: '#3D4FF0',
                                          borderRadius: '3px'
                                        }}
                                      />
                                    </div>
                                  </div>{' '}
                                  <div
                                    style={{ fontSize: '22px', color: '#6E7CFF', flexShrink: '0' }}
                                  >
                                    →
                                  </div>{' '}
                                  <div
                                    style={{
                                      flex: '1',
                                      background: '#fff',
                                      border: '1.5px solid #3D4FF0',
                                      borderRadius: '12px',
                                      overflow: 'hidden',
                                      boxShadow: '0 8px 20px -12px rgba(61,79,240,0.5)'
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        letterSpacing: '0.04em',
                                        color: '#3D4FF0',
                                        padding: '10px 14px',
                                        borderBottom: '1px solid #EEF0F8'
                                      }}
                                    >
                                      ICEBERG TABLE
                                    </div>{' '}
                                    <div
                                      style={{
                                        padding: '8px 14px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '7px'
                                      }}
                                    >
                                      <div
                                        style={{
                                          height: '7px',
                                          width: '80%',
                                          background: '#D5D9EC',
                                          borderRadius: '3px'
                                        }}
                                      />{' '}
                                      <div
                                        style={{
                                          height: '7px',
                                          width: '65%',
                                          background: '#D5D9EC',
                                          borderRadius: '3px'
                                        }}
                                      />{' '}
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '6px'
                                        }}
                                      >
                                        <div
                                          style={{
                                            height: '7px',
                                            width: '72%',
                                            background: '#3D4FF0',
                                            borderRadius: '3px'
                                          }}
                                        />
                                        <span
                                          style={{
                                            fontSize: '9px',
                                            fontWeight: '700',
                                            color: '#1D8A4C',
                                            background: '#E4F8EA',
                                            padding: '1px 6px',
                                            borderRadius: '6px'
                                          }}
                                        >
                                          + NEW
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : null}{' '}
                            {feat.isChunk ? (
                              <>
                                <div style={{ marginBottom: '26px' }}>
                                  <div
                                    style={{
                                      height: '14px',
                                      borderRadius: '5px',
                                      background: 'linear-gradient(90deg,#3D4FF0,#6E7CFF)',
                                      marginBottom: '14px'
                                    }}
                                  />{' '}
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      gap: '6px',
                                      marginBottom: '14px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '1px',
                                        height: '14px',
                                        background: '#C7CCE8'
                                      }}
                                    />
                                  </div>{' '}
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <div
                                      style={{
                                        flex: '1',
                                        height: '38px',
                                        background: '#EEF0FE',
                                        border: '1px solid #D9DEFB',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        color: '#3D4FF0'
                                      }}
                                    >
                                      chunk 1
                                    </div>{' '}
                                    <div
                                      style={{
                                        flex: '1',
                                        height: '38px',
                                        background: '#EEF0FE',
                                        border: '1px solid #D9DEFB',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        color: '#3D4FF0'
                                      }}
                                    >
                                      chunk 2
                                    </div>{' '}
                                    <div
                                      style={{
                                        flex: '1',
                                        height: '38px',
                                        background: '#EEF0FE',
                                        border: '1px solid #D9DEFB',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        color: '#3D4FF0'
                                      }}
                                    >
                                      chunk 3
                                    </div>{' '}
                                    <div
                                      style={{
                                        flex: '1',
                                        height: '38px',
                                        background: '#EEF0FE',
                                        border: '1px solid #D9DEFB',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        color: '#3D4FF0'
                                      }}
                                    >
                                      chunk 4
                                    </div>
                                  </div>{' '}
                                  <div
                                    style={{
                                      textAlign: 'center',
                                      fontSize: '11px',
                                      color: '#5B6484',
                                      marginTop: '12px'
                                    }}
                                  >
                                    read in parallel
                                  </div>
                                </div>
                              </>
                            ) : null}{' '}
                            {feat.isResume ? (
                              <>
                                <div style={{ marginBottom: '26px' }}>
                                  <div
                                    style={{
                                      position: 'relative',
                                      height: '12px',
                                      borderRadius: '6px',
                                      background: '#EEF0F8',
                                      margin: '26px 0 14px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        position: 'absolute',
                                        left: '0',
                                        top: '0',
                                        bottom: '0',
                                        width: '62%',
                                        borderRadius: '6px',
                                        background: 'linear-gradient(90deg,#3D4FF0,#6E7CFF)'
                                      }}
                                    />{' '}
                                    <div
                                      style={{
                                        position: 'absolute',
                                        left: '62%',
                                        top: '50%',
                                        transform: 'translate(-50%,-50%)',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: '#fff',
                                        border: '3px solid #3D4FF0'
                                      }}
                                    />{' '}
                                    <div
                                      style={{
                                        position: 'absolute',
                                        left: '62%',
                                        top: '-24px',
                                        transform: 'translateX(-50%)',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        color: '#3D4FF0',
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      ✓ checkpoint
                                    </div>
                                  </div>{' '}
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      fontSize: '11px',
                                      color: '#5B6484'
                                    }}
                                  >
                                    <span>interrupted</span>
                                    <span style={{ color: '#3D4FF0', fontWeight: '600' }}>
                                      resumes here →
                                    </span>
                                  </div>
                                </div>
                              </>
                            ) : null}{' '}
                            <div style={{ fontSize: '15px', lineHeight: '1.7', color: '#5B6484' }}>
                              {feat.body}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>{' '}
          <div
            style={{
              height: '120px',
              background:
                'linear-gradient(180deg, #3C52CC 0%, #7385DD 20%, #EDEFFB 65%, #F5F6FA 100%)'
            }}
          />
        </div>
        <div
          style={{
            minHeight: '65vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            scrollSnapAlign: 'start',
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '0',
              zIndex: '-1',
              pointerEvents: 'none',
              background:
                'radial-gradient(ellipse 70% 55% at 50% 34%, rgba(61,79,240,0.035), transparent 72%), repeating-linear-gradient(0deg, rgba(61,79,240,0.022) 0 1px, transparent 1px 68px), repeating-linear-gradient(90deg, rgba(61,79,240,0.018) 0 1px, transparent 1px 68px)',
              WebkitMaskImage:
                'linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)',
              maskImage:
                'linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)'
            }}
          />
          <div
            className='bench-wrap'
            id='benchmarks'
            style={{
              maxWidth: '1080px',
              width: '100%',
              margin: '0 auto',
              padding: '110px 64px 40px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                letterSpacing: '0.08em',
                color: '#3D4FF0',
                fontWeight: '500',
                marginBottom: '14px'
              }}
            >
              THE OLAKE ADVANTAGE
            </div>{' '}
            <h2
              className='sec-title'
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: '500',
                fontSize: '38px',
                color: '#0D1230',
                margin: '0 0 20px'
              }}
            >
              Get the OLake Go Advantage
            </h2>{' '}
            <div
              style={{
                fontSize: '17px',
                lineHeight: '1.6',
                color: '#5B6484',
                maxWidth: '600px',
                margin: '0 auto 56px'
              }}
            >
              OLake Go replicates up to <b>12.5× faster</b> than Fivetran and <b>35–1000× faster</b>{' '}
              than other open-source tools, syncing <b>50M CDC changes in 15 minutes</b>.
            </div>{' '}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
              <div
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  padding: '4px',
                  background: '#F7F8FD',
                  border: '1px solid #D8DEF4',
                  borderRadius: '14px'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    bottom: '4px',
                    left: `${benchModeIndicatorLeft}`,
                    width: 'calc(50% - 4px)',
                    background: '#fff',
                    border: '1px solid #E7EAF8',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px -3px rgba(16,23,58,0.18)',
                    transition: 'left 0.25s ease'
                  }}
                />
                {(benchModes || []).map((mode, modeIdx) => (
                  <div
                    key={modeIdx}
                    onClick={mode.onSelect}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      cursor: 'pointer',
                      width: '132px',
                      padding: '9px 0',
                      textAlign: 'center',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: `${mode.weight}`,
                      fontSize: '15px',
                      color: `${mode.color}`,
                      transition: 'color 0.2s'
                    }}
                  >
                    {mode.label}
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '4px',
                marginBottom: '36px'
              }}
            >
              {(benchSources || []).map((src, srcIdx) => (
                <React.Fragment key={srcIdx}>
                  <div
                    onClick={src.onSelect}
                    style={{
                      cursor: 'pointer',
                      padding: '10px 22px',
                      borderRadius: '12px',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: `${src.weight}`,
                      fontSize: '15px',
                      color: `${src.color}`,
                      background: `${src.bg}`,
                      transition: 'all 0.2s'
                    }}
                  >
                    {src.name}
                  </div>
                </React.Fragment>
              ))}
            </div>{' '}
            <div
              style={{
                border: '1px solid #E4E7F2',
                borderRadius: '18px',
                background: '#fff',
                boxShadow: '0 18px 40px -24px rgba(16,23,58,0.35)',
                overflowX: 'auto'
              }}
            >
              {benchComingSoon ? (
                <>
                  <div
                    style={{
                      padding: '96px 32px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: '#EEF0FE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        loading='lazy'
                        decoding='async'
                        src='/img/landing/shared/olake-mark-mono.svg'
                        alt=''
                        style={{ width: '30px', height: '30px' }}
                      />
                    </div>{' '}
                    <div
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: '700',
                        fontSize: '24px',
                        color: '#10173A'
                      }}
                    >
                      {benchSourceName} benchmarks coming soon
                    </div>{' '}
                    <div
                      style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: '#5B6484',
                        maxWidth: '420px'
                      }}
                    >
                      We're running head-to-head {benchSourceName} ingestion tests now. Check back
                      shortly for the full comparison.
                    </div>
                  </div>
                </>
              ) : null}{' '}
              {benchHasData ? (
                <>
                  <div style={{ minWidth: '860px' }}>
                    <div
                      className='bench-grid'
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'minmax(0,1.15fr) minmax(0,1.35fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)',
                        borderBottom: '1px solid #EEF0F8'
                      }}
                    >
                      {(benchCols || []).map((col, colIdx) => (
                        <React.Fragment key={colIdx}>
                          <div
                            style={{
                              padding: '26px 20px',
                              background: `${col.bg}`,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: `${col.align}`,
                              gap: '4px',
                              height: '99px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                              {col.olake ? (
                                <>
                                  <img
                                    loading='lazy'
                                    decoding='async'
                                    src='/img/landing/shared/olake-mark-mono.svg'
                                    alt=''
                                    style={{ width: '26px', height: '26px' }}
                                  />
                                </>
                              ) : null}{' '}
                              <span
                                style={{
                                  fontFamily: "'Space Grotesk', sans-serif",
                                  fontWeight: '700',
                                  fontSize: '19px',
                                  color: `${col.color}`,
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {col.name}
                              </span>
                            </div>{' '}
                            {col.hasSub ? (
                              <>
                                <span style={{ fontSize: '13px', color: '#8890C4' }}>
                                  {col.sub}
                                </span>
                              </>
                            ) : null}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>{' '}
                    {(benchTable || []).map((row, rowIdx) => (
                      <React.Fragment key={rowIdx}>
                        <div
                          className='bench-grid'
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'minmax(0,1.15fr) minmax(0,1.35fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)',
                            borderTop: '1px solid #EEF0F8'
                          }}
                        >
                          <div
                            style={{
                              padding: '24px 20px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              justifyContent: 'center'
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#10173A'
                              }}
                            >
                              {row.label}
                            </span>{' '}
                            {row.hasSub ? (
                              <>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    color: '#8890C4',
                                    lineHeight: '1.5',
                                    maxWidth: '200px'
                                  }}
                                >
                                  {row.sub}
                                </span>
                              </>
                            ) : null}
                          </div>{' '}
                          {(row.cells || []).map((cell, cellIdx) => (
                            <React.Fragment key={cellIdx}>
                              <div
                                style={{
                                  padding: '24px 20px',
                                  textAlign: 'center',
                                  background: `${cell.bg}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '16px',
                                    fontWeight: `${cell.weight}`,
                                    color: `${cell.color}`
                                  }}
                                >
                                  {cell.text}
                                </span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </>
              ) : null}
            </div>{' '}
            <div
              style={{
                textAlign: 'left',
                marginTop: '56px',
                border: '1px solid #E7E9F6',
                borderRadius: '16px',
                padding: '24px 32px',
                background: '#F9FAFD'
              }}
            >
              <div
                onClick={toggleBenchmarkInfo}
                style={{ display: 'flex', alignItems: 'center', gap: '18px', cursor: 'pointer' }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '9px',
                    background: '#EEF0FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: '0'
                  }}
                >
                  <img
                    loading='lazy'
                    decoding='async'
                    src='/img/landing/shared/benchmark-info-icon.webp'
                    alt=''
                    style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                  />
                </div>{' '}
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: '700',
                    fontSize: '13px',
                    letterSpacing: '0.04em',
                    color: '#3D4FF0',
                    flex: '1'
                  }}
                >
                  HOW OLAKE GO DOES THIS
                </div>{' '}
                <div
                  style={{ fontSize: '14px', color: '#8890C4', transform: `${benchmarkInfoArrow}` }}
                >
                  ▾
                </div>
              </div>{' '}
              {benchmarksInfoOpen ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      fontSize: '15px',
                      lineHeight: '1.7',
                      color: '#4A5170',
                      marginTop: '18px',
                      paddingTop: '18px',
                      borderTop: '1px solid #E7E9F6'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: '600', color: 'rgb(16, 23, 58)' }}>
                        Parallel chunking
                      </span>{' '}
                      — OLake Go splits large tables into chunks and loads them concurrently for
                      maximum throughput.
                    </div>{' '}
                    <div>
                      <span style={{ fontWeight: '600', color: '#10173A' }}>
                        Native Iceberg writes
                      </span>{' '}
                      — data lands directly in open Apache Iceberg tables with no proprietary
                      staging layer.
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <a
              href='/docs/benchmarks/ingestion'
              style={{
                display: 'inline-block',
                marginTop: '20px',
                color: '#3D4FF0',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none',
                borderBottom: '1px solid #3D4FF0',
                paddingBottom: '2px'
              }}
            >
              view all performance benchmarks →
            </a>
          </div>
          <div
            className='cta-wrap'
            style={{ maxWidth: '1080px', width: '100%', margin: '90px auto', padding: '0 64px' }}
          >
            <div
              className='cta-inner'
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: '#0D1230',
                borderRadius: '22px',
                padding: '36px 48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '32px',
                flexWrap: 'wrap'
              }}
            >
              <img
                loading='lazy'
                decoding='async'
                src='/img/landing/shared/iceberg-backdrop.webp'
                alt=''
                style={__css(icebergStyle)}
              />{' '}
              <div style={{ position: 'relative' }}>
                <h2
                  className='cta-title'
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: '600',
                    fontSize: '38px',
                    color: '#fff',
                    maxWidth: '620px',
                    width: '620px',
                    margin: '0'
                  }}
                >
                  Start replicating to Iceberg today!
                </h2>
              </div>{' '}
              <a
                className='olakego-h2'
                href='/docs/getting-started/quickstart/'
                style={{
                  position: 'relative',
                  background: '#3D4FF0',
                  color: '#fff',
                  padding: '15px 30px',
                  borderRadius: '9px',
                  fontWeight: '600',
                  fontSize: '20px',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Space Grotesk',
                  border: '2px solid #3D4FF0',
                  boxShadow: '0 5px 0 #23309E',
                  transform: 'translateY(-2px)',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Try, it's free!
              </a>
            </div>
          </div>
        </div>
        <div
          style={{
            minHeight: '65vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            scrollSnapAlign: 'start'
          }}
        >
          <div
            className='faq-wrap'
            id='faq'
            style={{
              maxWidth: '820px',
              width: '100%',
              margin: '0 auto',
              padding: '60px 64px 130px'
            }}
          >
            <h2
              className='faq-title'
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: '500',
                fontSize: '38px',
                color: '#0D1230',
                textAlign: 'center',
                margin: '0 auto 48px'
              }}
            >
              Frequently Asked Questions
            </h2>{' '}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {(faqs || []).map((faq, faqIdx) => (
                <React.Fragment key={faqIdx}>
                  <div
                    onClick={faq.onToggle}
                    style={{ borderBottom: '1px solid #E7E9F6', padding: '26px 4px' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      <h3
                        className='faq-q'
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: '700',
                          fontSize: '20px',
                          color: '#10173A',
                          margin: '0'
                        }}
                      >
                        {faq.q}
                      </h3>{' '}
                      <div style={{ fontSize: '22px', color: '#10173A', flexShrink: '0' }}>
                        {faq.sign}
                      </div>
                    </div>{' '}
                    {faq.open ? (
                      <>
                        <div
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: '17px',
                            lineHeight: '1.7',
                            color: '#5B6484',
                            marginTop: '18px',
                            maxWidth: '640px'
                          }}
                        >
                          {faq.a}
                        </div>
                      </>
                    ) : null}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
