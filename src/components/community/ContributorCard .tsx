import React from 'react'
import { Card } from '../../components/ui/card'
import { CircularProgress } from '../../components/ui/CircularProgress'

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

  // Calculate the circle properties
  const radius = size / 2
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2)
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <Card className='flex flex-col items-center p-4 transition-transform hover:scale-105 hover:shadow-xl'>
      {/* <a href={contributor.html_url} target='_blank' rel='noopener noreferrer'> */}
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
      <p className='text-sm text-gray-600'>{contributor.contributions} contributions</p>
      {/* </a> */}
    </Card>
  )
}

export default ContributorCard
