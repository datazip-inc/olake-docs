import React, { useState } from 'react'
import { Card } from './ui/card'
import { AvatarWithProgress } from './avatar-with-progress'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'

export interface ContributorProps {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

const ContributorCard: React.FC<{ contributor: ContributorProps }> = ({ contributor }) => {
  // State
  const [prs, setPrs] = useState<string[]>([])
  const [showPRs, setShowPRs] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // Constants
  const maxContributions = 10
  const percentage = Math.min((contributor.contributions / maxContributions) * 100, 100)

  // Handlers
  const handleMouseEnter = () => {
    setShowPRs(true)
    fetchPRs()
  }

  const handleMouseLeave = () => {
    setShowPRs(false)
  }

  // API calls
  const fetchPRs = async () => {
    if (prs.length > 0) return // Avoid refetching
    setIsLoading(true)
    try {
      const response = await fetch(
        `https://api.github.com/search/issues?q=is:pr+repo:datazip-inc/olake+author:${contributor.login}`
      )
      const data = await response.json()
      const prTitles = data.items?.map((pr: any) => pr.title) || []
      setPrs(prTitles)
    } catch (error) {
      console.error('Error fetching PRs:', error)
    }finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='flex flex-col items-center p-4 transition-transform hover:scale-105 hover:shadow-xl'>
      <AvatarWithProgress
        percentage={percentage}
        size={100}
        strokeWidth={6}
        useGradient={true}
        gradientColors={['#0582f6', '#00b3ff']}
        avatarUrl={contributor.avatar_url || '/placeholder.svg'}
        altText={`${contributor.login}'s avatar`}
      />

      <a
        href={contributor.html_url}
        target='_blank'
        rel='noopener noreferrer'
        className='text-lg font-semibold'
      >
        {contributor.login}
      </a>

      <DropdownMenu open={showPRs}>
        <DropdownMenuTrigger asChild>
          <p
            className='text-sm text-gray-600'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {contributor.contributions}{' '}
            {contributor.contributions === 1 ? 'contribution' : 'contributions'}
          </p>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-48"  
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        > <Card>
           <h4 className='mb-2 font-bold'>Pull Requests</h4>
           <ul className='list-disc pl-4'>
          {isLoading ? (
            <li className="text-gray-500">Loading PRs...</li>
          ) : (
            prs.slice(0, 5).map((pr, index) => (
              <li key={index} className='truncate'>
                {pr}
              </li>
            ))
          )}
        </ul></Card>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  )
}

export default ContributorCard