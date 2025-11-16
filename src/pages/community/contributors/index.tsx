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

import contributorPoints from '../../../data/contributor-points.json'

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

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token || null
      setAccessToken(token)
      if (token) {
        await fetchMe(token)
      }
    }
    void init()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
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
      const res = await fetch('https://kpyasaicyxmosvwuspcx.supabase.co/functions/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) return
      const json = await res.json()
      setGithubLogin(json?.user?.github_login ?? null)
      const score = json?.score
      if (score) {
        setPoints(score.total_points ?? null)
        setBreakdown(score.breakdown ?? null)
      }
    } catch {
      // ignore for v0
    }
  }

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: typeof window !== 'undefined' ? window.location.href : undefined }
    })
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
      const url = new URL('https://kpyasaicyxmosvwuspcx.supabase.co/functions/v1/issues')
      if (label) url.searchParams.set('label', label)
      const res = await fetch(url.toString())
      const json = await res.json()
      const items = Array.isArray(json?.items) ? json.items : []
      setIssues(items)
    } catch {
      setIssues([])
    } finally {
      setIssuesLoading(false)
    }
  }

  useEffect(() => {
    void loadIssues(currentLabel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issuesTab])

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://api.github.com/repos/datazip-inc/olake/contributors?per_page=100')

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

    // Sort
    if (sortBy === 'points') {
      filtered.sort((a, b) => {
        const pointsA = contributorPoints.contributors[a.login]?.points || a.contributions
        const pointsB = contributorPoints.contributors[b.login]?.points || b.contributions
        return pointsB - pointsA
      })
    } else if (sortBy === 'contributions') {
      filtered.sort((a, b) => b.contributions - a.contributions)
    } else {
      filtered.sort((a, b) => a.login.localeCompare(b.login))
    }

    return filtered
  }, [contributors, searchTerm, sortBy])

  const topContributors = filteredAndSortedContributors.slice(0, 3)
  const otherContributors = filteredAndSortedContributors.slice(3)

  const contributorStats = {
    total: filteredAndSortedContributors.length,
    totalContributions: filteredAndSortedContributors.reduce((sum, c) => sum + c.contributions, 0),
    totalPoints: filteredAndSortedContributors.reduce((sum, c) => 
      sum + (contributorPoints.contributors[c.login]?.points || c.contributions), 0
    ),
    averagePoints: Math.round(
      filteredAndSortedContributors.reduce((sum, c) => 
        sum + (contributorPoints.contributors[c.login]?.points || c.contributions), 0
      ) / filteredAndSortedContributors.length
    )
  }

  return (
    <Layout 
      title='OLake Contributors' 
      description='Meet the amazing contributors who make OLake possible. Join them in building the future of data lakehouse technology.'
    >
      {/* Top-right login/points */}
      <div className="fixed right-4 top-4 z-50">
        {!githubLogin ? (
          <Button onClick={handleLogin} size="sm">
            <FaGithub className="mr-2" /> Log in with GitHub
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              {githubLogin} • <span className="text-[#193ae6] dark:text-blue-400">{points ?? 0} pts</span>
            </div>
            {syncing ? (
              <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <FaSync className="animate-spin inline mr-2" /> Syncing...
              </div>
            ) : (
              <Button onClick={handleRefresh} size="sm" variant="outline">
                <FaSync className="mr-2" /> Refresh
              </Button>
            )}
            <Button onClick={handleLogout} size="sm" variant="outline">
              <FaSignOutAlt className="mr-2" /> Logout
            </Button>
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

      {/* Stats Section */}
      <SectionLayout className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#193ae6] dark:text-blue-400 mb-2">
              {contributorStats.total}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Contributors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#193ae6] dark:text-blue-400 mb-2">
              {contributorStats.totalContributions.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total PRs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#193ae6] dark:text-blue-400 mb-2">
              {contributorStats.totalPoints.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#193ae6] dark:text-blue-400 mb-2">
              {contributorStats.averagePoints}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Avg. Points</div>
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
                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#193ae6] dark:focus:ring-blue-400"
              >
                <option value="points">Sort by Points</option>
                <option value="contributions">Sort by PRs</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>
      </SectionLayout>

      {/* Top Contributors Section */}
      {!loading && !error && topContributors.length > 0 && (
        <SectionLayout className="py-8">
          <SectionHeader
            title={
              <>
                <FaTrophy className="inline-block text-yellow-500 mr-3" />
                Top Contributors
              </>
            }
            subtitle="Our most active contributors leading the way"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {topContributors.map((contributor, index) => (
              <div key={contributor.id} className="relative">
                <div className={clsx(
                  "absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white z-10",
                  index === 0 && "bg-gradient-to-br from-yellow-400 to-yellow-600",
                  index === 1 && "bg-gradient-to-br from-gray-400 to-gray-600",
                  index === 2 && "bg-gradient-to-br from-orange-400 to-orange-600"
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
          subtitle={`${otherContributors.length} amazing developers making OLake better every day`}
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

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {otherContributors.map((contributor) => (
                <ImprovedContributorCard key={contributor.id} contributor={contributor} />
              ))}
            </div>

            {filteredAndSortedContributors.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No contributors found matching your search.
                </p>
              </div>
            )}
          </>
        )}
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((it) => {
              const labels = (it.labels || []).map((l) => l?.name).filter(Boolean) as string[]
              const url =
                it.html_url ||
                (typeof it.url === 'string' ? it.url.replace('api.github.com/repos', 'github.com') : '#')
              const snippet =
                (it.body || '').trim().split(/\s+/).slice(0, 30).join(' ') + ((it.body || '').length > 0 ? '…' : '')
              return (
                <div
                  key={it.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-2 font-semibold">{it.title}</div>
                  <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">{snippet}</div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {labels.slice(0, 6).map((lb) => (
                      <span
                        key={lb}
                        className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#193ae6] dark:bg-gray-900 dark:text-blue-300"
                      >
                        {lb}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">#{it.number}</span>
                    <Button href={url} variant="outline" size="sm" external>
                      View on GitHub
                    </Button>
                  </div>
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