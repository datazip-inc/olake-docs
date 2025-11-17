// src/pages/community/contributors/index.tsx
import React, { useEffect, useState, useMemo } from 'react'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import {
  FaGithub,
  FaTrophy,
  FaStar,
  FaCodeBranch,
  FaSearch,
  FaFilter,
  FaSync,
  FaSignOutAlt
} from 'react-icons/fa'

import { supabase } from '../../../lib/supabaseClient'

import ImprovedContributorCard from '../../../components/community/improved/ContributorCard'
import type { ContributorProps } from '../../../components/ContributorCard'
import SectionLayout from '../../../components/community/SectionLayout'
import Button from '../../../components/community/improved/Button'
import PageHeader from '../../../components/community/improved/PageHeader'
import SectionHeader from '../../../components/community/improved/SectionHeader'

import clsx from 'clsx'

const stripTrailingSlash = (value?: string) => {
  if (!value) {
    return ''
  }

  return value.endsWith('/') ? value.slice(0, -1) : value
}

const ensureTrailingSlash = (value: string) => {
  if (!value) {
    return '/'
  }

  return value.endsWith('/') ? value : `${value}/`
}
const ContributorsPage = () => {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = stripTrailingSlash(siteConfig?.url || 'https://olake.io')
  const canonicalUrl = ensureTrailingSlash(`${siteUrl}${location.pathname || '/'}`)
  const [contributors, setContributors] = useState<ContributorProps[]>([])
  const [showAllContributors, setShowAllContributors] = useState(false)


  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'points' | 'contributions' | 'name'>('points')

  const excludedContributors = ['zriyanshdz', 'hash-data', 'piyushsingariya', 'piyushdatazip', 'shubham19may', 'vikash390', 'vaibhav-datazip', 'vishalm0509', 'schitizsharma', 'ImDoubD-datazip', 'rkhameshra', 'tanishaAtDatazip']

  // Auth/session + points state
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [githubLogin, setGithubLogin] = useState<string | null>(null)
  const [points, setPoints] = useState<number | null>(null)
  const [breakdown, setBreakdown] = useState<{ goodFirstMergedPRs: number; secondLevelMergedPRs: number; validIssues: number } | null>(null)
  const [syncing, setSyncing] = useState(false)

  // Points leaderboard state
  const [pointsLeaders, setPointsLeaders] = useState<Array<{ github_login: string; github_avatar_url: string; total_points: number; goodFirstPRs: number; secondLevelPRs: number }>>([])
  const [loadingLeaders, setLoadingLeaders] = useState(true)

  // Fetch points leaderboard from GitHub
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        console.log('🔍 Fetching gamification leaderboard from Supabase...')
        
        const userStats = new Map<string, { login: string; avatar: string; goodFirst: number; secondLevel: number }>()
        
        // Fetch from Supabase leaderboard-fetch endpoint (with GitHub token)
        try {
          const leaderboardRes = await fetch('https://kpyasaicyxmosvwuspcx.supabase.co/functions/v1/leaderboard-fetch', {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          const leaderboardData = await leaderboardRes.json()
          console.log('Supabase leaderboard-fetch response:', leaderboardData)
          
          if (leaderboardRes.ok && Array.isArray(leaderboardData)) {
            console.log(`✅ Found ${leaderboardData.length} contributors with points!`)
            
            for (const user of leaderboardData) {
              userStats.set(user.github_login, {
                login: user.github_login,
                avatar: user.github_avatar_url,
                goodFirst: user.goodFirstPRs || 0,
                secondLevel: user.secondLevelPRs || 0
              })
            }
          } else {
            console.error('⚠️ Supabase returned error:', leaderboardData)
          }
        } catch (err) {
          console.error('❌ Error fetching from Supabase:', err)
        }
        
        console.log(`📊 Total users with points: ${userStats.size}`)
        
        // If no data from Supabase, show instructions
        if (userStats.size === 0) {
          console.log('\n📝 No points data available yet!')
          console.log('\n💡 To populate the leaderboard:')
          console.log('1. Deploy the leaderboard-fetch Edge Function:')
          console.log('   cd supabase/functions && supabase functions deploy leaderboard-fetch')
          console.log('2. Make sure GITHUB_TOKEN is added to Supabase Edge Function secrets')
          console.log('3. Reload the page to fetch data from the backend')
        }
        
        // Calculate points and create leaderboard
        const leaders = Array.from(userStats.values())
          .map(user => ({
            github_login: user.login,
            github_avatar_url: user.avatar,
            goodFirstPRs: user.goodFirst,
            secondLevelPRs: user.secondLevel,
            total_points: (user.goodFirst * 5) + (user.secondLevel * 10)
          }))
          .filter(user => user.total_points > 0)
          .sort((a, b) => b.total_points - a.total_points)
        
        setPointsLeaders(leaders)
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err)
      } finally {
        setLoadingLeaders(false)
      }
    }
    void fetchLeaderboard()
  }, [])

  useEffect(() => {
    const init = async () => {
      // Check for OAuth callback hash
      const hash = typeof window !== 'undefined' ? window.location.hash : ''
      if (hash && hash.includes('access_token')) {
        // Wait a bit for Supabase to process the callback
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      const { data, error } = await supabase.auth.getSession()
      console.log('Session check:', { hasSession: !!data.session, error })
      const token = data.session?.access_token || null
      setAccessToken(token)
      if (token) {
        console.log('Fetching user data with token')
        await fetchMe(token)
      }
    }
    void init()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, { hasSession: !!session })
      const token = session?.access_token || null
      setAccessToken(token)
      if (token) {
        void fetchMe(token)
      } else {
        setGithubLogin(null)
        setPoints(null)
        setBreakdown(null)
      }
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const fetchMe = async (token: string) => {
    try {
      console.log('Calling /me endpoint...')
      const res = await fetch('https://kpyasaicyxmosvwuspcx.supabase.co/functions/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('/me response status:', res.status)
      if (!res.ok) {
        const errorText = await res.text()
        console.error('/me error:', errorText)
        return
      }
      const json = await res.json()
      console.log('/me response:', json)
      const githubUser = json?.user?.github_login
      setGithubLogin(githubUser ?? null)
      
      // Fetch points from leaderboard for real-time data
      if (githubUser) {
        console.log('Fetching points from leaderboard for:', githubUser)
        const leaderboardRes = await fetch('https://kpyasaicyxmosvwuspcx.supabase.co/functions/v1/leaderboard-fetch')
        const leaderboard = await leaderboardRes.json()
        
        if (Array.isArray(leaderboard)) {
          const myData = leaderboard.find(u => u.github_login === githubUser)
          if (myData) {
            setPoints(myData.total_points ?? 0)
            setBreakdown({ 
              goodFirstMergedPRs: myData.goodFirstPRs ?? 0, 
              secondLevelMergedPRs: myData.secondLevelPRs ?? 0, 
              validIssues: 0 
            })
            console.log('✅ Your points:', myData.total_points)
          } else {
            setPoints(0)
            setBreakdown({ goodFirstMergedPRs: 0, secondLevelMergedPRs: 0, validIssues: 0 })
            console.log('ℹ️ No points yet')
          }
        }
      }
    } catch (err) {
      console.error('fetchMe error:', err)
    }
  }

  const handleLogin = async () => {
    const redirectUrl = typeof window !== 'undefined' 
      ? window.location.origin + window.location.pathname 
      : 'http://localhost:3001/community/contributors/'
    console.log('Logging in with redirect:', redirectUrl)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { 
        redirectTo: redirectUrl,
        scopes: 'read:user user:email'
      }
    })
    if (error) {
      console.error('Login error:', error)
      alert('Failed to login: ' + error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleRefresh = async () => {
    if (!accessToken) return
    try {
      setSyncing(true)
      const res = await fetch('https://kpyasaicyxmosvwuspcx.supabase.co/functions/v1/points-refresh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.ok) {
        const json = await res.json()
        setPoints(json?.totalPoints ?? null)
        setBreakdown(json?.breakdown ?? null)
      }
    } finally {
      setSyncing(false)
    }
  }

  // Issues Browser state
  type Issue = {
    id: number
    number: number
    title: string
    html_url?: string
    url?: string
    body?: string
    labels?: { name?: string }[]
  }
  const [issuesTab, setIssuesTab] = useState<'good-first' | 'second-level' | 'all'>('good-first')
  const [issuesLoading, setIssuesLoading] = useState(false)
  const [issues, setIssues] = useState<Issue[]>([])

  const currentLabel = issuesTab === 'good-first'
    ? 'good first issue'
    : issuesTab === 'second-level'
      ? 'good second issue'
      : undefined

  const loadIssues = async (label?: string) => {
    try {
      setIssuesLoading(true)
      // Fetch directly from GitHub API
      const query = label 
        ? `repo:datazip-inc/olake is:issue is:open label:"${label}"`
        : 'repo:datazip-inc/olake is:issue is:open'
      const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100`
      const res = await fetch(url)
      const json = await res.json()
      const items = Array.isArray(json?.items) ? json.items : []
      setIssues(items)
    } catch (err) {
      console.error('Error fetching issues:', err)
      setIssues([])
    } finally {
      setIssuesLoading(false)
    }
  }

  useEffect(() => {
    void loadIssues(currentLabel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issuesTab])

  // Fetch all GitHub contributors (simple list for display)
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://api.github.com/repos/datazip-inc/olake/contributors?per_page=100')

        if (!response.ok) {
          throw new Error(`Error fetching contributors: ${response.status}`)
        }

        const data = await response.json()
        console.log(`✅ Found ${data.length} contributors from GitHub`)
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

  const filteredAndSortedContributors = useMemo(() => {
    let filtered = contributors.filter(
      (contributor) => !excludedContributors.includes(contributor.login)
    )

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((contributor) =>
        contributor.login.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort - all sorting now based on GitHub contributions count
    if (sortBy === 'points' || sortBy === 'contributions') {
      filtered.sort((a, b) => b.contributions - a.contributions)
    } else {
      filtered.sort((a, b) => a.login.localeCompare(b.login))
    }

    return filtered
  }, [contributors, searchTerm, sortBy])

  const topContributors = filteredAndSortedContributors.slice(0, 3)
  const otherContributors = filteredAndSortedContributors.slice(3)

  // Hardcoded stats (update manually as needed)
  const contributorStats = {
    totalContributors: '30+',
    totalPRs: '400+',
    openSourceFests: '3+'
  }

  return (
    <Layout 
      title='OLake Contributors' 
      description='Meet the amazing contributors who make OLake possible. Join them in building the future of data lakehouse technology.'
    >
      {/* Top-right login/points - positioned below navbar */}
      <div className="fixed right-4 top-24 z-[100]">
        {!githubLogin ? (
          <Button onClick={handleLogin} size="sm">
            <FaGithub className="mr-2" /> Log in with GitHub
          </Button>
        ) : (
          <div className="flex flex-col gap-2 items-end">
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              {githubLogin} • <span className="text-[#193ae6] dark:text-blue-400">{points ?? 0} pts</span>
            </div>
            <div className="flex gap-2">
              {syncing ? (
                <div className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <FaSync className="animate-spin inline mr-1" /> Syncing...
                </div>
              ) : (
                <Button onClick={handleRefresh} size="sm" variant="outline">
                  <FaSync className="mr-1" /> Refresh
                </Button>
              )}
              <Button onClick={handleLogout} size="sm" variant="outline">
                <FaSignOutAlt className="mr-1" /> Logout
              </Button>
            </div>
          </div>
        )}
      </div>
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='OLake Contributors' />
        <meta property='og:description' content='Meet the amazing contributors who make OLake possible. Join them in building the future of data lakehouse technology.' />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:site_name' content='OLake' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:image' content='https://olake.io/img/logo/olake-blue.webp' />
      </Head>
      {/* Hero Section */}
      <PageHeader
        title={
          <>
            Our Amazing{' '}
            <span className="bg-gradient-to-r from-[#193ae6] to-purple-600 bg-clip-text text-transparent">
              Contributors
            </span>
          </>
        }
        subtitle="Hall of Fame"
        description="Meet the brilliant minds building OLake. Every contribution, big or small, makes a difference."
        cta={
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/community/contributor-program" size="lg">
              <FaStar className="mr-2" /> Become a Contributor
            </Button>
            <Button 
              href="https://github.com/datazip-inc/olake" 
              variant="outline" 
              size="lg"
              external
            >
              <FaGithub className="mr-2" /> View on GitHub
            </Button>
          </div>
        }
      />

      {/* Personal Dashboard (only when logged in) */}
      {githubLogin && points !== null && (
        <SectionLayout className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              title={`Welcome back, ${githubLogin}!`}
              subtitle="Your contribution stats and progress"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="text-3xl font-bold text-[#193ae6] dark:text-blue-400 mb-2">{points}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="text-3xl font-bold text-[#193ae6] dark:text-blue-400 mb-2">
                  {breakdown?.goodFirstMergedPRs ?? 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Good First PRs (+5 each)</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="text-3xl font-bold text-[#193ae6] dark:text-blue-400 mb-2">
                  {breakdown?.secondLevelMergedPRs ?? 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Second-Level PRs (+10 each)</div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress to next tier</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {points < 10 ? `${10 - points} pts to Tier 1` : points < 20 ? `${20 - points} pts to Tier 2` : 'Max tier reached!'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                <div
                  className="bg-gradient-to-r from-[#193ae6] to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${points < 10 ? (points / 10) * 100 : points < 20 ? ((points - 10) / 10) * 100 : 100}%`
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Level: {points < 10 ? 'Beginner' : points < 20 ? 'Intermediate' : 'Advanced'}
              </div>
            </div>
          </div>
        </SectionLayout>
      )}

      {/* Stats Section */}
      <SectionLayout className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#193ae6] dark:text-blue-400 mb-2">
              {contributorStats.totalContributors}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Contributors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#193ae6] dark:text-blue-400 mb-2">
              {contributorStats.totalPRs}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total PRs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#193ae6] dark:text-blue-400 mb-2">
              {contributorStats.openSourceFests}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Open Source Fests</div>
          </div>
        </div>
      </SectionLayout>

      {/* Search and Filter */}
      <SectionLayout className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contributors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#193ae6] dark:focus:ring-blue-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'points' | 'contributions' | 'name')}
                className="w-48 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#193ae6] dark:focus:ring-blue-400"
              >
                <option value="points">Sort by Points</option>
                <option value="contributions">Sort by PRs</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>
      </SectionLayout>

      {/* Points Leaderboard Section - Shows gamification points */}
      <SectionLayout className="py-8">
        <SectionHeader
          title={
            <>
              <FaTrophy className="inline-block text-yellow-500 mr-3" />
              Points Leaderboard
            </>
          }
          subtitle="Top contributors in our gamification program (good first issues & second-level issues)"
        />
        
        {loadingLeaders ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#193ae6]"></div>
          </div>
        ) : pointsLeaders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pointsLeaders.slice(0, 10).map((leader, index) => (
              <div key={leader.github_login} className="relative">
                <div className={clsx(
                  "absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white z-10 shadow-lg",
                  index === 0 && "bg-gradient-to-br from-yellow-400 to-yellow-600",
                  index === 1 && "bg-gradient-to-br from-gray-400 to-gray-600",
                  index === 2 && "bg-gradient-to-br from-orange-400 to-orange-600",
                  index >= 3 && "bg-gradient-to-br from-blue-400 to-blue-600"
                )}>
                  #{index + 1}
                </div>
                <div className="rounded-xl border-2 border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 hover:border-[#193ae6] dark:hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-xl">
                  <div className="flex flex-col items-center gap-4">
                    <img 
                      src={leader.github_avatar_url} 
                      alt={leader.github_login} 
                      className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-600"
                    />
                    <div className="text-center">
                      <a
                        href={`https://github.com/${leader.github_login}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-bold text-gray-900 dark:text-white hover:text-[#193ae6] dark:hover:text-blue-400 transition-colors"
                      >
                        {leader.github_login}
                      </a>
                      <div className="mt-2 text-2xl font-bold text-[#193ae6] dark:text-blue-400">
                        {leader.total_points} pts
                      </div>
                      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {leader.goodFirstPRs > 0 && (
                          <div>✅ {leader.goodFirstPRs} Good First Issue PR{leader.goodFirstPRs > 1 ? 's' : ''} (+{leader.goodFirstPRs * 5} pts)</div>
                        )}
                        {leader.secondLevelPRs > 0 && (
                          <div>🚀 {leader.secondLevelPRs} Second-Level PR{leader.secondLevelPRs > 1 ? 's' : ''} (+{leader.secondLevelPRs * 10} pts)</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No points earned yet! Be the first to complete a "good first issue" or "good second issue" PR.
            </p>
          </div>
        )}
      </SectionLayout>

      {/* Top GitHub Contributors Section - Shows most PRs */}
      {!loading && !error && topContributors.length > 0 && (
        <SectionLayout className="py-8">
          <SectionHeader
            title={
              <>
                <FaCodeBranch className="inline-block text-green-500 mr-3" />
                Top GitHub Contributors
              </>
            }
            subtitle="Most merged pull requests (all contributors, sorted by total PRs)"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {topContributors.map((contributor, index) => (
              <div key={contributor.id} className="relative">
                <div className={clsx(
                  "absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white z-10",
                  index === 0 && "bg-gradient-to-br from-green-400 to-green-600",
                  index === 1 && "bg-gradient-to-br from-teal-400 to-teal-600",
                  index === 2 && "bg-gradient-to-br from-cyan-400 to-cyan-600"
                )}>
                  #{index + 1}
                </div>
                <ImprovedContributorCard contributor={contributor} />
              </div>
            ))}
          </div>
        </SectionLayout>
      )}

      {/* All Contributors Section */}
      <SectionLayout className="py-16">
        <SectionHeader
          title="All Contributors"
          subtitle="Over 30 contributors making OLake better every day"
        />

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#193ae6]"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">Error loading contributors: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && contributors.length > 0 && (
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(showAllContributors ? contributors : contributors.slice(0, 10)).map((contributor, index) => (
                <div 
                  key={contributor.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-2xl font-bold text-gray-400 dark:text-gray-600 w-8">
                        {index + 1}
                      </div>
                      <img 
                        src={contributor.avatar_url} 
                        alt={contributor.login}
                        className="w-16 h-16 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                          {contributor.login}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {contributor.contributions} contributions
                        </div>
                      </div>
                    </div>
                    <a 
                      href={`https://github.com/${contributor.login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border-2 border-[#193ae6] text-[#193ae6] hover:bg-[#193ae6] hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white transition-all text-sm font-medium whitespace-nowrap ml-4"
                    >
                      View Profile →
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {contributors.length > 10 && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={() => setShowAllContributors(!showAllContributors)}
                  variant="outline"
                  size="lg"
                >
                  {showAllContributors ? 'Show Less' : `View More (${contributors.length - 10} more)`}
                </Button>
              </div>
            )}
          </div>
        )}

        {!loading && !error && contributors.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
              No contributors found.
                </p>
              </div>
            )}
      </SectionLayout>

      {/* Rewards & Tiers Section */}
      <SectionLayout className="py-16">
        <SectionHeader
          title="Rewards & Tiers"
          subtitle="Earn exclusive rewards as you contribute"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="rounded-xl border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 hover:border-[#193ae6] dark:hover:border-blue-400 transition-all duration-300">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <FaTrophy className="text-3xl text-[#193ae6] dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Tier 1</h3>
              <div className="text-3xl font-bold text-[#193ae6] dark:text-blue-400 mb-4">10 Points</div>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <FaStar className="mr-2 mt-1 text-[#193ae6] flex-shrink-0" />
                <span>OLake t-shirt</span>
              </li>
              <li className="flex items-start">
                <FaStar className="mr-2 mt-1 text-[#193ae6] flex-shrink-0" />
                <span>Shoutout on social media</span>
              </li>
              <li className="flex items-start">
                <FaStar className="mr-2 mt-1 text-[#193ae6] flex-shrink-0" />
                <span>Mention in community call</span>
              </li>
              <li className="flex items-start">
                <FaStar className="mr-2 mt-1 text-[#193ae6] flex-shrink-0" />
                <span>Priority PR support</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border-2 border-[#193ae6] bg-gradient-to-br from-blue-50 to-purple-50 p-8 dark:border-blue-400 dark:from-gray-800 dark:to-gray-800 transform scale-105 shadow-xl">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#193ae6] to-purple-600 mb-4">
                <FaTrophy className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Tier 2</h3>
              <div className="text-3xl font-bold text-[#193ae6] dark:text-blue-400 mb-4">20 Points</div>
              <div className="inline-block px-3 py-1 rounded-full bg-[#193ae6] text-white text-xs font-semibold mb-4">
                MOST POPULAR
              </div>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <FaStar className="mr-2 mt-1 text-[#193ae6] dark:text-blue-400 flex-shrink-0" />
                <span className="font-semibold">All Tier 1 rewards</span>
              </li>
              <li className="flex items-start">
                <FaStar className="mr-2 mt-1 text-[#193ae6] dark:text-blue-400 flex-shrink-0" />
                <span>OLake jacket</span>
              </li>
              <li className="flex items-start">
                <FaStar className="mr-2 mt-1 text-[#193ae6] dark:text-blue-400 flex-shrink-0" />
                <span>Private Slack channel access</span>
              </li>
              <li className="flex items-start">
                <FaStar className="mr-2 mt-1 text-[#193ae6] dark:text-blue-400 flex-shrink-0" />
                <span>Bounty access (₹5,000–₹10,000)</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 hover:border-[#193ae6] dark:hover:border-blue-400 transition-all duration-300">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4">
                <FaTrophy className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Tier 3</h3>
              <div className="text-3xl font-bold text-[#193ae6] dark:text-blue-400 mb-4">30+ Points</div>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <FaStar className="mr-2 mt-1 text-[#193ae6] flex-shrink-0" />
                <span className="font-semibold">All Tier 2 rewards</span>
              </li>
              <li className="flex items-start">
                <FaStar className="mr-2 mt-1 text-[#193ae6] flex-shrink-0" />
                <span>Early access to features</span>
              </li>
              <li className="flex items-start">
                <FaStar className="mr-2 mt-1 text-[#193ae6] flex-shrink-0" />
                <span>Co-author blog posts</span>
              </li>
              <li className="flex items-start">
                <FaStar className="mr-2 mt-1 text-[#193ae6] flex-shrink-0" />
                <span>Direct line to core team</span>
              </li>
            </ul>
          </div>
        </div>
      </SectionLayout>

      {/* OSS Programs Section */}
      <SectionLayout className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <SectionHeader
          title="Open Source Programs"
          subtitle="Participate in global OSS initiatives with OLake"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-2">Hacktoberfest 2025</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Contribute to OLake during October and earn exclusive Hacktoberfest swag plus OLake rewards!
            </p>
            <Button href="https://hacktoberfest.com" variant="outline" size="sm" external>
              Learn More
            </Button>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-2">Google Summer of Code</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Work on OLake as a GSoC contributor. Mentorship, stipend, and real-world experience await!
            </p>
            <Button href="https://summerofcode.withgoogle.com" variant="outline" size="sm" external>
              Learn More
            </Button>
          </div>
        </div>
      </SectionLayout>

      {/* Issues Browser */}
      <SectionLayout className="py-16">
        <SectionHeader
          title="How to start"
          subtitle="Pick an issue and start contributing today"
        />
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Button
            variant={issuesTab === 'good-first' ? 'primary' : 'outline'}
            onClick={() => setIssuesTab('good-first')}
            size="sm"
          >
            Good first issues
          </Button>
          <Button
            variant={issuesTab === 'second-level' ? 'primary' : 'outline'}
            onClick={() => setIssuesTab('second-level')}
            size="sm"
          >
            Second-level issues
          </Button>
          <Button
            variant={issuesTab === 'all' ? 'primary' : 'outline'}
            onClick={() => setIssuesTab('all')}
            size="sm"
          >
            All open issues
          </Button>
          <Button
            href="https://github.com/datazip-inc/olake/issues/new/choose"
            variant="outline"
            size="sm"
            external
          >
            Create a new issue
          </Button>
        </div>

        {issuesLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#193ae6]" />
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No {issuesTab === 'good-first' ? 'good first' : issuesTab === 'second-level' ? 'second-level' : 'open'} issues found at the moment.
            </p>
            <Button href="https://github.com/datazip-inc/olake/issues" variant="outline" size="sm" external>
              View All Issues on GitHub
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {issues.map((it) => {
              const url =
                it.html_url ||
                (typeof it.url === 'string' ? it.url.replace('api.github.com/repos', 'github.com') : '#')
              return (
                <div
                  key={it.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-3">
                    <div className="font-semibold text-gray-900 dark:text-white mb-2 leading-snug">
                      {it.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      #{it.number}
                    </div>
                  </div>
                  <Button href={url} variant="outline" size="sm" external className="w-full">
                    View on GitHub
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </SectionLayout>

      {/* CTA Section */}
      <SectionLayout className="py-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">
            Join These Amazing Contributors
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Every contribution matters. Whether it's your first open source contribution or you're a 
            seasoned developer, we welcome you to join our community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button href="/docs/community/contributing" size="lg">
              <FaCodeBranch className="mr-2" /> Start Contributing
            </Button>
            <Button 
              href="https://github.com/datazip-inc/olake/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22" 
              variant="outline" 
              size="lg"
              external
            >
              Find Good First Issues
            </Button>
          </div>
        </div>
      </SectionLayout>
    </Layout>
  )
}

export default ContributorsPage