import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import styles from './Quiz.module.css'

/**
 * OLake blog Quiz: built on the idea of the Vaquill knowledge-check Quiz, extended with a
 * "find your fit" recommender.
 *
 * Two modes, one component, data lives in JSON (so it can be validated by tools/quiz_check.py):
 *
 *  mode "knowledge"  questions: { q, options: string[], correct, explain }[]
 *      Scored check. A pick locks the question, marks right/wrong, shows the explanation.
 *
 *  mode "recommend"  questions: { q, hint?, options: { label, scores?, exclude?, why? }[] }[]
 *                    results:   { [id]: { name, summary, bestWhen, watchOut, href? } }
 *      No right answers. Each option adds points to tools and/or rules tools out. The result
 *      lists the best fits with a fit meter, the answers that drove each one, the tool's
 *      honest watch-out, and the tools your answers ruled out (with the reason).
 *
 * Usage in MDX (register <Quiz/> globally like <Faq/>, or import it):
 *   import quiz from '@site/src/data/quizzes/airbyte-alternatives.json'
 *   <Quiz {...quiz} />
 *
 * Accessibility: radio-group semantics, arrow/number-key navigation, aria-live feedback,
 * reduced-motion safe, no colour-only signals (icons + text). Styling reads the site's
 * --olake-* design tokens with safe fallbacks. No tracking: the component only dispatches a
 * `olake:quiz` DOM event ({ id, event, result }) that the host site may listen to.
 */

export interface KnowledgeQuestion {
  q: string
  options: string[]
  correct: number
  explain?: string
}

export interface RecommendOption {
  label: string
  /** points added to tools, e.g. { airbyte: 2, estuary: 1 } */
  scores?: Record<string, number>
  /** tools this answer rules out (a hard constraint), e.g. ["fivetran"] */
  exclude?: string[]
  /** short reason shown if this answer drives a result or rules a tool out */
  why?: string
}

export interface RecommendQuestion {
  q: string
  hint?: string
  options: RecommendOption[]
}

export interface RecommendResult {
  name: string
  summary: string
  bestWhen?: string
  watchOut?: string
  href?: string
}

export interface QuizProps {
  id?: string
  mode?: 'knowledge' | 'recommend'
  title?: string
  eyebrow?: string
  /** "October 2026": shown in the recommender disclaimer */
  updated?: string
  questions: Array<KnowledgeQuestion | RecommendQuestion>
  results?: Record<string, RecommendResult>
  /** how many fits to show (recommend mode) */
  topN?: number
  /** optional link under the result, e.g. the post's comparison table */
  guideHref?: string
  guideLabel?: string
}

const LETTERS = 'ABCDEFGH'

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(m.matches)
    const on = () => setReduced(m.matches)
    m.addEventListener?.('change', on)
    return () => m.removeEventListener?.('change', on)
  }, [])
  return reduced
}

function emit(id: string | undefined, event: string, result?: string) {
  if (typeof window === 'undefined') return
  try {
    window.dispatchEvent(new CustomEvent('olake:quiz', { detail: { id, event, result } }))
  } catch {
    /* older browsers: ignore */
  }
}

interface FitRow {
  id: string
  points: number
  pct: number
  reasons: string[]
}

function computeFits(
  questions: RecommendQuestion[],
  picks: Array<number | null>,
  results: Record<string, RecommendResult>,
) {
  const ids = Object.keys(results)
  const points: Record<string, number> = Object.fromEntries(ids.map((i) => [i, 0]))
  const reasons: Record<string, Array<{ pts: number; text: string }>> = Object.fromEntries(ids.map((i) => [i, []]))
  const ruledOut: Record<string, string> = {}
  let maxPossible: Record<string, number> = Object.fromEntries(ids.map((i) => [i, 0]))

  questions.forEach((qq, qi) => {
    // upper bound for normalisation: the best score any option gives each tool on this question
    ids.forEach((id) => {
      maxPossible[id] += Math.max(0, ...qq.options.map((o) => o.scores?.[id] ?? 0))
    })
    const p = picks[qi]
    if (p === null || p === undefined) return
    const opt = qq.options[p]
    Object.entries(opt.scores ?? {}).forEach(([id, pts]) => {
      if (!(id in points)) return
      points[id] += pts
      if (pts > 0) reasons[id].push({ pts, text: opt.why || opt.label })
    })
    ;(opt.exclude ?? []).forEach((id) => {
      if (id in points && !ruledOut[id]) ruledOut[id] = opt.why || opt.label
    })
  })

  const rows: FitRow[] = ids
    .filter((id) => !(id in ruledOut))
    .map((id) => ({
      id,
      points: points[id],
      pct: maxPossible[id] > 0 ? Math.round((100 * points[id]) / maxPossible[id]) : 0,
      reasons: reasons[id].sort((a, b) => b.pts - a.pts).slice(0, 3).map((r) => r.text),
    }))
    .sort((a, b) => b.points - a.points || b.pct - a.pct || a.id.localeCompare(b.id))
  return { rows, ruledOut }
}

