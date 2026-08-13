// @ts-nocheck
import { useState, useRef, useEffect } from 'react'
import {
  CONNECTORS,
  CONNECTOR_BENCHMARKS,
  CONNECTOR_CDC_BENCHMARKS,
  CONNECTOR_METRIC_LABELS,
  TOOLS
} from '@site/src/data/benchmarkData'

// Row order of the benchmark table, top to bottom.
const BENCHMARK_METRICS = ['rowsSynced', 'elapsedTime', 'speed', 'comparison', 'cost']

// The table renders a fixed 4 competitor columns. Kafka is benchmarked against
// Apache Flink rather than Debezium, which is why the set is per-connector.
const competitorKeys = (bench) =>
  bench.rowsSynced.flink !== undefined
    ? ['airbyte', 'fivetran', 'estuary', 'flink']
    : ['airbyte', 'fivetran', 'debezium', 'estuary']

export function useGoLogic(props = {}) {
  const [state, setStateRaw] = useState({
    faqs: [
      {
        q: 'How to get started?',
        a: 'Check the Quickstart Guide. With a single Docker command you can spin up OLake Go and access the UI.'
      },
      {
        q: 'Is OLake Go really open source?',
        a: 'Yes. OLake Go is fully open source under the Apache 2.0 license. You can explore the GitHub repository (already starred by 1K+ developers) and use it freely without hidden costs.'
      },
      {
        q: 'Is there any enterprise plan?',
        a: "We're actively working on providing enterprise support, from professional assistance and pilot programs to helping teams scale OLake Go in production. You can reach out at hello@olake.io to learn more."
      },
      {
        q: 'How can I contribute?',
        a: 'Join our Slack community, review the Contribution Guide, and explore "Good First Issues" on GitHub. Contributors can get their pull requests merged and be part of building the fastest open-source Iceberg-native ingestion tool.'
      },
      {
        q: 'Why should I use OLake Go?',
        a: 'OLake Go makes data replication into Apache Iceberg seamless, faster, and cost-efficient. It handles real-time CDC, schema and partition evolution, full and incremental syncs, and compaction, all without vendor lock-in, so your Iceberg tables stay open, scalable, and ready for analytics.'
      },
      {
        q: 'What data platforms and tools does OLake Go integrate with?',
        a: 'As of now, we integrate with Apache Iceberg and S3 as destinations. You can query it using popular query engines like Spark, AWS Athena, Snowflake, Databricks, and BigQuery.'
      }
    ],
    openFaq: -1,
    activeFeature: 0,
    progress: 0,
    resourcesOpen: false,
    productOpen: false,
    contributorsOpen: false,
    paused: false,
    benchmarksInfoOpen: false,
    activeSource: 0,
    benchmarkMode: 'full_load',
    mobileMenuOpen: false
  })
  const stateRef = useRef(state)
  stateRef.current = state
  const setState = (u) =>
    setStateRaw((s) => {
      const p = typeof u === 'function' ? u(s) : u
      return p ? { ...s, ...p } : s
    })
  const self = useRef({}).current

  const toggleFaq = (i) => {
    setState((s) => ({ openFaq: s.openFaq === i ? -1 : i }))
  }

  const selectSource = (i) => {
    setState({ activeSource: i })
  }

  const buildBenchmarks = () => {
    const G = '#2E9E44',
      GB = '#EAF6E9'
    const connector = CONNECTORS[stateRef.current.activeSource] || CONNECTORS[0]
    const dataset =
      stateRef.current.benchmarkMode === 'cdc' ? CONNECTOR_CDC_BENCHMARKS : CONNECTOR_BENCHMARKS
    const bench = dataset[connector.id] || {}
    const comps = competitorKeys(bench)
    const def = {
      comps: comps.map((key) => TOOLS[key].name),
      rows: BENCHMARK_METRICS.map((metric) => {
        const row = bench[metric] || {}
        const isCmp = metric === 'comparison'
        return {
          label: CONNECTOR_METRIC_LABELS[metric],
          cmp: isCmp,
          // OLake is the baseline for the comparison row, so it shows a dash
          // rather than a multiplier against itself.
          olake: isCmp ? '–' : row.olake,
          comps: comps.map((key) => row[key] ?? '-')
        }
      })
    }
    const comingSoon = !bench.hasData
    const sourceName = connector.name
    const cols = [
      {
        name: 'Metrics',
        sub: '',
        hasSub: false,
        olake: false,
        color: '#10173A',
        bg: 'transparent',
        align: 'flex-start'
      },
      {
        name: 'OLake Go',
        sub: TOOLS.olake.description,
        hasSub: true,
        olake: true,
        color: '#10173A',
        bg: GB,
        align: 'center'
      },
      ...def.comps.map((name) => ({
        name,
        sub: '',
        hasSub: false,
        olake: false,
        color: '#10173A',
        bg: 'transparent',
        align: 'center'
      }))
    ]
    const cell = (text, type) => ({
      text,
      color: type === 'olake' ? G : type === 'cmp' ? '#3D4FF0' : '#4A5170',
      weight: type === 'olake' || type === 'cmp' ? 700 : 500,
      bg: type === 'olake' ? GB : 'transparent'
    })
    const table = def.rows.map((r) => ({
      label: r.label,
      sub:
        r.label === 'Cost'
          ? 'OLake is OSS and self-hosted — only pay for your infrastructure.'
          : '',
      hasSub: r.label === 'Cost',
      cells: [cell(r.olake, 'olake'), ...r.comps.map((v) => cell(v, r.cmp ? 'cmp' : 'normal'))]
    }))
    return { cols, table, comingSoon, sourceName }
  }

  const selectBenchmarkMode = (mode) => {
    setState({ benchmarkMode: mode })
  }

  const tick = () => {
    if (!self._started) return
    setState((s) => {
      if (s.paused) return null
      const next = s.progress + 1
      if (next >= 100) {
        return { progress: 0, activeFeature: (s.activeFeature + 1) % 4 }
      }
      return { progress: next }
    })
  }

  const selectFeature = (i) => {
    setState({ activeFeature: i, progress: 100, paused: true })
  }

  const toggleBenchmarkInfo = () => {
    setState((s) => ({ benchmarksInfoOpen: !s.benchmarksInfoOpen }))
  }

  const toggleMobileMenu = () => {
    setState((s) => ({ mobileMenuOpen: !s.mobileMenuOpen }))
  }

  const openResources = () => {
    setState({ resourcesOpen: true })
  }

  const closeResources = () => {
    setState({ resourcesOpen: false, contributorsOpen: false })
  }

  const openProduct = () => {
    setState({ productOpen: true })
  }

  const closeProduct = () => {
    setState({ productOpen: false })
  }

  const openContributors = () => {
    setState({ contributorsOpen: true })
  }

  const closeContributors = () => {
    setState({ contributorsOpen: false })
  }

  const sentence = (words, emphasize, base) => {
    const emph = (emphasize || []).map((w) => w.toLowerCase().replace(/[^a-z']/g, ''))
    return words.map((text) => {
      const norm = text.toLowerCase().replace(/[^a-z']/g, '')
      const isEmph = emph.includes(norm)
      return {
        text,
        size: isEmph ? base + 7 : base,
        weight: isEmph ? 700 : 500,
        color: isEmph ? '#3D4FF0' : '#10173A',
        opacity: isEmph ? 1 : 0.7
      }
    })
  }

  const renderVals = () => {
    const posX = props.icebergPosX ?? 50
    const posY = props.icebergPosY ?? 50
    const zoom = props.icebergZoom ?? 100
    const op = (props.icebergOpacity ?? 32) / 100
    const icebergStyle = `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:${posX}% ${posY}%; transform:scale(${zoom / 100}); opacity:${op}; pointer-events:none;`
    const bm = buildBenchmarks()
    return {
      icebergStyle,
      problemSentences: [
        {
          top: 22,
          left: 42,
          rot: -3,
          delay: 0,
          words: sentence(
            ['Slow', 'syncs', 'BLOCK', 'your', 'analytics'],
            ['Slow', 'syncs', 'BLOCK'],
            28
          )
        },
        {
          top: 43,
          left: 57,
          rot: 2,
          delay: 0.6,
          words: sentence(['Legacy', 'ETL', 'costs', 'PILE UP', 'fast'], ['costs', 'PILE UP'], 24)
        },
        {
          top: 64,
          left: 46,
          rot: -2,
          delay: 1.2,
          words: sentence(
            ['CDC', 'pipelines', 'BREAK', 'silently', 'in', 'production'],
            ['CDC', 'BREAK'],
            25
          )
        },
        {
          top: 85,
          left: 55,
          rot: 3,
          delay: 0.3,
          words: sentence(['Schema', 'drift', 'stalls', 'ingestion'], ['Schema', 'drift'], 23)
        }
      ],
      features: [0, 1, 2, 3].map((i) => {
        const list = [
          {
            title: 'FULL, INCREMENTAL & CDC SYNCS',
            body: 'Run full loads, incremental pulls, or real-time change data capture, whatever each table needs, all from a single tool.',
            tag: 'tiered'
          },
          {
            title: 'SCHEMA & PARTITION EVOLUTION',
            body: 'Source schemas change and partitions grow. OLake Go evolves your Iceberg tables automatically so pipelines never break.',
            tag: 'decay'
          },
          {
            title: 'PARALLELISED CHUNKING',
            body: 'Large collections are split into virtual chunks read in parallel, dramatically cutting the time for full snapshots of big datasets.',
            tag: 'chunk',
            stats: ['Parallel reads', 'Virtual chunks', 'Faster snapshots']
          },
          {
            title: 'STATEFUL, RESUMABLE SYNCS',
            body: 'Syncs checkpoint their progress and resume automatically after crashes or network failures; never from scratch.',
            tag: 'resume',
            stats: ['Checkpointed', 'Auto-resume', 'Fault-tolerant']
          }
        ][i]
        const active = stateRef.current.activeFeature === i
        const builtIn = ['tiered', 'decay', 'config', 'hosted']
        return {
          ...list,
          active,
          titleColor: active ? '#fff' : '#BFC7F2',
          progress: active ? stateRef.current.progress : 0,
          isTiered: list.tag === 'tiered',
          isDecay: list.tag === 'decay',
          isConfig: list.tag === 'config',
          isHosted: list.tag === 'hosted',
          isChunk: list.tag === 'chunk',
          isResume: list.tag === 'resume',
          isGeneric: !builtIn.includes(list.tag),
          hasStats: Array.isArray(list.stats),
          onSelect: () => selectFeature(i)
        }
      }),
      benchSources: (() => {
        const act = stateRef.current.activeSource
        return CONNECTORS.map((connector, i) => ({
          name: connector.name,
          onSelect: () => selectSource(i),
          color: act === i ? '#3D4FF0' : '#5B6484',
          bg: act === i ? '#E7EAFE' : 'transparent',
          weight: act === i ? 700 : 500
        }))
      })(),
      benchModes: [
        { key: 'full_load', label: 'Full Load' },
        { key: 'cdc', label: 'CDC' }
      ].map((mode) => {
        const active = stateRef.current.benchmarkMode === mode.key
        return {
          ...mode,
          active,
          color: active ? '#3D4FF0' : '#5B6484',
          weight: active ? 700 : 500,
          onSelect: () => selectBenchmarkMode(mode.key)
        }
      }),
      benchModeIndicatorLeft:
        stateRef.current.benchmarkMode === 'full_load' ? '4px' : 'calc(50% + 0px)',
      benchCols: bm.cols,
      benchTable: bm.table,
      benchComingSoon: bm.comingSoon,
      benchHasData: !bm.comingSoon,
      benchSourceName: bm.sourceName,
      faqs: stateRef.current.faqs.map((f, i) => ({
        ...f,
        open: stateRef.current.openFaq === i,
        sign: stateRef.current.openFaq === i ? '\u2191' : '\u2193',
        onToggle: () => toggleFaq(i)
      })),
      toggleFaq: (i) => toggleFaq(i),
      selectFeature: (i) => selectFeature(i),
      benchmarksInfoOpen: stateRef.current.benchmarksInfoOpen,
      benchmarkInfoArrow: stateRef.current.benchmarksInfoOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      toggleBenchmarkInfo: () => toggleBenchmarkInfo(),
      mobileMenuOpen: stateRef.current.mobileMenuOpen,
      toggleMobileMenu: () => toggleMobileMenu(),
      resourcesOpen: stateRef.current.resourcesOpen,
      productOpen: stateRef.current.productOpen,
      openProduct: () => openProduct(),
      closeProduct: () => closeProduct(),
      contributorsOpen: stateRef.current.contributorsOpen,
      openResources: () => openResources(),
      closeResources: () => closeResources(),
      openContributors: () => openContributors(),
      closeContributors: () => closeContributors()
    }
  }

  useEffect(() => {
    self._tick = setInterval(() => tick(), 100)
    self._started = false

    self._drawLinks = () => {
      const svg = document.getElementById('arch-links')
      const inner = document.querySelector('.arch-inner')
      const node = document.getElementById('olake-node')
      if (!svg || !inner || !node) return
      const srcs = Array.from(document.querySelectorAll('.src-box'))
      const dests = Array.from(document.querySelectorAll('.dest-box'))
      const c = inner.getBoundingClientRect()
      const nb = node.getBoundingClientRect()
      // Skip when the diagram has stacked/wrapped (mobile)
      if (!srcs.length || !dests.length || srcs[0].getBoundingClientRect().right > nb.left + 4) {
        svg.innerHTML = ''
        return
      }
      svg.setAttribute('viewBox', '0 0 ' + c.width + ' ' + c.height)
      // Extend endpoints a few px INTO the boxes so lines visibly touch (svg sits behind boxes)
      const nodeL = { x: nb.left - c.left + 10, y: nb.top - c.top + nb.height / 2 }
      const nodeR = { x: nb.right - c.left - 10, y: nb.top - c.top + nb.height / 2 }
      let defs =
        '<defs>' +
        '<linearGradient id="gIn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C7CEF6"></stop><stop offset="1" stop-color="#3D4FF0"></stop></linearGradient>' +
        '<linearGradient id="gOut" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3D4FF0"></stop><stop offset="1" stop-color="#C7CEF6"></stop></linearGradient>' +
        '</defs>'
      let paths = '',
        dots = ''
      srcs.forEach((s, i) => {
        const r = s.getBoundingClientRect()
        const p = { x: r.right - c.left - 8, y: r.top - c.top + r.height / 2 }
        const dx = Math.max(28, (nodeL.x - p.x) * 0.5)
        const d =
          'M' +
          p.x +
          ',' +
          p.y +
          ' C' +
          (p.x + dx) +
          ',' +
          p.y +
          ' ' +
          (nodeL.x - dx) +
          ',' +
          nodeL.y +
          ' ' +
          nodeL.x +
          ',' +
          nodeL.y
        paths += '<path d="' + d + '" fill="none" stroke="url(#gIn)" stroke-width="2"></path>'
        dots +=
          '<circle r="3.5" fill="#3D4FF0"><animateMotion dur="2.4s" begin="' +
          i * 0.28 +
          's" repeatCount="indefinite" path="' +
          d +
          '"></animateMotion></circle>'
      })
      dests.forEach((s, i) => {
        const r = s.getBoundingClientRect()
        const p = { x: r.left - c.left + 8, y: r.top - c.top + r.height / 2 }
        const dx = Math.max(28, (p.x - nodeR.x) * 0.5)
        const d =
          'M' +
          nodeR.x +
          ',' +
          nodeR.y +
          ' C' +
          (nodeR.x + dx) +
          ',' +
          nodeR.y +
          ' ' +
          (p.x - dx) +
          ',' +
          p.y +
          ' ' +
          p.x +
          ',' +
          p.y
        paths += '<path d="' + d + '" fill="none" stroke="url(#gOut)" stroke-width="2"></path>'
        dots +=
          '<circle r="4" fill="#3D4FF0"><animateMotion dur="2.4s" begin="' +
          (0.6 + i * 0.6) +
          's" repeatCount="indefinite" path="' +
          d +
          '"></animateMotion></circle>'
      })
      svg.innerHTML = defs + paths + dots
    }
    self._drawRaf = requestAnimationFrame(() => self._drawLinks())
    setTimeout(() => self._drawLinks(), 400)
    self._onArchResize = () => self._drawLinks()
    window.addEventListener('resize', self._onArchResize, { passive: true })

    const el = document.getElementById('features')
    if (el && 'IntersectionObserver' in window) {
      self._observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !self._started) {
            self._started = true
            setState({ progress: 0 })
          }
        },
        { threshold: 0.4 }
      )
      self._observer.observe(el)
    } else {
      self._started = true
    }

    return () => {
      clearInterval(self._tick)
      if (self._observer) self._observer.disconnect()
      if (self._onArchResize) window.removeEventListener('resize', self._onArchResize)
      if (self._drawRaf) cancelAnimationFrame(self._drawRaf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return renderVals()
}
