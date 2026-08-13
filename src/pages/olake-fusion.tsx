// @ts-nocheck
import React from 'react'
import Layout from '@theme/Layout'
import LandingSeo from '@site/src/components/landing/seo/LandingSeo'
import LightModeEnforcer from '@site/src/components/LightModeEnforcer'
import { useFusionLogic } from '@site/src/components/landing/pages/useFusionLogic'
import { cssToObj as __css } from '@site/src/components/landing/pages/cssToObj'
import { FUSION_SEO } from '@site/src/data/landing/seo'
import '@site/src/components/landing/pages/olake-fusion.css'
import '@site/src/components/landing/pages/overrides.css'

export default function OLakeFusionPage() {
  const {
    icebergStyle,
    problemCards,
    features,
    benchmarkRows,
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
  } = useFusionLogic({ icebergPosX: 54, icebergPosY: 53, icebergZoom: 100, icebergOpacity: 65 })

  return (
    <Layout
      title={FUSION_SEO.title}
      description={FUSION_SEO.description}
      wrapperClassName='landing-page'
    >
      <LandingSeo
        title={FUSION_SEO.title}
        description={FUSION_SEO.description}
        twitterDescription={FUSION_SEO.twitterDescription}
        canonicalUrl={FUSION_SEO.canonicalUrl}
        ogImage={FUSION_SEO.ogImage}
        jsonLdSchemas={FUSION_SEO.jsonLdSchemas}
      />
      <LightModeEnforcer />
      <div className='olakefusion-page olake-design-page'>
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
          className='scroll-pipeline'
          style={{
            position: 'fixed',
            top: '0',
            right: '26px',
            width: '70px',
            height: '100vh',
            zIndex: '6',
            pointerEvents: 'none'
          }}
        >
          <div
            id='trail-3'
            style={{
              position: 'absolute',
              top: '0',
              left: '22px',
              width: '10px',
              height: '10px',
              borderRadius: '3px',
              background: '#6E82F2',
              opacity: '0.18',
              transition: 'transform 0.6s cubic-bezier(.22,1,.36,1)'
            }}
          />{' '}
          <div
            id='trail-2'
            style={{
              position: 'absolute',
              top: '0',
              left: '20px',
              width: '13px',
              height: '13px',
              borderRadius: '4px',
              background: '#4460EC',
              opacity: '0.3',
              transition: 'transform 0.45s cubic-bezier(.22,1,.36,1)'
            }}
          />{' '}
          <div
            id='trail-1'
            style={{
              position: 'absolute',
              top: '0',
              left: '17px',
              width: '18px',
              height: '18px',
              borderRadius: '6px',
              background: '#2A48E8',
              opacity: '0.45',
              transition: 'transform 0.3s cubic-bezier(.22,1,.36,1)'
            }}
          />{' '}
          <div
            id='scroll-packet'
            style={{
              position: 'absolute',
              top: '0',
              left: '12px',
              width: '34px',
              height: '34px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg,#193AE6,#4460EC)',
              boxShadow: '0 6px 20px -4px rgba(25,58,230,0.6), 0 0 0 5px rgba(25,58,230,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              willChange: 'transform'
            }}
          >
            <img
              loading='lazy'
              decoding='async'
              src='/img/landing/shared/olake-mark-small.svg'
              alt=''
              style={{ width: '20px', height: '20px' }}
            />
          </div>
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
              minHeight: '65vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div
              className='hero-wrap'
              style={{
                position: 'relative',
                padding: '88px 64px 60px',
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
                  marginBottom: '48px'
                }}
              >
                <img
                  loading='lazy'
                  decoding='async'
                  src='/img/landing/shared/olake-mark-mono.svg'
                  alt=''
                  style={{ width: '12px', height: '12px' }}
                />{' '}
                OLAKE FUSION
              </div>{' '}
              <h1
                className='hero-title'
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: '600',
                  fontSize: '49px',
                  lineHeight: '1.12',
                  letterSpacing: '-0.01em',
                  color: '#0D1230'
                }}
              >
                Simplify your Iceberg table maintenance
              </h1>{' '}
              <div
                className='hero-btns'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  marginTop: '56px'
                }}
              >
                <a
                  className='olakefusion-h2'
                  href='/docs/fusion/getting-started/quickstart/'
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
                  className='olakefusion-h3'
                  href='/docs/fusion/getting-started/overview/'
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
                  Visit Docs
                </a>
              </div>
            </div>
            <div
              className='arch-wrap'
              style={{
                maxWidth: '760px',
                width: '100%',
                margin: '72px auto 56px',
                padding: '20px 48px',
                position: 'relative',
                zIndex: '10'
              }}
            >
              <div className='arch-inner' style={{ position: 'relative', height: '190px' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '44px',
                    right: '44px',
                    top: '44px',
                    height: '2px'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: '0',
                      background: 'linear-gradient(90deg,#E1E4F3,#3D4FF0,#E1E4F3)'
                    }}
                  />{' '}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#3D4FF0',
                      transform: 'translate(-50%,-50%)',
                      animation: 'travelDot 3s linear infinite',
                      animationDelay: '0s',
                      boxShadow: '0 0 8px rgba(61,79,240,0.6)'
                    }}
                  />{' '}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#6E7CFF',
                      transform: 'translate(-50%,-50%)',
                      animation: 'travelDot 3s linear infinite',
                      animationDelay: '1s',
                      boxShadow: '0 0 8px rgba(61,79,240,0.6)'
                    }}
                  />{' '}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#6E7CFF',
                      transform: 'translate(-50%,-50%)',
                      animation: 'travelDot 3s linear infinite',
                      animationDelay: '2s',
                      boxShadow: '0 0 8px rgba(61,79,240,0.6)'
                    }}
                  />
                </div>{' '}
                <div style={{ position: 'absolute', top: '0', left: '0', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '50%',
                      background: '#fff',
                      border: '2px solid #E1E4F3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}
                  >
                    <img
                      loading='lazy'
                      decoding='async'
                      src='/img/landing/shared/iceberg-icon.webp'
                      alt='Iceberg'
                      style={{ height: '20px', width: 'auto' }}
                    />
                  </div>{' '}
                  <div
                    style={{
                      fontWeight: '600',
                      fontSize: '13px',
                      color: '#5B6484',
                      marginTop: '12px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Iceberg Tables
                  </div>
                </div>{' '}
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '116px',
                      height: '116px',
                      borderRadius: '22px',
                      border: '2px solid #232A56',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      animation: 'fusionPulseRing 2.4s ease-in-out infinite',
                      backgroundColor: '#193AE6',
                      borderColor: '#8EA0FF'
                    }}
                  >
                    <img
                      loading='lazy'
                      decoding='async'
                      src='/img/landing/shared/olake-mark-small.svg'
                      alt='OLake Fusion'
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
                    OLakeFusion
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
                      Compaction
                    </div>{' '}
                    <div
                      style={{
                        border: '1px solid #E1E4F3',
                        color: '#10173A',
                        fontSize: '11px',
                        padding: '5px 10px',
                        borderRadius: '999px',
                        whiteSpace: 'nowrap',
                        animation: 'lightUp2 4s ease-in-out infinite',
                        position: 'relative'
                      }}
                    >
                      Cleanup
                      <span
                        style={{
                          position: 'absolute',
                          top: '-9px',
                          right: '-8px',
                          background: '#0D1230',
                          border: '1px solid #3D4FF0',
                          color: '#8C97F5',
                          fontSize: '7px',
                          fontWeight: '600',
                          letterSpacing: '0.03em',
                          padding: '2px 5px',
                          borderRadius: '999px',
                          whiteSpace: 'nowrap',
                          transform: 'rotate(10deg)'
                        }}
                      >
                        SOON
                      </span>
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
                      Logs & Metrics
                    </div>
                  </div>
                </div>{' '}
                <div style={{ position: 'absolute', top: '0', right: '0', textAlign: 'center' }}>
                  <div
                    id='opt-node'
                    style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#EEF0FE,#fff)',
                      border: '2px solid #3D4FF0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      boxShadow: '0 0 0 6px rgba(61,79,240,0.08)',
                      position: 'relative'
                    }}
                  >
                    <img
                      loading='lazy'
                      decoding='async'
                      src='/img/landing/shared/iceberg-icon.webp'
                      alt='Iceberg'
                      style={{ height: '20px', width: 'auto' }}
                    />{' '}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#3D4FF0',
                        border: '2px solid #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div
                        style={{
                          width: '7px',
                          height: '4px',
                          borderLeft: '2px solid #fff',
                          borderBottom: '2px solid #fff',
                          transform: 'rotate(-45deg) translate(1px,-1px)'
                        }}
                      />
                    </div>
                  </div>{' '}
                  <div
                    style={{
                      fontWeight: '600',
                      fontSize: '13px',
                      color: '#3D4FF0',
                      marginTop: '12px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Optimized Iceberg Tables
                  </div>
                </div>
              </div>
            </div>
          </div>{' '}
          <div
            style={{
              minHeight: '65vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
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
                THE SILENT TAX
              </div>{' '}
              <div
                className='problem-grid'
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '22px' }}
              >
                {(problemCards || []).map((card, cardIdx) => (
                  <React.Fragment key={cardIdx}>
                    <div
                      style={{
                        border: '1.5px solid #C7CCE8',
                        borderRadius: '16px',
                        padding: '32px 20px',
                        textAlign: 'left',
                        background: '#fff',
                        minHeight: '250px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignContent: 'flex-start',
                        gap: '8px 10px',
                        fontWeight: '700'
                      }}
                    >
                      {(card.words || []).map((w, wIdx) => (
                        <React.Fragment key={wIdx}>
                          <span
                            style={{
                              'fontFamily': "'Space Grotesk', sans-serif",
                              'fontWeight': `${w.weight}`,
                              'fontSize': `${w.size}px`,
                              'lineHeight': '1.1',
                              'color': `${w.color}`,
                              'opacity': `${w.opacity}`,
                              'display': 'inline-block',
                              'animation': 'wordFloat 4s ease-in-out infinite',
                              'animationDelay': `${w.delay}s`,
                              '--r': `${w.rot}deg`,
                              'transform': `rotate(${w.rot}deg)`
                            }}
                          >
                            {w.text}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>{' '}
              <h2
                className='problem-title'
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: '600',
                  fontSize: '38px',
                  lineHeight: '1.3',
                  color: '#0D1230',
                  maxWidth: '760px',
                  margin: '56px auto 0'
                }}
              >
                Set a schedule, Fusion will handle the rest.
              </h2>
            </div>
          </div>{' '}
          <div
            style={{
              minHeight: '65vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginTop: '-1px',
              background:
                'linear-gradient(180deg, #F5F6FA 0%, #EDEFFB 12%, #7385DD 26%, #4F63D1 33%) top/100% 240px no-repeat, linear-gradient(0deg, #F5F6FA 0%, #EDEFFB 12%, #7385DD 26%, #4F63D1 33%) bottom/100% 240px no-repeat, #4F63D1'
            }}
          >
            <div className='features-wrap' id='features' style={{ padding: '60px 64px 100px' }}>
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
                    FEATURES
                  </div>{' '}
                  <h2
                    className='sec-title'
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: '600',
                      fontSize: '38px',
                      color: '#fff'
                    }}
                  >
                    Built to keep your data lake performant
                  </h2>
                </div>{' '}
                <div
                  className='features-grid'
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '0.8fr 1.2fr',
                    gap: '56px',
                    alignItems: 'center'
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
                  <div
                    className='features-card-slot'
                    style={{ display: 'grid', gridTemplateColumns: '1fr', minWidth: 0 }}
                  >
                    {(features || []).map((feat, featIdx) => (
                      <React.Fragment key={featIdx}>
                        <div
                          style={{
                            gridColumn: '1',
                            gridRow: '1',
                            minWidth: 0,
                            visibility: feat.active ? 'visible' : 'hidden',
                            pointerEvents: feat.active ? 'auto' : 'none'
                          }}
                        >
                          <div
                            key={feat.active ? `active-${featIdx}` : 'idle'}
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
                                      flexDirection: 'column',
                                      gap: '3px',
                                      width: '22px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        height: '3px',
                                        width: '100%',
                                        background: '#fff',
                                        borderRadius: '2px'
                                      }}
                                    />{' '}
                                    <div
                                      style={{
                                        height: '3px',
                                        width: '75%',
                                        background: '#fff',
                                        borderRadius: '2px'
                                      }}
                                    />{' '}
                                    <div
                                      style={{
                                        height: '3px',
                                        width: '50%',
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
                                    style={{
                                      width: '20px',
                                      height: '20px',
                                      border: '2.5px solid #fff',
                                      borderRadius: '5px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '8px',
                                        height: '8px',
                                        background: '#fff',
                                        borderRadius: '2px'
                                      }}
                                    />
                                  </div>
                                </>
                              ) : null}{' '}
                              {feat.isConfig ? (
                                <>
                                  <div
                                    style={{
                                      width: '24px',
                                      height: '4px',
                                      background: 'rgba(255,255,255,0.4)',
                                      borderRadius: '2px',
                                      position: 'relative'
                                    }}
                                  >
                                    <div
                                      style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '-4px',
                                        width: '12px',
                                        height: '12px',
                                        background: '#fff',
                                        borderRadius: '50%'
                                      }}
                                    />
                                  </div>
                                </>
                              ) : null}{' '}
                              {feat.isHosted ? (
                                <>
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '3px',
                                      width: '20px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        height: '6px',
                                        width: '100%',
                                        background: '#fff',
                                        borderRadius: '2px',
                                        position: 'relative'
                                      }}
                                    >
                                      <div
                                        style={{
                                          position: 'absolute',
                                          right: '2px',
                                          top: '2px',
                                          width: '2px',
                                          height: '2px',
                                          background: '#3D4FF0',
                                          borderRadius: '50%'
                                        }}
                                      />
                                    </div>{' '}
                                    <div
                                      style={{
                                        height: '6px',
                                        width: '100%',
                                        background: '#fff',
                                        borderRadius: '2px',
                                        position: 'relative'
                                      }}
                                    >
                                      <div
                                        style={{
                                          position: 'absolute',
                                          right: '2px',
                                          top: '2px',
                                          width: '2px',
                                          height: '2px',
                                          background: '#3D4FF0',
                                          borderRadius: '50%'
                                        }}
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : null}
                            </div>{' '}
                            <h3
                              style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: '700',
                                fontSize: '18px',
                                letterSpacing: '0.03em',
                                color: '#10173A',
                                marginBottom: '22px'
                              }}
                            >
                              {feat.title}
                            </h3>{' '}
                            {feat.isTiered ? (
                              <>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    marginBottom: '26px'
                                  }}
                                >
                                  <div
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                                  >
                                    <div
                                      style={{
                                        width: '64px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        letterSpacing: '0.04em',
                                        color: '#3D4FF0',
                                        flexShrink: '0'
                                      }}
                                    >
                                      LITE
                                    </div>{' '}
                                    <div
                                      style={{
                                        flex: '1',
                                        height: '8px',
                                        borderRadius: '4px',
                                        background: '#EEF0F8'
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '30%',
                                          height: '100%',
                                          borderRadius: '4px',
                                          background: '#6E7CFF'
                                        }}
                                      />
                                    </div>{' '}
                                    <div
                                      style={{
                                        fontSize: '12px',
                                        color: '#5B6484',
                                        flexShrink: '0'
                                      }}
                                    >
                                      every 20 min
                                    </div>
                                  </div>{' '}
                                  <div
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                                  >
                                    <div
                                      style={{
                                        width: '64px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        letterSpacing: '0.04em',
                                        color: '#3D4FF0',
                                        flexShrink: '0'
                                      }}
                                    >
                                      MEDIUM
                                    </div>{' '}
                                    <div
                                      style={{
                                        flex: '1',
                                        height: '8px',
                                        borderRadius: '4px',
                                        background: '#EEF0F8'
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '60%',
                                          height: '100%',
                                          borderRadius: '4px',
                                          background: '#4F5FF5'
                                        }}
                                      />
                                    </div>{' '}
                                    <div
                                      style={{
                                        fontSize: '12px',
                                        color: '#5B6484',
                                        flexShrink: '0'
                                      }}
                                    >
                                      every 40 min
                                    </div>
                                  </div>{' '}
                                  <div
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                                  >
                                    <div
                                      style={{
                                        width: '64px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        letterSpacing: '0.04em',
                                        color: '#3D4FF0',
                                        flexShrink: '0'
                                      }}
                                    >
                                      FULL
                                    </div>{' '}
                                    <div
                                      style={{
                                        flex: '1',
                                        height: '8px',
                                        borderRadius: '4px',
                                        background: '#EEF0F8'
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          borderRadius: '4px',
                                          background: '#3D4FF0'
                                        }}
                                      />
                                    </div>{' '}
                                    <div
                                      style={{
                                        fontSize: '12px',
                                        color: '#5B6484',
                                        flexShrink: '0'
                                      }}
                                    >
                                      deep-clean
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
                                    justifyContent: 'space-between',
                                    gap: '20px',
                                    marginBottom: '26px'
                                  }}
                                >
                                  <div style={{ textAlign: 'center' }}>
                                    <div
                                      style={{
                                        display: 'flex',
                                        gap: '4px',
                                        flexWrap: 'wrap',
                                        width: '110px',
                                        justifyContent: 'center',
                                        marginBottom: '10px'
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '14px',
                                          height: '14px',
                                          background: '#D5D9EC',
                                          borderRadius: '3px'
                                        }}
                                      />
                                      <div
                                        style={{
                                          width: '10px',
                                          height: '10px',
                                          background: '#D5D9EC',
                                          borderRadius: '3px',
                                          marginTop: '4px'
                                        }}
                                      />
                                      <div
                                        style={{
                                          width: '16px',
                                          height: '16px',
                                          background: '#D5D9EC',
                                          borderRadius: '3px'
                                        }}
                                      />{' '}
                                      <div
                                        style={{
                                          width: '9px',
                                          height: '9px',
                                          background: '#D5D9EC',
                                          borderRadius: '3px'
                                        }}
                                      />
                                      <div
                                        style={{
                                          width: '13px',
                                          height: '13px',
                                          background: '#D5D9EC',
                                          borderRadius: '3px'
                                        }}
                                      />
                                      <div
                                        style={{
                                          width: '11px',
                                          height: '11px',
                                          background: '#D5D9EC',
                                          borderRadius: '3px'
                                        }}
                                      />{' '}
                                      <div
                                        style={{
                                          width: '15px',
                                          height: '15px',
                                          background: '#D5D9EC',
                                          borderRadius: '3px'
                                        }}
                                      />
                                      <div
                                        style={{
                                          width: '8px',
                                          height: '8px',
                                          background: '#D5D9EC',
                                          borderRadius: '3px'
                                        }}
                                      />
                                    </div>{' '}
                                    <div style={{ fontSize: '11px', color: '#5B6484' }}>
                                      fragmented files
                                    </div>
                                  </div>{' '}
                                  <div style={{ fontSize: '20px', color: '#6E7CFF' }}>→</div>{' '}
                                  <div style={{ textAlign: 'center' }}>
                                    <div
                                      style={{
                                        display: 'flex',
                                        gap: '6px',
                                        justifyContent: 'center',
                                        marginBottom: '10px'
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '26px',
                                          height: '26px',
                                          background: '#3D4FF0',
                                          borderRadius: '5px'
                                        }}
                                      />
                                      <div
                                        style={{
                                          width: '26px',
                                          height: '26px',
                                          background: '#3D4FF0',
                                          borderRadius: '5px'
                                        }}
                                      />
                                    </div>{' '}
                                    <div style={{ fontSize: '11px', color: '#5B6484' }}>
                                      compacted
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : null}{' '}
                            {feat.isConfig ? (
                              <>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    marginBottom: '26px'
                                  }}
                                >
                                  <div
                                    style={{
                                      flex: '1',
                                      textAlign: 'center',
                                      padding: '18px 0',
                                      background: '#F6F7FC',
                                      border: '1px solid #EEF0F8',
                                      borderRadius: '12px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontSize: '34px',
                                        fontWeight: '700',
                                        color: '#10173A'
                                      }}
                                    >
                                      1
                                    </div>{' '}
                                    <div
                                      style={{
                                        fontSize: '11px',
                                        color: '#5B6484',
                                        marginTop: '4px'
                                      }}
                                    >
                                      Fusion parameter
                                    </div>
                                  </div>{' '}
                                  <div
                                    style={{
                                      flex: '1',
                                      textAlign: 'center',
                                      padding: '18px 0',
                                      background: '#F6F7FC',
                                      border: '1px solid #EEF0F8',
                                      borderRadius: '12px',
                                      opacity: '0.6'
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontSize: '34px',
                                        fontWeight: '700',
                                        color: '#A6ABC5'
                                      }}
                                    >
                                      10+
                                    </div>{' '}
                                    <div
                                      style={{
                                        fontSize: '11px',
                                        color: '#8890C4',
                                        marginTop: '4px'
                                      }}
                                    >
                                      Spark parameters
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : null}{' '}
                            {feat.isHosted ? (
                              <>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '24px',
                                    marginBottom: '26px',
                                    paddingBottom: '22px',
                                    borderBottom: '1px solid #EDEFF6'
                                  }}
                                >
                                  <div
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                  >
                                    <span
                                      style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#3D4FF0',
                                        flexShrink: '0'
                                      }}
                                    />{' '}
                                    <span
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#10173A'
                                      }}
                                    >
                                      Docker
                                    </span>
                                  </div>{' '}
                                  <div
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                  >
                                    <span
                                      style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#3D4FF0',
                                        flexShrink: '0'
                                      }}
                                    />{' '}
                                    <span
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#10173A'
                                      }}
                                    >
                                      Kubernetes
                                    </span>
                                  </div>
                                </div>
                              </>
                            ) : null}{' '}
                            <div style={{ fontSize: '15px', lineHeight: '1.7', color: '#5B6484' }}>
                              {feat.body}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>{' '}
          <div
            style={{
              minHeight: '65vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
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
                  'radial-gradient(ellipse 70% 55% at 50% 34%, rgba(61,79,240,0.07), transparent 72%), repeating-linear-gradient(0deg, rgba(61,79,240,0.045) 0 1px, transparent 1px 68px), repeating-linear-gradient(90deg, rgba(61,79,240,0.035) 0 1px, transparent 1px 68px)',
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
                BENCHMARKS
              </div>{' '}
              <h2
                className='sec-title'
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: '600',
                  fontSize: '38px',
                  color: '#0D1230',
                  marginBottom: '20px'
                }}
              >
                Engineered for Performance
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
                OLake Fusion compacts Apache Iceberg tables <b>2.06× </b>
                faster than Apache Spark and at roughly <b>half the cost</b>.
              </div>{' '}
              <div
                style={{
                  border: '1px solid #E4E7F2',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  textAlign: 'left',
                  background: '#fff',
                  boxShadow: '0 18px 40px -24px rgba(16,23,58,0.35)'
                }}
              >
                <div
                  className='bench-row'
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1fr 1fr',
                    padding: '20px 32px',
                    background: '#F6F7FC',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    color: '#5B6484'
                  }}
                >
                  <div>METRICS</div> <div>SPARK COMPACTION</div>{' '}
                  <div>
                    <span style={{ color: '#10173A' }}>OLake</span>
                    <span style={{ color: '#3D4FF0' }}>Fusion</span>
                  </div>
                </div>{' '}
                {(benchmarkRows || []).map((row, rowIdx) => (
                  <React.Fragment key={rowIdx}>
                    <div
                      className='bench-row'
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.4fr 1fr 1fr',
                        alignItems: 'center',
                        padding: '22px 32px',
                        borderTop: '1px solid #EEF0F8'
                      }}
                    >
                      <div
                        className='bench-cell-metric'
                        style={{ fontSize: '15px', fontWeight: '600', color: '#10173A' }}
                      >
                        {row.metric}
                      </div>{' '}
                      <div style={{ fontSize: '16px', color: '#A6ABC5' }}>{row.spark}</div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '600', color: '#10173A' }}>
                          {row.fusion}
                        </span>{' '}
                        <span
                          style={{
                            background: '#E4F8EA',
                            color: '#1D8A4C',
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: '4px 10px',
                            borderRadius: '999px'
                          }}
                        >
                          {row.delta}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
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
                    HOW FUSION DOES THIS
                  </div>{' '}
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#8890C4',
                      transform: `${benchmarkInfoArrow}`
                    }}
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
                        <span style={{ fontWeight: '600', color: '#10173A' }}>
                          Per-table scheduling
                        </span>{' '}
                        — compaction schedules run in sets; Lite, Medium, or Full, instead of
                        one-size-fits-all.
                      </div>{' '}
                      <div>
                        <span style={{ fontWeight: '600', color: '#10173A' }}>Smarter deletes</span>{' '}
                        — equality deletes convert to position deletes before merge, so queries do
                        less work.
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              <a
                href='/docs/fusion/getting-started/compaction/'
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
                view detailed benchmarks →
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
                  <div
                    className='cta-title'
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: '700',
                      fontSize: '30px',
                      color: '#fff',
                      maxWidth: '620px',
                      width: '620px',
                      height: '40px'
                    }}
                  >
                    Optimize your Iceberg tables today!
                  </div>
                </div>{' '}
                <a
                  className='olakefusion-h2'
                  href='/docs/fusion/getting-started/quickstart/'
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
                  Try, it's Free
                </a>
              </div>
            </div>
          </div>{' '}
          <div
            style={{
              minHeight: '65vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
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
                  fontWeight: '600',
                  fontSize: '38px',
                  color: '#0D1230',
                  textAlign: 'center',
                  marginBottom: '48px'
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
                            color: '#10173A'
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
          </div>{' '}
        </div>
      </div>
    </Layout>
  )
}
