
// src/components/community/improved/ContributorCard.tsx
import React, { useState } from 'react'
import { Card } from '../../ui/card'
import { CircularProgress } from '../../ui/CircularProgress'
import clsx from 'clsx'
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

export const ImprovedContributorCard: React.FC<{ contributor: ContributorProps }> = ({
  contributor
}) => {
  const [imageError, setImageError] = useState(false)
  const [prs, setPrs] = useState<PR[]>([])
  const [showPRs, setShowPRs] = useState(false)
  const [loadingPRs, setLoadingPRs] = useState(false)

  const size = 100
  const strokeWidth = 4

  // Get points from JSON file, fallback to contributions count
  const points = contributorPoints.contributors[contributor.login]?.points || contributor.contributions
  const maxPoints = 100
  const percentage = Math.min((points / maxPoints) * 100, 100)

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

  return (
    <Card
      className={clsx(
        'group relative flex flex-col items-center p-6 space-y-4',
        'transition-all duration-300 hover:shadow-2xl hover:-translate-y-2',
        'bg-white dark:bg-gray-800 overflow-visible'
      )}
      onMouseEnter={() => {
        setShowPRs(true)
        fetchPRs()
      }}
      onMouseLeave={() => setShowPRs(false)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <CircularProgress
          percentage={percentage}
          size={size}
          strokeWidth={strokeWidth}
          progressColor="#193ae6"
          useGradient={true}
          gradientColors={['#193ae6', '#607bff']}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="overflow-hidden rounded-full ring-4 ring-white dark:ring-gray-800 transition-transform duration-300 group-hover:scale-105"
            style={{ width: size - strokeWidth * 2, height: size - strokeWidth * 2 }}
          >
            <img
              src={imageError ? '/img/authors/author.webp' : contributor.avatar_url}
              alt={`${contributor.login}'s avatar`}
              onError={() => setImageError(true)}
              loading="lazy" decoding="async"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <a
          href={contributor.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-[#193ae6] dark:hover:text-blue-400 transition-colors"
        >
          @{contributor.login}
        </a>
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#193ae6] dark:text-blue-400">
              {points}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              points
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {contributor.contributions} PR{contributor.contributions !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* PR Tooltip */}
      {showPRs && (
        <div
          className={clsx(
            'absolute z-[100] w-80 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-2xl',
            'border border-gray-200 dark:border-gray-700',
            'left-1/2 transform -translate-x-1/2 bottom-full mb-2',  // Changed from 'top-full mt-2'
            'transition-opacity duration-200',
            showPRs ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          style={{
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',  // Stronger shadow
            minWidth: '320px'  // Ensure minimum width
          }}
        >
          <h4 className="font-bold text-sm mb-2 text-gray-900 dark:text-gray-100">
            Recent Pull Requests
          </h4>
          {loadingPRs ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
          ) : prs.length > 0 ? (
            <ul className="space-y-2">
              {prs.map((pr) => (
                <li key={pr.number}>
                  <a
                    href={pr.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#193ae6] dark:text-blue-400 hover:underline block truncate"
                  >
                    #{pr.number} - {pr.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">No PRs found</div>
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  )
}

export default ImprovedContributorCard