export default function Quiz(props: QuizProps) {
  const { id, mode = 'knowledge', title, eyebrow, updated, questions, results, topN = 3, guideHref, guideLabel } = props
  const uid = useId()
  const reduced = useReducedMotion()
  const total = questions.length
  const isRecommend = mode === 'recommend'

  const [current, setCurrent] = useState(0)
  const [picks, setPicks] = useState<Array<number | null>>(() => questions.map(() => null))
  const [focusIdx, setFocusIdx] = useState(0)
  const [finished, setFinished] = useState(false)
  const started = useRef(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])

  const q = questions[current]
  const picked = picks[current]
  const answered = picked !== null
  const options: Array<string | RecommendOption> = q.options as Array<string | RecommendOption>
  const labelOf = (o: string | RecommendOption) => (typeof o === 'string' ? o : o.label)

  const correctCount = useMemo(
    () =>
      isRecommend
        ? 0
        : picks.reduce<number>((n, p, i) => (p !== null && p === (questions[i] as KnowledgeQuestion).correct ? n + 1 : n), 0),
    [picks, questions, isRecommend],
  )
  const fits = useMemo(
    () => (isRecommend && results ? computeFits(questions as RecommendQuestion[], picks, results) : null),
    [isRecommend, results, questions, picks],
  )

  useEffect(() => {
    optionRefs.current[focusIdx]?.focus({ preventScroll: true })
  }, [current]) // eslint-disable-line react-hooks/exhaustive-deps

  const choose = useCallback(
    (i: number) => {
      if (!isRecommend && answered) return
      if (!started.current) {
        started.current = true
        emit(id, 'start')
      }
      setPicks((p) => p.map((v, k) => (k === current ? i : v)))
      setFocusIdx(i)
    },
    [answered, current, id, isRecommend],
  )

  const next = useCallback(() => {
    if (current < total - 1) {
      setCurrent(current + 1)
      setFocusIdx(picks[current + 1] ?? 0)
    } else {
      setFinished(true)
      const top = isRecommend && fits?.rows[0] ? fits.rows[0].id : undefined
      emit(id, 'complete', isRecommend ? top : String(correctCount))
      requestAnimationFrame(() => headingRef.current?.focus())
    }
  }, [current, total, picks, isRecommend, fits, id, correctCount])

  const back = () => {
    if (current > 0) {
      setCurrent(current - 1)
      setFocusIdx(picks[current - 1] ?? 0)
    }
  }
  const restart = () => {
    setPicks(questions.map(() => null))
    setCurrent(0)
    setFocusIdx(0)
    setFinished(false)
    started.current = false
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = options.length
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      const k = (focusIdx + 1) % n
      setFocusIdx(k)
      optionRefs.current[k]?.focus()
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const k = (focusIdx - 1 + n) % n
      setFocusIdx(k)
      optionRefs.current[k]?.focus()
    } else if (/^[1-9]$/.test(e.key) && Number(e.key) <= n) {
      e.preventDefault()
      choose(Number(e.key) - 1)
    }
  }

  const cls = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(' ')
  const rootClass = cls(styles.root, reduced && styles.reduced)

  // ---------------- result screens ----------------
  if (finished) {
    if (isRecommend && fits && results) {
      const shown = fits.rows.slice(0, topN)
      const ruled = Object.entries(fits.ruledOut)
      const allZero = shown.every((r) => r.points === 0)
      return (
        <section className={rootClass} aria-labelledby={`${uid}-h`}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h3 id={`${uid}-h`} className={styles.title} tabIndex={-1} ref={headingRef}>
            {allZero ? 'No clear winner from those answers' : 'Your best fits'}
          </h3>
          <ol className={styles.fitList}>
            {shown.map((r, idx) => {
              const res = results[r.id]
              return (
                <li key={r.id} className={cls(styles.fit, idx === 0 && !allZero && styles.fitTop)}>
                  <div className={styles.fitHead}>
                    <span className={styles.rank}>{idx + 1}</span>
                    <span className={styles.fitName}>
                      {res.href ? <a href={res.href}>{res.name}</a> : res.name}
                    </span>
                    <span className={styles.fitPct} aria-label={`Fit ${r.pct} percent`}>
                      {r.pct}%
                    </span>
                  </div>
                  <div className={styles.meter} aria-hidden="true">
                    <span style={{ width: `${Math.max(4, r.pct)}%` }} />
                  </div>
                  <p className={styles.fitSummary}>{res.summary}</p>
                  {r.reasons.length > 0 && (
                    <p className={styles.fitWhy}>
                      <strong>Why it came up:</strong> {r.reasons.join('; ')}.
                    </p>
                  )}
                  {res.bestWhen && (
                    <p className={styles.fitWhy}>
                      <strong>Fits when:</strong> {res.bestWhen}
                    </p>
                  )}
                  {res.watchOut && (
                    <p className={styles.fitWatch}>
                      <strong>{/^OLake/.test(res.name) ? 'Good to know' : 'Watch out'}:</strong> {res.watchOut}
                    </p>
                  )}
                </li>
              )
            })}
          </ol>
          {ruled.length > 0 && (
            <div className={styles.ruled}>
              <strong>Ruled out by your answers</strong>
              <ul>
                {ruled.map(([rid, why]) => (
                  <li key={rid}>
                    {results[rid]?.name ?? rid}: {why}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className={styles.note}>
            Based on each vendor&apos;s published facts{updated ? ` as of ${updated}` : ''}. It is a starting point, not a
            verdict. Check the sections above before you decide.
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.ghost} onClick={restart}>
              Retake
            </button>
            {guideHref && (
              <a className={styles.primaryLink} href={guideHref}>
                {guideLabel || 'Read the full comparison'}
              </a>
            )}
          </div>
        </section>
      )
    }
    const label =
      correctCount === total
        ? 'Perfect score.'
        : correctCount >= Math.ceil(total * 0.6)
          ? 'Solid. A few details to revisit.'
          : 'Worth a re-read of the sections above.'
    return (
      <section className={rootClass} aria-labelledby={`${uid}-h`}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h3 id={`${uid}-h`} className={styles.title} tabIndex={-1} ref={headingRef}>
          You got {correctCount} of {total}
        </h3>
        <p className={styles.fitSummary}>{label}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.ghost} onClick={restart}>
            Retake
          </button>
          {guideHref && (
            <a className={styles.primaryLink} href={guideHref}>
              {guideLabel || 'Read the full guide'}
            </a>
          )}
        </div>
      </section>
    )
  }

  // ---------------- question screen ----------------
  const kq = !isRecommend ? (q as KnowledgeQuestion) : null
  const isRight = kq && picked !== null && picked === kq.correct
  return (
    <section className={rootClass} aria-labelledby={`${uid}-h`}>
      {(eyebrow || title) && (
        <header>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          {title && (
            <h3 id={`${uid}-h`} className={styles.title} ref={headingRef} tabIndex={-1}>
              {title}
            </h3>
          )}
        </header>
      )}
      <div className={styles.progress} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current + 1} aria-label="Quiz progress">
        <span style={{ width: `${((current + (answered ? 1 : 0)) / total) * 100}%` }} />
      </div>
      <p className={styles.count}>
        Question {current + 1} of {total}
      </p>
      <p id={`${uid}-q`} className={styles.question}>
        {q.q}
      </p>
      {isRecommend && (q as RecommendQuestion).hint && <p className={styles.hint}>{(q as RecommendQuestion).hint}</p>}

      <div role="radiogroup" aria-labelledby={`${uid}-q`} className={styles.options} onKeyDown={onKeyDown}>
        {options.map((o, i) => {
          const isCorrect = kq && i === kq.correct
          const isPicked = i === picked
          const state =
            kq && answered
              ? isCorrect
                ? styles.right
                : isPicked
                  ? styles.wrong
                  : styles.dim
              : isPicked
                ? styles.selected
                : ''
          return (
            <button
              key={i}
              ref={(el) => {
                optionRefs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={isPicked}
              disabled={!isRecommend && answered}
              tabIndex={i === focusIdx ? 0 : -1}
              onClick={() => choose(i)}
              onFocus={() => setFocusIdx(i)}
              className={cls(styles.option, state)}
            >
              <span className={styles.chip} aria-hidden="true">
                {LETTERS[i]}
              </span>
              <span className={styles.optLabel}>{labelOf(o)}</span>
              {kq && answered && isCorrect && <span className={styles.glyph}>Correct</span>}
              {kq && answered && isPicked && !isCorrect && <span className={styles.glyph}>Not this one</span>}
            </button>
          )
        })}
      </div>

      {kq && answered && (
        <div className={styles.feedback} aria-live="polite">
          <p className={isRight ? styles.okText : styles.badText}>
            {isRight ? 'Correct.' : `Not quite. The answer is ${LETTERS[kq.correct]}, "${kq.options[kq.correct]}".`}
          </p>
          {kq.explain && <p className={styles.explain}>{kq.explain}</p>}
        </div>
      )}

      <div className={styles.actions}>
        {current > 0 && (
          <button type="button" className={styles.ghost} onClick={back}>
            Back
          </button>
        )}
        <button type="button" className={styles.primary} onClick={next} disabled={!answered}>
          {current < total - 1 ? 'Next' : isRecommend ? 'See my fit' : 'See score'}
        </button>
      </div>
    </section>
  )
}
