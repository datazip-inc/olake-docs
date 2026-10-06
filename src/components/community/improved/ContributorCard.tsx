// src/components/community/improved/ContributorCard.tsx
import React, { useState } from 'react'
import { cn } from '@site/src/lib/utils'
import contributorPoints from '../../../data/contributor-points.json'

export interface ContributorProps {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

interface PR {
  title: string
  html_url: string
  number: number
}

const SIZE = 96
const STROKE = 4
const RADIUS = SIZE / 2 - STROKE / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Avatar inside a points ring; hovering (or focusing) the card lists the contributor's recent PRs. */
export const ImprovedContributorCard: React.FC<{ contributor: ContributorProps }> = ({
  contributor
}) => {
  const [imageError, setImageError] = useState(false)
  const [prs, setPrs] = useState<PR[]>([])
  const [showPRs, setShowPRs] = useState(false)
  const [loadingPRs, setLoadingPRs] = useState(false)

  // Get points from JSON file, fallback to contributions count
  const points =
    contributorPoints.contributors[contributor.login]?.points || contributor.contributions
  const maxPoints = 100
  const percentage = Math.min((points / maxPoints) * 100, 100)
  const dashOffset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE

  const fetchPRs = async () => {
    if (prs.length > 0 || loadingPRs) return

    setLoadingPRs(true)
    try {
      const response = await fetch(
        `https://api.github.com/search/issues?q=is:pr+repo:datazip-inc/olake+author:${contributor.login}&per_page=5`
      )
      const data = await response.json()
      setPrs(data.items || [])
    } catch (error) {
      console.error('Error fetching PRs:', error)
    } finally {
      setLoadingPRs(false)
    }
  }

  const open = () => {
    setShowPRs(true)
    fetchPRs()
  }

  return (
    <div
      className='relative flex h-full flex-col items-center rounded-[16px] border border-solid border-olake-line bg-olake-surface px-[20px] py-[24px] text-center transition-colors hover:border-olake-line-strong'
      onMouseEnter={open}
      onMouseLeave={() => setShowPRs(false)}
      onFocus={open}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setShowPRs(false)
      }}
    >
      <div className='relative' style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden='true'>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill='none'
            strokeWidth={STROKE}
            className='stroke-olake-line'
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill='none'
            strokeWidth={STROKE}
            strokeLinecap='round'
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            className='stroke-olake-blue'
          />
        </svg>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div
            className='overflow-hidden rounded-full'
            style={{ width: SIZE - STROKE * 4, height: SIZE - STROKE * 4 }}
          >
            <img
              src={imageError ? '/img/authors/author.webp' : contributor.avatar_url}
              alt={`${contributor.login}'s avatar`}
              width={SIZE - STROKE * 4}
              height={SIZE - STROKE * 4}
              onError={() => setImageError(true)}
              loading='lazy'
              decoding='async'
              className='block h-full w-full object-cover'
            />
          </div>
        </div>
      </div>

      <a
        href={contributor.html_url}
        target='_blank'
        rel='noopener noreferrer'
        className='mt-[14px] max-w-full truncate text-[16px] text-olake-ink transition-colors hover:text-olake-blue'
      >
        @{contributor.login}
      </a>
      <p className='mt-[6px] text-[14px] text-olake-text-2'>
        <span className='text-[20px] text-olake-ink'>{points}</span> points
      </p>
      <p className='mt-[2px] text-[12px] text-olake-muted'>
        {contributor.contributions} PR{contributor.contributions !== 1 ? 's' : ''}
      </p>

      {/* PR popover */}
      {showPRs && (
        <div
          className={cn(
            'absolute bottom-full left-1/2 z-[100] mb-[8px] w-[min(320px,calc(100vw-48px))] -translate-x-1/2 rounded-[12px] border border-solid border-olake-line bg-olake-surface p-[16px] text-left',
            'shadow-[var(--olake-shadow-menu)]'
          )}
        >
          <h4 className='text-[13px] font-medium text-olake-ink'>Recent Pull Requests</h4>
          {loadingPRs ? (
            <p className='mt-[8px] text-[13px] text-olake-muted'>Loading...</p>
          ) : prs.length > 0 ? (
            <ul className='mt-[8px] flex flex-col gap-[8px]'>
              {prs.map((pr) => (
                <li key={pr.number}>
                  <a
                    href={pr.html_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block truncate text-[13px] text-olake-blue hover:text-olake-blue-hover'
                  >
                    #{pr.number} - {pr.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className='mt-[8px] text-[13px] text-olake-muted'>No PRs found</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ImprovedContributorCard
