import { usePluginData } from '@docusaurus/useGlobalData'
import { useEffect, useState } from 'react'
import { IGlobalData } from '@site/src/types/download'

const useGetReleases = () => {
  // Attempt to fetch plugin data, fallback to undefined if not available.
  const pluginData = usePluginData('fetch-databend-releases') as IGlobalData | undefined

  // Use fallback defaults if pluginData is missing
  const releasesList = pluginData?.releasesList || []
  const repoResource = pluginData?.repoResource || null
  const initialStargazersCount = pluginData?.stargazersCount || 0
  const bendsqlRecource = pluginData?.bendsqlRecource || null

  const [stargazersCount, setStargazersCount] = useState<number>(initialStargazersCount)
  const slackCount = 500

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/datazip-inc/olake')
        if (response.ok) {
          const data = await response.json()
          setStargazersCount(data.stargazers_count)
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stars:', error)
      }
    }

    fetchStarCount()
  }, [])

  // Use a fallback name; you can update this if needed
  const name = releasesList.length > 0 ? releasesList[0].name : 'latest'

  return {
    releasesList,
    tagName: name,
    name,
    repoResource,
    stargazersCount,
    slackCount,
    bendsqlRecource
  }
}

export default useGetReleases
