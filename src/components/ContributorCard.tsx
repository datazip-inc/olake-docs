import React from 'react'
import { Card } from './ui/card'
import { CircularProgress } from './ui/CircularProgress'
import { useState } from 'react'
export interface ContributorProps {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

const ContributorCard: React.FC<{ contributor: ContributorProps }> = ({ contributor }) => {
  // Calculate the percentage for the progress bar
  const size = 80
  const strokeWidth = 4
  const progressColor = '#0582f6'
  const maxContributions = 10
  const percentage = Math.min((contributor.contributions / maxContributions) * 100, 100)

  const [prs, setPrs] = useState<string[]>([])
  const [showPRs, setShowPRs] = useState(false)

  const fetchPRs = async () => {
    if (prs.length > 0) return // Avoid refetching
    try {
      const response = await fetch(
        `https://api.github.com/search/issues?q=is:pr+repo:datazip-inc/olake+author:${contributor.login}`
      )
      const data = await response.json()
      const prTitles = data.items?.map((pr: any) => pr.title) || []
      setPrs(prTitles)
    } catch (error) {
      console.error('Error fetching PRs:', error)
    }
  }
  console.log(prs)
  return (
    <Card className='flex flex-col items-center p-4 transition-transform hover:scale-105 hover:shadow-xl'>
      <div className='relative mb-3' style={{ width: size, height: size }}>
        {/* SVG for the circular progress */}
        <CircularProgress
          percentage={percentage}
          size={size}
          strokeWidth={strokeWidth}
          progressColor={progressColor}
          useGradient={true}
          gradientColors={['#0582f6', '#00b3ff']}
        />

        {/* Avatar image */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div
            className='overflow-hidden rounded-full'
            style={{ width: size - strokeWidth * 2, height: size - strokeWidth * 2 }}
          >
            <img
              src={contributor.avatar_url || '/placeholder.svg'}
              alt={`${contributor.login}'s avatar`}
              width={size - strokeWidth * 2}
              height={size - strokeWidth * 2}
              className='object-cover'
            />
          </div>
        </div>
      </div>
      <a
        href={contributor.html_url}
        target='_blank'
        rel='noopener noreferrer'
        className='text-lg font-semibold'
      >
        {contributor.login}
      </a>
      <p
        className='text-sm text-gray-600'
        onMouseEnter={() => {
          setShowPRs(true)
          fetchPRs()
        }}
        onMouseLeave={() => setShowPRs(false)}
      >
        {contributor.contributions}{' '}
        {contributor.contributions === 1 ? 'contribution' : 'contributions'}
      </p>
      {showPRs && prs.length > 0 && (
        <div className='z-1000 absolute top-40 mb-2 w-64 rounded-lg p-3 text-sm shadow-lg'>
          <h4 className='mb-2 font-bold'>Pull Requests</h4>
          <ul className='list-disc pl-4'>
            {prs.slice(0, 5).map((pr, index) => (
              <li key={index} className='truncate'>
                {pr}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}

export default ContributorCard
