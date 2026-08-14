import { usePluginData } from '@docusaurus/useGlobalData'
import { useEffect, useState } from 'react'
import { IGlobalData } from '@site/src/types/download'

const STARS_API_URL = 'https://api.github.com/repos/datazip-inc/olake'
const STARS_CACHE_KEY = 'olake:gh-stars'
const STARS_TTL_MS = 24 * 60 * 60 * 1000

let starsRequest: Promise<number | null> | null = null

const readStoredStars = (): { value: number; at: number } | null => {
  try {
    const raw = window.localStorage.getItem(STARS_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null // private mode, storage disabled, or corrupt entry
  }
}

const readCachedStars = (): number | null => {
  const stored = readStoredStars()
  return stored && Date.now() - stored.at < STARS_TTL_MS ? stored.value : null
}

const fetchStars = (): Promise<number | null> => {
  if (starsRequest) return starsRequest
  starsRequest = fetch(STARS_API_URL)
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      const value: number | null = data?.stargazers_count ?? null
      if (value) {
        try {
          window.localStorage.setItem(STARS_CACHE_KEY, JSON.stringify({ value, at: Date.now() }))
        } catch {
          /* private mode or storage disabled — just skip caching */
        }
      }
      return value
    })
    .catch(() => null) // offline or rate-limited: fall back to the stale value
  return starsRequest
}

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
    let alive = true
    const cached = readCachedStars()
    if (cached) {
      setStargazersCount(cached)
      return
    }
    // Expired: show the stale count rather than a dash while refreshing.
    const stale = readStoredStars()
    if (stale?.value) setStargazersCount(stale.value)

    fetchStars().then((value) => {
      if (alive && value) setStargazersCount(value)
    })
    return () => {
      alive = false
    }
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
