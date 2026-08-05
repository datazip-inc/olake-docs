// @ts-nocheck
import { useState, useRef, useEffect, useMemo } from 'react'

export function useHomeLogic(props = {}) {
  const [state, setStateRaw] = useState({
    resourcesOpen: false,
    contributorsOpen: false,
    productOpen: false,
    docsOpen: false,
    advantage: 'go'
  })
  const stateRef = useRef(state)
  stateRef.current = state
  const setState = (u) =>
    setStateRaw((s) => {
      const p = typeof u === 'function' ? u(s) : u
      return p ? { ...s, ...p } : s
    })
  const self = useRef({}).current

  const openProduct = () => {
    setState({ productOpen: true })
  }

  const closeProduct = () => {
    setState({ productOpen: false })
  }

  const openDocs = () => {
    setState({ docsOpen: true })
  }

  const closeDocs = () => {
    setState({ docsOpen: false })
  }

  const openResources = () => {
    setState({ resourcesOpen: true })
  }

  const closeResources = () => {
    setState({ resourcesOpen: false, contributorsOpen: false })
  }

  const openContributors = () => {
    setState({ contributorsOpen: true })
  }

  const closeContributors = () => {
    setState({ contributorsOpen: false })
  }

  const renderVals = () => {
    const isGo = stateRef.current.advantage === 'go'
    const activeTab = '#193AE6'
    const R = (typeof window !== 'undefined' && window.__resources) || {}
    const advImg =
      props.advantageImage ?? (R.icebergBg || '/img/landing/shared/iceberg-backdrop.webp')
    const advOv = props.advantageOverlay ?? 0.78
    const advWl = props.advantageWaterline ?? 74
    const advantagePos = 'center, center ' + advWl + '%'
    const advantageStats = (
      isGo
        ? [
            { value: '12.5×', label: 'Faster than traditional tools' },
            { value: '90%', label: 'Cost savings with OSS' }
          ]
        : [
            { value: '2×', label: 'Faster than Apache Spark' },
            { value: '~50%', label: 'Cheaper per compaction cycle' }
          ]
    ).map((s) => {
      const m = String(s.value).match(/^(\D*)([\d.]+)(\D*)$/) || ['', '', s.value, '']
      const numStr = m[2] || '0'
      return {
        ...s,
        prefix: m[1] || '',
        suffix: m[3] || '',
        num: parseFloat(numStr) || 0,
        decimals: (numStr.split('.')[1] || '').length
      }
    })
    self._counts = advantageStats.map((s) => ({
      num: s.num,
      prefix: s.prefix,
      suffix: s.suffix,
      decimals: s.decimals
    }))
    const advantageBg =
      'linear-gradient(160deg, rgba(72,98,235,' +
      (advOv * 0.92).toFixed(3) +
      '), rgba(25,58,230,' +
      advOv.toFixed(3) +
      ")), url('" +
      advImg +
      "')"
    // w/h are the files' intrinsic sizes, set on the <img> so the marquee reserves
    // space before the logos load.
    const logos = [
      { src: '/img/landing/v2/logo-bitespeed.webp', name: 'Bitespeed', w: 340, h: 65 },
      { src: '/img/landing/v2/logo-xeno.webp', name: 'Xeno', w: 176, h: 88 },
      { src: '/img/landing/v2/logo-cordial.webp', name: 'Cordial', w: 244, h: 88 },
      { src: '/img/landing/v2/logo-lendingkart.webp', name: 'Lending Kart', w: 168, h: 88 },
      { src: '/img/landing/v2/logo-astrotalk.webp', name: 'Astro Talk', w: 246, h: 88 },
      { src: '/img/landing/v2/logo-physicswallah.webp', name: 'Physics Wallah', w: 246, h: 88 }
    ]
    const ticker = [
      'Postgres',
      'MySQL',
      'MongoDB',
      'Oracle',
      'Kafka',
      'S3',
      'DB2 LUW',
      'MSSQL',
      'Apache Iceberg',
      'Parquet'
    ]

    return {
      advantageBg,
      advantagePos,
      advantageStats,
      resourcesOpen: stateRef.current.resourcesOpen,
      contributorsOpen: stateRef.current.contributorsOpen,
      productOpen: stateRef.current.productOpen,
      docsOpen: stateRef.current.docsOpen,
      openProduct: () => openProduct(),
      closeProduct: () => closeProduct(),
      openDocs: () => openDocs(),
      closeDocs: () => closeDocs(),
      openResources: () => openResources(),
      closeResources: () => closeResources(),
      openContributors: () => openContributors(),
      closeContributors: () => closeContributors(),

      terminalLines: [
        {
          prefix: '$ ',
          color: '#3fa872',
          text: 'olake sync --source postgres --dest iceberg',
          textColor: '#070911',
          delay: 0
        },
        {
          prefix: '  ',
          color: '#7b84a4',
          text: '→ CDC stream connected · 8 tables',
          textColor: '#424865',
          delay: 0.3
        },
        {
          prefix: '  ',
          color: '#7b84a4',
          text: '→ chunking in parallel ....... done',
          textColor: '#424865',
          delay: 0.5
        },
        {
          prefix: '✓ ',
          color: '#3fa872',
          text: '1.8B rows → Iceberg on S3',
          textColor: '#070911',
          delay: 0.7
        },
        {
          prefix: '$ ',
          color: '#3fa872',
          text: 'olake fusion --maintain',
          textColor: '#070911',
          delay: 1.0
        },
        {
          prefix: '  ',
          color: '#7b84a4',
          text: '→ compaction · cleanup · metadata',
          textColor: '#424865',
          delay: 1.2
        },
        {
          prefix: '✓ ',
          color: '#3fa872',
          text: 'tables optimized · 2× faster than Spark',
          textColor: '#193AE6',
          delay: 1.4
        }
      ],

      tickerLoop: [...ticker, ...ticker],

      engines: [
        {
          tag: '// OLAKE GO',
          tagColor: '#193AE6',
          glow: 'rgba(25, 58, 230, 0.4)',
          borderColor: 'rgba(25, 58, 230, 0.4)',
          edgeColor: '#313858',
          glyphBg: '#040615',
          glyphBorder: 'rgba(25, 58, 230, 0.25)',
          glyph: 'G',
          href: '/olake-go',
          title: 'OLake Go',
          body: 'Replicate your databases into Apache Iceberg & Parquet on S3.',
          chips: [{ label: 'CDC' }, { label: 'Parallel chunking' }, { label: 'Incremental sync' }],
          link: 'Explore OLake Go'
        },
        {
          tag: '// OLAKE FUSION',
          tagColor: '#193AE6',
          glow: 'rgba(25, 58, 230, 0.35)',
          borderColor: 'rgba(25, 58, 230, 0.4)',
          edgeColor: '#292f4b',
          glyphBg: '#03040f',
          glyphBorder: 'rgba(25, 58, 230, 0.2)',
          glyph: 'F',
          href: '/olake-fusion',
          title: 'OLake Fusion',
          body: 'Keep your Apache Iceberg tables consistently performant and scalable.',
          chips: [
            { label: 'Compaction' },
            { label: 'Cleanup', soon: true },
            { label: 'Metadata trim' }
          ],
          link: 'Explore OLake Fusion'
        }
      ],

      // Copies of the logo set; enough to keep the marquee covered on wide screens.
      logoGroups: Array.from({ length: 4 }, () => logos),

      selectGo: () => setState({ advantage: 'go' }),
      selectFusion: () => setState({ advantage: 'fusion' }),
      benchmarkHref: isGo
        ? '/docs/benchmarks/ingestion/'
        : '/docs/fusion/getting-started/compaction/',
      goTabBg: isGo ? activeTab : 'transparent',
      goTabColor: isGo ? '#ffffff' : '#000000',
      fusionTabBg: !isGo ? activeTab : 'transparent',
      fusionTabColor: !isGo ? '#ffffff' : '#000000',

      whyRows: [
        {
          stickyTop: 96,
          z: 1,
          accent: '#193AE6',
          num: '01',
          kicker: 'FAST',
          title: 'Replicate databases at scale',
          body: 'Sync MySQL, Postgres, MongoDB, Kafka, and more to Apache Iceberg with parallelised chunking, incremental sync, and CDC.'
        },
        {
          stickyTop: 138,
          z: 2,
          accent: '#193AE6',
          num: '02',
          kicker: 'OPEN',
          title: 'Built on open standards',
          body: 'Write directly to Apache Iceberg or Parquet, with support for AWS Glue, Hive Metastore, and REST catalogs like Nessie, Polaris, and Unity. '
        },
        {
          stickyTop: 180,
          z: 3,
          accent: '#193AE6',
          num: '03',
          kicker: 'CONTROLLED',
          title: 'Self-hosted, on your infrastructure',
          body: 'Deploy entirely within your own cloud or on-prem, keeping full control over where regulated data lives.'
        },
        {
          stickyTop: 222,
          z: 4,
          accent: '#3fa872',
          num: '04',
          kicker: 'MAINTAINED',
          title: 'Keep tables fast as data keeps growing',
          body: 'Automated compaction, delete-file cleanup, and metadata trimming keep query performance and storage costs in check as you scale.'
        }
      ],

      bulletin: [
        {
          slotId: 'bulletin-1',
          url: props.latestReleasePath || '/docs/release/ingestion',
          img: R.bullRelease || '/img/landing/v2/bull-release.webp',
          imgPlaceholder: 'Add thumbnail',
          tag: 'RELEASE',
          title: props.latestReleaseLabel || 'OLake'
        },
        {
          slotId: 'bulletin-2',
          url: '/blog/iceberg-compaction-spark-vs-fusion-benchmark/',
          img: R.bullBenchmark || '/img/landing/v2/bull-benchmark.webp',
          imgPlaceholder: 'Add thumbnail',
          tag: 'BLOG',
          title: 'Fusion vs. Spark'
        },
        {
          slotId: 'bulletin-3',
          url: '/blog/schema-evolution-without-breaking-pipelines/',
          img: R.bullEngineering || '/img/landing/v2/bull-engineering.webp',
          imgPlaceholder: 'Add thumbnail',
          tag: 'BLOG',
          title: 'Schema evolution'
        }
      ],

      stories: [
        {
          quote: 'Zero Pipeline failure, 50% faster loads.',
          company: 'Xeno',
          logo: '/img/landing/v2/logo-xeno.webp'
        },
        {
          quote: "Cordial's Path to an AI-Ready Lakehouse.",
          company: 'Cordial',
          logo: '/img/landing/v2/logo-cordial.webp'
        },
        {
          quote: 'From 40-Minute to Sub-Minute Segmentation Queries',
          company: 'Bitespeed',
          logo: '/img/landing/v2/logo-bitespeed.webp'
        }
      ],

      resources: [
        {
          type: 'DEMO',
          title: 'OLake quickstart: your first ingestion pipeline',
          href: 'https://youtu.be/IcAJmW72d2A?si=bAmaDOdEDy6vbKt8'
        },
        { type: 'WEBINAR', title: 'Iceberg for Agents', href: '/webinar/w-14-iceberg-for-agents' },
        {
          type: 'WEBINAR',
          title: 'Apache Arrow + ADBC & Apache Iceberg',
          href: 'https://www.youtube.com/watch?v=shrS0qdOPis&list=PL0H6rlkVhiiGSaO_xr1xBJ16dQKI-jvF_&index=14'
        },
        {
          type: 'BLOG',
          title: 'Issues with Debezium — and how OLake solves them',
          href: '/blog/issues-debezium-kafka/'
        }
      ]
    }
  }

  useEffect(() => {
    self._fitArch = () => {
      const frame = document.getElementById('archFrame')
      const canvas = document.getElementById('archCanvas')
      if (!frame || !canvas) return
      const s = frame.clientWidth / 1680
      canvas.style.transform = 'scale(' + s + ')'
      frame.style.height = 452 * s + 'px'
    }
    self._fitArch()
    window.addEventListener('resize', self._fitArch)
    setTimeout(self._fitArch, 200)
    setTimeout(self._fitArch, 900)

    const card = document.querySelector('[data-countup]')
    self._counters = [...document.querySelectorAll('[data-countup]')]
    self._animEl = (el, instant) => {
      const target = parseFloat(el.getAttribute('data-countup')) || 0
      const decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0
      const prefix = el.getAttribute('data-prefix') || ''
      const suffix = el.getAttribute('data-suffix') || ''
      const finalText = prefix + target.toFixed(decimals) + suffix
      const token = (el._ct = (el._ct || 0) + 1)
      if (instant) {
        el.textContent = finalText
        return
      }
      const dur = 1100
      let start = null
      const step = (ts) => {
        if (token !== el._ct) return
        if (start === null) start = ts
        const p = Math.min((ts - start) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        el.textContent = p < 1 ? prefix + (target * eased).toFixed(decimals) + suffix : finalText
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
    // Toggling the Go/Fusion tab updates the target: show it statically, no roll.
    self._mo = new MutationObserver((muts) => {
      muts.forEach((m) => self._animEl(m.target, true))
    })
    self._counters.forEach((el) =>
      self._mo.observe(el, { attributes: true, attributeFilter: ['data-countup'] })
    )
    if (card && 'IntersectionObserver' in window) {
      self._io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              self._counters.forEach((el) => self._animEl(el))
              self._io.disconnect()
            }
          })
        },
        { threshold: 0.4 }
      )
      self._io.observe(card.closest('div[style*="border-radius: 22px"]') || card)
    } else {
      self._counters.forEach((el) => self._animEl(el))
    }

    return () => {
      if (self._fitArch) window.removeEventListener('resize', self._fitArch)
      if (self._io) self._io.disconnect()
      if (self._mo) self._mo.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return renderVals()
}
