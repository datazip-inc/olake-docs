/* AUTO-GENERATED from the design's DCLogic block — method bodies copied verbatim,
   only `this.*` rewritten. Do not hand-edit; regenerate via scratchpad/logic2hook.js. */
/* eslint-disable */
// @ts-nocheck
import { useState, useRef, useEffect, useMemo } from 'react'

export function useFusionLogic(props = {}) {
  const [state, setStateRaw] = useState({
    faqs: [
      {
        q: 'What is OLake Fusion?',
        a: 'OLake Fusion is a self-hosted open-source software that keeps your lakehouse tables efficient, compact, and query-ready as your data continuously grows. As Iceberg tables evolve through ingestion, updates, and deletes, they accumulate small files, delete files, and excess metadata, all of which degrade query performance and increase storage overhead over time. Fusion manages that for you automatically.'
      },
      {
        q: 'When do I actually need table maintenance?',
        a: "Six situations call for it: frequent data ingestion or updates, accumulation of small files, presence of delete files, high partition cardinality, degrading query performance, and growing table size over time. If your tables are under continuous CDC pressure, you're in all six."
      },
      {
        q: 'Can I use OLake Fusion together with OLake Go?',
        a: "Yes, that's the intended path. Iceberg Maintenance ships as a maintenance module inside the OLake UI from v0.4.0, so Go handles ingestion and Fusion handles maintenance from the same place. New users can start with a combined Ingestion + Maintenance setup, and existing OLake Go users just upgrade the UI (Docker or Helm/Kubernetes) to unlock the module, no separate tool to adopt. Our own compaction benchmark ran exactly this way: OLake Go ingesting the TPC-H lineitem table while Fusion compacted it."
      },
      {
        q: 'Can I use OLake Fusion on its own, without OLake Go?',
        a: "Yes, Fusion maintains Apache Iceberg tables through your Iceberg catalog, so it operates on the tables themselves rather than on OLake's ingestion pipeline."
      },
      {
        q: 'How much faster is Fusion than Apache Spark?',
        a: 'On a CDC-like TPC-H workload (300 GB, ~1.8 billion rows in lineitem), Fusion compacted in 27 minutes 2 seconds versus Spark rewrite_data_files at 55 minutes 47 seconds; 2.06× faster on identical infrastructure.'
      },
      {
        q: 'Does it cost less than running Spark compaction?',
        a: 'Yes. On the same $2.36/hour infrastructure, the benchmark job cost $1.06 with Fusion and $2.19 with Spark, roughly half, because the job finishes in half the time.'
      },
      {
        q: 'Do I have to pause ingestion or queries while compaction runs?',
        a: 'No. In the benchmark, compaction ran for two hours while CDC-style updates (~200,000 rows every 2 minutes) and repeated TPC-H Query 6 executions continued in parallel, specifically to measure how concurrent compaction affects query latency and stability.'
      },
      {
        q: 'How often does compaction run?',
        a: "Fusion uses tiered triggers rather than one blunt job: Lite every 20 minutes and Medium every 40 minutes in the benchmark, plus Full as a periodic deep-clean for much larger datasets, terabyte-scale tables where long-term small-file buildup is higher. At the benchmark's sub-100 GB destination size, Full wasn't needed."
      },
      {
        q: 'How do I deploy it, and what does it cost to license?',
        a: 'Fusion is open-source and is deployed on Docker or Kubernetes. You pay only for the compute and storage you provision.'
      },
      {
        q: 'How much configuration does it need?',
        a: 'One parameter: target-size (512 MB in the benchmark). For comparison, the Spark rewrite_data_files job in the same test needed seven: strategy, target/max/min file size, concurrent rewrites, partial-progress, and delete-file threshold.'
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

  const wordCloud = (words, emphasize, matchIndex, bigWords) => {
    const sizes = [34, 22, 27, 24, 31, 21, 25]
    const weights = [700, 500, 600, 500, 700, 500, 600]
    const colors = ['#10173A', '#8890C4', '#10173A', '#3D4FF0', '#10173A', '#8890C4', '#10173A']
    const rots = [-3, 2, -1, 3, -2, 1, 0]
    const emph = (emphasize || []).map((w) => w.toLowerCase().replace(/[^a-z']/g, ''))
    const big = (bigWords || []).map((w) => w.toLowerCase().replace(/[^a-z']/g, ''))
    const mi = matchIndex || {}
    return words.map((text, i) => {
      const norm = text.toLowerCase().replace(/[^a-z']/g, '')
      const isEmph = emph.includes(norm)
      const isBig = big.includes(norm)
      const idx = mi[i] !== undefined ? mi[i] : i
      return {
        text,
        size: isEmph || isBig ? 33 : sizes[idx % sizes.length],
        weight: isEmph ? 700 : weights[idx % weights.length],
        color: isEmph ? '#10173A' : colors[idx % colors.length],
        opacity: isEmph ? 1 : 0.75 + (0.25 * ((idx * 37) % 10)) / 10,
        rot: isEmph ? 0 : rots[idx % rots.length],
        delay: (i % 5) * 0.3
      }
    })
  }

  const renderVals = () => {
    const posX = props.icebergPosX ?? 50
    const posY = props.icebergPosY ?? 50
    const zoom = props.icebergZoom ?? 100
    const op = (props.icebergOpacity ?? 32) / 100
    const icebergStyle = `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:${posX}% ${posY}%; transform:scale(${zoom / 100}); opacity:${op}; pointer-events:none;`
    return {
      icebergStyle,
      problemCards: [
        {
          words: wordCloud(
            ['Small', 'files', 'PILE UP', 'faster', 'than', 'you', 'notice'],
            ['Small', 'files', 'PILE UP']
          )
        },
        {
          words: wordCloud(
            ['Queries', 'get', 'SLOWER', 'every', 'day'],
            ['Queries', 'get', 'SLOWER']
          )
        },
        {
          words: wordCloud(
            ['Problems', "aren't", 'visible', 'until', "they're", 'expensive'],
            ['Problems', 'expensive'],
            { 4: 2 }
          )
        },
        {
          words: wordCloud(
            ['Compaction', 'becomes', 'a', 'debugging', 'issue'],
            ['Compaction'],
            null,
            ['debugging']
          )
        }
      ],
      features: [0, 1, 2, 3].map((i) => {
        const list = [
          {
            title: 'TIERED COMPACTION',
            body: 'Trigger-based tiers instead of one blunt job, so light cleanup runs constantly and deep rewrites only run when they\u2019re actually needed.',
            tag: 'tiered'
          },
          {
            title: 'REDUCED DECAY',
            body: 'Small files, delete files, and excess metadata pile up as tables evolve. Fusion resolves them periodically so query performance never degrades.',
            tag: 'decay'
          },
          {
            title: 'EASY CONFIGURATION',
            body: 'One target-size parameter replaces the seven Spark rewrite_data_files needs. Same result, far less to manage.',
            tag: 'config'
          },
          {
            title: 'SELF-HOSTED',
            body: 'Open-source and deployable on Docker or Kubernetes so you pay only for the compute and storage you provision.',
            tag: 'hosted'
          }
        ][i]
        const active = stateRef.current.activeFeature === i
        return {
          ...list,
          active,
          titleColor: active ? '#fff' : '#BFC7F2',
          progress: active ? stateRef.current.progress : 0,
          isTiered: list.tag === 'tiered',
          isDecay: list.tag === 'decay',
          isConfig: list.tag === 'config',
          isHosted: list.tag === 'hosted',
          onSelect: () => selectFeature(i)
        }
      }),
      benchmarkRows: [
        {
          metric: 'Total compaction time',
          spark: '55m 47s',
          fusion: '27m 02s',
          delta: '2.06X Faster'
        },
        {
          metric: 'Compaction cost / job',
          spark: '$2.19',
          fusion: '$1.06',
          delta: '52% Less Cost'
        },
        { metric: 'Config parameters', spark: '10+', fusion: '1', delta: '10X Simpler' }
      ],
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

    self._measureOrigin = () => {
      const node = document.getElementById('opt-node')
      if (node) {
        const r = node.getBoundingClientRect()
        self._originDocX = r.left + r.width / 2
        self._originDocY = r.top + window.scrollY + r.height / 2
      }
    }

    self._base = { x: 0, y: 0 }
    self._dodge = { x: 0, y: 0 }
    self._dodgeTarget = { x: 0, y: 0 }

    self._render = () => {
      const x = self._base.x + self._dodge.x
      const y = self._base.y + self._dodge.y
      const els = [
        ['scroll-packet', 0],
        ['trail-1', 4],
        ['trail-2', 8],
        ['trail-3', 12]
      ]
      for (const [id, lag] of els) {
        const el = document.getElementById(id)
        if (el) el.style.transform = 'translate(' + x + 'px,' + (y - lag) + 'px)'
      }
    }

    self._onScroll = () => {
      if (self._raf) return
      self._raf = requestAnimationFrame(() => {
        self._raf = null
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight || 1
        const p = Math.min(1, Math.max(0, window.scrollY / max))
        const vh = window.innerHeight
        const containerLeft = window.innerWidth - 26 - 70
        // gutter path target
        const gutterX = 12 + Math.sin(p * Math.PI * 6) * 16
        const gutterY = 40 + p * (vh - 120)
        // origin (emerging from the Optimized Iceberg Tables node)
        const originX = (self._originDocX ?? containerLeft) - containerLeft - 17
        const originY = (self._originDocY ?? 60) - window.scrollY - 17
        // blend from origin to gutter over first 12% of scroll
        let b = Math.min(1, p / 0.12)
        b = b * b * (3 - 2 * b)
        const x = originX + (gutterX - originX) * b
        const y = originY + (gutterY - originY) * b
        self._base.x = x
        self._base.y = y
        self._render()
      })
    }
    window.addEventListener('scroll', self._onScroll, { passive: true })
    self._hoisted_resize_0 = () => {
      self._measureOrigin()
      self._onScroll()
    }
    window.addEventListener('resize', self._hoisted_resize_0, { passive: true })
    self._measureOrigin()
    self._onScroll()

    // Playful dodge: the packet flees the cursor so it can never be clicked
    self._onMouseMove = (e) => {
      const el = document.getElementById('scroll-packet')
      if (!el || getComputedStyle(el.parentElement).display === 'none') return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = cx - e.clientX
      const dy = cy - e.clientY
      const dist = Math.hypot(dx, dy) || 1
      const R = 130
      if (dist < R) {
        const push = (R - dist) * 1.4
        self._dodgeTarget.x = Math.max(-150, Math.min(150, (dx / dist) * push))
        self._dodgeTarget.y = Math.max(-200, Math.min(200, (dy / dist) * push))
      }
    }
    window.addEventListener('mousemove', self._onMouseMove, { passive: true })

    // Single smoothing loop: ease applied dodge toward target, drift target home
    self._dodgeTick = () => {
      self._dodgeTarget.x *= 0.92
      self._dodgeTarget.y *= 0.92
      self._dodge.x += (self._dodgeTarget.x - self._dodge.x) * 0.18
      self._dodge.y += (self._dodgeTarget.y - self._dodge.y) * 0.18
      if (Math.abs(self._dodge.x) < 0.3) self._dodge.x = 0
      if (Math.abs(self._dodge.y) < 0.3) self._dodge.y = 0
      self._render()
      self._decayRaf = requestAnimationFrame(self._dodgeTick)
    }
    self._dodgeTick()

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
      if (self._onScroll) window.removeEventListener('scroll', self._onScroll)
      if (self._onMouseMove) window.removeEventListener('mousemove', self._onMouseMove)
      if (self._decayRaf) cancelAnimationFrame(self._decayRaf)

      window.removeEventListener('resize', self._hoisted_resize_0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return renderVals()
}
