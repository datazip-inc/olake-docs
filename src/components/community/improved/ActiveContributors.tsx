// src/components/community/improved/ActiveContributors.tsx
import React, { useEffect, useState } from 'react'
import { PiArrowRight, PiGithubLogo } from 'react-icons/pi'
import Section from '@site/src/components/landing/ui/Section'
import SectionHeading from '@site/src/components/landing/ui/SectionHeading'
import Button from '@site/src/components/landing/ui/Button'
import ImprovedContributorCard from './ContributorCard'
import type { ContributorProps } from './ContributorCard'
import contributorPoints from '../../../data/contributor-points.json'

const excludedContributors = [
  'zriyanshdz',
  'hash-data',
  'piyushsingariya',
  'piyushdatazip',
  'shubham19may',
  'vikash390',
  'vaibhav-datazip',
  'vishalm0509',
  'schitizsharma',
  'ImDoubD-datazip',
  'rkhameshra',
  'tanishaAtDatazip'
]

/** The eight most active contributors, loaded from GitHub; falls back to a link when the call fails. */
const ActiveContributors = () => {
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
    <Section>
      <SectionHeading
        title='Check out our active contributors'
        body='New connectors, ideas, bug fixes, docs, articles - join the movement!'
        align='center'
      />

      {loading && (
        <div
          className='mt-[28px] h-[260px] animate-pulse rounded-[16px] border border-solid border-olake-line bg-olake-surface-alt lg:mt-[44px]'
          role='status'
          aria-label='Loading contributors'
        />
      )}

      {!loading && !error && filteredContributors.length > 0 && (
        <>
          <ul className='mt-[28px] grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:mt-[44px] lg:grid-cols-4 lg:gap-[16px]'>
            {filteredContributors.slice(0, 8).map((contributor) => (
              <li key={contributor.id}>
                <ImprovedContributorCard contributor={contributor} />
              </li>
            ))}
          </ul>

          <div className='mt-[28px] flex flex-wrap items-center justify-center gap-[8px] lg:mt-[40px] lg:gap-[12px]'>
            <Button href='/community/contributors' size='lg'>
              See All {filteredContributors.length} Contributors
              <PiArrowRight aria-hidden='true' />
            </Button>
            <Button
              href='https://github.com/datazip-inc/olake/graphs/contributors'
              variant='secondary'
              size='lg'
              external
            >
              <PiGithubLogo aria-hidden='true' />
              View on GitHub
            </Button>
          </div>
        </>
      )}

      {!loading && !error && filteredContributors.length === 0 && (
        <p className='mt-[28px] text-center text-[15px] text-olake-text-2 lg:mt-[44px]'>
          No contributors data available.
        </p>
      )}

      {error && (
        <div className='mt-[28px] text-center lg:mt-[44px]'>
          <p className='text-[15px] text-olake-ink'>Unable to load contributors at this time.</p>
          <p className='mt-[8px] text-[14px] text-olake-text-2'>
            Visit our{' '}
            <a
              href='https://github.com/datazip-inc/olake/graphs/contributors'
              target='_blank'
              rel='noopener noreferrer'
              className='text-olake-blue hover:text-olake-blue-hover'
            >
              GitHub page
            </a>{' '}
            to see all contributors.
          </p>
        </div>
      )}
    </Section>
  )
}

export default ActiveContributors
