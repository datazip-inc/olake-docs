// src/components/community/improved/ActiveContributors.tsx
import React, { useEffect, useState } from 'react'
import Link from '@docusaurus/Link'
import { FaGithub, FaArrowRight } from 'react-icons/fa'
import SectionLayout from '../SectionLayout'
// import { ImprovedContributorCard, ContributorProps } from './components/ContributorCard'

import ImprovedContributorCard from '../../../components/community/improved/ContributorCard'
import ContributorProps from '../../../components/ContributorCard'

// import { Button, SectionHeader } from './components'

import Button from '../../../components/community/improved/Button'
import PageHeader from '../../../components/community/improved/PageHeader'
import SectionHeader from '../../../components/community/improved/SectionHeader'

import contributorPoints from '../../../data/contributor-points.json'


const ActiveContributors = () => {
  const excludedContributors = ['zriyanshdz', 'hash-data', 'piyushsingariya', 'piyushdatazip', 'shubham19may', 'vikash390', 'vaibhav-datazip', 'vishalm0509', 'schitizsharma', 'ImDoubD-datazip', 'rkhameshra', 'tanishaAtDatazip']
  const [contributors, setContributors] = useState<ContributorProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://api.github.com/repos/datazip-inc/olake/contributors')

        if (!response.ok) {
          throw new Error(`Error fetching contributors: ${response.status}`)
        }

        const data = await response.json()
        setContributors(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contributors')
        console.error('Error fetching contributors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContributors()
  }, [])

  const filteredContributors = contributors
    .filter((contributor) => !excludedContributors.includes(contributor.login))
    .sort((a, b) => {
      // Sort by points first, then by contributions
      const pointsA = contributorPoints.contributors[a.login]?.points || a.contributions
      const pointsB = contributorPoints.contributors[b.login]?.points || b.contributions
      return pointsB - pointsA
    })

  return (
    <SectionLayout className="py-20">
      <SectionHeader
        title={
          <>
            Check out our{' '}
            <span className="text-[#193ae6] dark:text-blue-400">active contributors</span>
          </>
        }
        subtitle="New connectors, ideas, bug fixes, docs, articles - join the movement!"
      />

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#193ae6]"></div>
        </div>
      )}

      {!loading && !error && filteredContributors.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {filteredContributors.slice(0, 8).map((contributor) => (
              <ImprovedContributorCard key={contributor.id} contributor={contributor} />
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/community/contributors" size="lg">
              See All {filteredContributors.length} Contributors
              <FaArrowRight className="ml-2" />
            </Button>
            <Button 
              href="https://github.com/datazip-inc/olake/graphs/contributors" 
              variant="outline" 
              size="lg"
              external
            >
              <FaGithub className="mr-2" />
              View on GitHub
            </Button>
          </div>
        </>
      )}

      {!loading && !error && filteredContributors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No contributors data available.</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Unable to load contributors at this time.</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Visit our{' '}
            <Link 
              to="https://github.com/datazip-inc/olake/graphs/contributors"
              className="text-[#193ae6] dark:text-blue-400 hover:underline"
            >
              GitHub page
            </Link>{' '}
            to see all contributors.
          </p>
        </div>
      )}
    </SectionLayout>
  )
}

export default ActiveContributors