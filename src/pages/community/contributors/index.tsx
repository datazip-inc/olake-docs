import React = require('react')
import Layout from '@theme/Layout'
import { useEffect, useState } from 'react'
import ContributorCard from '../../../components/community/ContributorCard '

interface Contributor {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

const ContributorsPage = () => {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const excludedContributors = ['zriyanshdz', 'hash-data', 'piyushsingariya'] //add Contributors

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
  const filteredContributors = contributors.filter(
    (contributor) => !excludedContributors.includes(contributor.login)
  )

  return (
    <Layout title='OLake Contributors' description='OLake Contributors'>
      <div className='container mx-auto items-center px-12 py-12'>
        <h1 className='mb-8 text-4xl font-bold'>Our contributors</h1>
        <h2 className='mb-8'>Here’s the list of our top contributors!</h2>

        {loading && <p className='py-8 text-center'>Loading contributors...</p>}

        {!loading && !error && (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {filteredContributors.map((contributor) => (
              <ContributorCard key={contributor.id} contributor={contributor} />
            ))}
          </div>
        )}

        {!loading && !error && contributors.length === 0 && (
          <p className='py-8 text-center'>No contributors found.</p>
        )}
      </div>
    </Layout>
  )
}

export default ContributorsPage
