import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import BlogSidebar from '@theme/BlogSidebar'
import BlogBreadcrumbs from '@theme/BlogBreadcrumbs'

// Reading Progress Hook
function useReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress() // Initial calculation

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return progress
}

// Copy URL Component
function CopyUrlSection() {
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = currentUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-3">
      {/* URL Display */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Article URL:</div>
        <div className="text-xs text-gray-700 dark:text-gray-300 break-all font-mono">
          {currentUrl}
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopyUrl}
        className={clsx(
          'w-full flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-all duration-200',
          {
            'bg-green-500 text-white': copied,
            'bg-[#193ae6] hover:bg-blue-700 text-white': !copied,
          }
        )}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {copied ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          )}
        </svg>
        {copied ? 'Copied!' : 'Copy URL'}
      </button>
    </div>
  )
}


// Simplified TOC Component - just use what Docusaurus provides

function EnhancedTOC({ toc }) {
  return (
    <nav >
      <div >
        {toc}
      </div>
    </nav>
  )
}

export default function BlogLayout(props) {
  const { sidebar, toc, children, ...layoutProps } = props
  const hasSidebar = sidebar && sidebar.items.length > 0
  const progress = useReadingProgress()

  return (
    <Layout {...layoutProps}>
      {/* Fixed Reading Progress Bar at Top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-[#193ae6] to-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Subtle background */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Mobile sidebar only */}
        {hasSidebar && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className=" max-w-7xl mx-auto px-4 py-4">
              <BlogSidebar sidebar={sidebar} hideOnDesktop />
            </div>
          </div>
        )}

        <div className="py-8 lg:py-12">
          <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 lg:gap-12">
              {/* Main content area */}

              <article className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
                  <BlogBreadcrumbs />
                  {children}
                </div>
              </article>
              {/* </main> */}

              {/* Enhanced TOC Sidebar - Like comparison sites */}
              {toc && (
                <aside className="hidden lg:block w-72 flex-shrink-0">
                  <div className="sticky top-24 space-y-6">
                    {/* Clean TOC Design */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                      {/* Minimal Header */}
                      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          Contents
                        </h3>
                      </div>

                      {/* TOC Navigation */}
                      <div className="px-3 py-4 max-h-96 overflow-y-auto">
                        <EnhancedTOC toc={toc} />
                      </div>
                    </div>

                    {/* Reading Progress Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reading Progress</span>
                          <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#193ae6] to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {progress < 25 ? 'Just getting started...' :
                            progress < 50 ? 'Making good progress!' :
                              progress < 75 ? 'Almost halfway there!' :
                                progress < 95 ? 'Nearly finished!' :
                                  'Article completed! 🎉'}
                        </div>
                      </div>
                    </div>

                    {/* Copy URL Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-5">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        Share this article
                      </h4>
                      <CopyUrlSection />
                    </div>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}