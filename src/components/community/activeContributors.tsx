import React, { useEffect, useState } from 'react'
import SectionLayout from './SectionLayout'
import ContributorCard from '../ContributorCard'
import Link from '@docusaurus/Link'
interface Contributor {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}
const ActiveContributors = () => {
  const excludedContributors = ['zriyanshdz', 'hash-data', 'piyushsingariya', 'piyushdatazip', 'shubham19may', 'vikash390', 'vaibhav-datazip', 'vishalm0509', 'schitizsharma', 'ImDoubD-datazip', 'rkhameshra', 'tanishaAtDatazip'] //add Contributors
   const [contributors, setContributors] = useState<Contributor[]>([])
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
    const filteredContributors = contributors.filter(
      (contributor) => !excludedContributors.includes(contributor.login)
    )
  return (
    <SectionLayout className='items-center justify-center text-center'>
      <div className='flex flex-col items-center justify-center space-y-6 text-center'>
        <h1 className='mb-8 text-[36px] font-bold md:text-[42px]'>
          Check out our <span className='text-blue-500'>active contributors</span>
        </h1>
        <h6  className='text-[20px]'>New connectors, ideas, bug fixes, docs, articles, join the movement!</h6>
        {!loading && !error && (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {filteredContributors.slice(0,4).map((contributor) => (
                <ContributorCard key={contributor.id} contributor={contributor} />
              ))}
            </div>
          )}
          <Link legacyBehavior href={"/community/contributors"} className='p-4 bg-blue-600 w-fit text-center  rounded-full text-white text-[20px]'>See All Contributors</Link>

      </div> 
    </SectionLayout>
  )
}

export default ActiveContributors
