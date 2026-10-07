import { useEffect, useState, type RefObject } from 'react'

export interface DiagramLink {
  d: string
  /** Seconds before the travelling dot starts, so the dots do not move in lockstep. */
  begin: number
  side: 'in' | 'out'
}

export interface DiagramLinks {
  width: number
  height: number
  links: DiagramLink[]
  /** False when the visitor prefers reduced motion: the lines stay, the dots do not travel. */
  animate: boolean
}

/**
 * Measures the source chips, the OLake Go node and the destination chips (found by `data-src` and
 * `data-dest`) and returns the bezier paths that join them. It runs after mount only, so the first
 * render matches the server's. On narrow screens the diagram stacks and no links are returned.
 */
export function useDiagramLinks(
  containerRef: RefObject<HTMLElement | null>,
  nodeRef: RefObject<HTMLElement | null>
): DiagramLinks | null {
  const [state, setState] = useState<DiagramLinks | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const node = nodeRef.current
    if (!container || !node) return

    const measure = () => {
      const srcs = Array.from(container.querySelectorAll<HTMLElement>('[data-src]'))
      const dests = Array.from(container.querySelectorAll<HTMLElement>('[data-dest]'))
      const c = container.getBoundingClientRect()
      const n = node.getBoundingClientRect()
      // Stacked layout (mobile): the first source is not to the left of the node.
      if (!srcs.length || !dests.length || srcs[0].getBoundingClientRect().right > n.left + 4) {
        setState(null)
        return
      }
      const nodeL = { x: n.left - c.left + 10, y: n.top - c.top + n.height / 2 }
      const nodeR = { x: n.right - c.left - 10, y: n.top - c.top + n.height / 2 }
      const links: DiagramLink[] = []
      srcs.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const p = { x: r.right - c.left - 8, y: r.top - c.top + r.height / 2 }
        const dx = Math.max(28, (nodeL.x - p.x) * 0.5)
        links.push({
          side: 'in',
          begin: i * 0.28,
          d: `M${p.x},${p.y} C${p.x + dx},${p.y} ${nodeL.x - dx},${nodeL.y} ${nodeL.x},${nodeL.y}`
        })
      })
      dests.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const p = { x: r.left - c.left + 8, y: r.top - c.top + r.height / 2 }
        const dx = Math.max(28, (p.x - nodeR.x) * 0.5)
        links.push({
          side: 'out',
          begin: 0.6 + i * 0.6,
          d: `M${nodeR.x},${nodeR.y} C${nodeR.x + dx},${nodeR.y} ${p.x - dx},${p.y} ${p.x},${p.y}`
        })
      })
      setState({
        width: c.width,
        height: c.height,
        links,
        animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [containerRef, nodeRef])

  return state
}
