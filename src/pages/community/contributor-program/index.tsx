// src/pages/community/contributor-program/index.tsx
import React, { useEffect, useState } from 'react'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import {
  FaGithub,
  FaHandsHelping,
} from 'react-icons/fa'
import { LuUnplug } from 'react-icons/lu'
import { FaFeather, FaMagnifyingGlass } from 'react-icons/fa6'
import { AiOutlineDollarCircle } from 'react-icons/ai'
import { LiaCodeBranchSolid } from 'react-icons/lia'
import { BsStars } from 'react-icons/bs'
import { FaLinkedin, FaChevronLeft, FaChevronRight } from 'react-icons/fa'


import Button from '../../../components/community/improved/Button'
import PageHeader from '../../../components/community/improved/PageHeader'
import SectionHeader from '../../../components/community/improved/SectionHeader'
import FeatureCard from '../../../components/community/improved/FeatureCard'
// import StatCard from '../../../components/community/improved/StatCard'
import SectionLayout from '../../../components/community/SectionLayout'

const ContributorProgramPage = () => {
  const contributionTypes = [
    {
      icon: <LuUnplug />,
      title: 'Build New Connectors',
      description: "Create connectors to expand OLake's ecosystem. We provide tools and support to make it easy.",
      points: '30-50',
      difficulty: 'Intermediate'
    },
    {
      icon: <FaFeather />,
      title: 'Write Documentation',
      description: 'Improve guides, write tutorials, and help others learn with clear documentation.',
      points: '10-20',
      difficulty: 'Beginner'
    },
    {
      icon: <FaMagnifyingGlass />,
      title: 'Fix Bugs & Improve',
      description: 'Squash bugs, optimize performance, and enhance existing features.',
      points: '5-30',
      difficulty: 'All Levels'
    }
  ]

  const benefits = [
    {
      icon: <AiOutlineDollarCircle />,
      title: 'Rewards & Recognition',
      description: 'Get paid for select contributions and earn recognition in our community.',
      highlight: true
    },
    {
      icon: <LiaCodeBranchSolid />,
      title: 'Learning & Growth',
      description: 'Level up your skills, learn from experts, and grow your professional network.',
      highlight: false
    },
    {
      icon: <BsStars />,
      title: 'Early Access',
      description: 'Get beta access to new features, tools, and participate in product decisions.',
      highlight: false
    }
  ]

  const rewardTiers = [
    {
      name: 'Bronze',
      points: '0-49',
      benefits: ['OLake stickers', 'Community badge', 'Slack recognition'],
      color: 'from-orange-400 to-orange-600'
    },
    {
      name: 'Silver',
      points: '50-149',
      benefits: ['OLake t-shirt', 'Featured contributor', 'Beta access', 'Monthly swag'],
      color: 'from-gray-400 to-gray-600'
    },
    {
      name: 'Gold',
      points: '150-499',
      benefits: ['Premium swag kit', 'Internships', 'Mentorship access', 'Cash rewards'],
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      name: 'Platinum',
      points: '500+',
      benefits: ['Chance to get hired', 'Executive mentorship', 'Project leadership', 'Maximum rewards'],
      color: 'from-purple-400 to-purple-600'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Read the Guide',
      description: 'Start by reading our contributing guide to understand the process and requirements.',
      link: '/docs/community/contributing'
    },
    {
      number: '02',
      title: 'Join Slack',
      description: 'Connect with other contributors in our dedicated Slack channel for support and guidance.',
      link: 'https://olake.io/slack'
    },
    {
      number: '03',
      title: 'Pick an Issue',
      description: 'Browse open issues labeled "good first issue" or "help wanted" to find your first contribution.',
      link: 'https://github.com/datazip-inc/olake/issues'
    },
    {
      number: '04',
      title: 'Start Contributing',
      description: 'Submit your pull request and earn points. Our maintainers will review and provide feedback.',
      link: 'https://github.com/datazip-inc/olake/pulls'
    }
  ]

  const linkedinPosts = [
    { embedId: 'urn:li:share:7324402000287215616', contributor: 'Aditya SwayamSiddha' },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [showLinkedInPanel, setShowLinkedInPanel] = useState(false)

  useEffect(() => {
  // Check if window is defined (for SSR)
  if (typeof window !== 'undefined') {
    // Set initial state based on screen width
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setShowLinkedInPanel(true)
      } else {
        setShowLinkedInPanel(false)
      }
    }
    
    // Set initial state
    handleResize()
    
    // Add resize listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }
}, [])

  return (
    <Layout
      title='OLake Contributor Program'
      description='Join the OLake Contributor Program. Get rewards, recognition, and help shape the future of data lakehouse technology.'
    >
      {/* Hero Section */}
      <PageHeader
        title={
          <>
            Join the{' '}
            <span className="bg-gradient-to-r from-[#193ae6] to-purple-600 bg-clip-text text-transparent">
              Contributor
            </span>{' '}
            Program
          </>
        }
        subtitle="OLake Contributor Program"
        description="Give back to the community and receive rewards for helping build OLake's connector ecosystem. Join 10+ contributors making a difference."
        cta={
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              href="https://github.com/datazip-inc/olake/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22"
              size="lg"
              external
            >
              <FaHandsHelping className="mr-2" /> Start Now
            </Button>
            <Button
              href="/docs/community/contributing"
              variant="outline"
              size="lg"
            >
              Read Contributing Guide
            </Button>
          </div>
        }
      />

      {/* Contribution Types Section */}
      <SectionLayout className="py-20 bg-gradient-to-br from-gray-900 to-blue-950">
        <SectionHeader
          title={<span className="text-white">Contribute in Multiple Ways</span>}
          subtitle="Choose how you want to contribute based on your skills and interests"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contributionTypes.map((type, index) => (
            <div
              key={index}
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-5xl mb-6 text-blue-400">
                {type.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {type.title}
              </h3>
              <p className="text-white/80 mb-6">
                {type.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-blue-300 font-semibold">
                  {type.points} points
                </span>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full text-white/90">
                  {type.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionLayout>

      {/* Program Description */}
      <SectionLayout className="py-20">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Program Overview"
            subtitle="Empowering contributors to shape the future of data engineering"
            align="center"
          />

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-[#193ae6] dark:text-blue-400 mb-4">
                  What is the Contributor Program?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  The OLake Contributor Program is a community collaboration initiative designed to improve
                  the quality and expand the ecosystem of OLake connectors. We sponsor various tasks around
                  features, usability, and reliability while empowering both veteran contributors and newcomers
                  to make meaningful contributions to the project.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#193ae6] dark:text-blue-400 mb-4">
                  How it Works
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Getting started is simple. After reviewing our contributing guide, explore the good first issues and Join our Slack community:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Get direct support from maintainers</li>
                  <li>Collaborate with other contributors</li>
                  <li>Access exclusive resources and documentation</li>
                  <li>Participate in contributor-only events</li>
                  <li>Track your contributions and rewards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SectionLayout>

      {/* Benefits Section */}
      <SectionLayout className="py-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-16 shadow-2xl">
          <SectionHeader
            title="Why Join the Program?"
            subtitle="Unlock exclusive benefits while making a real impact"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <FeatureCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                highlight={benefit.highlight}
              />
            ))}
          </div>
        </div>
      </SectionLayout>

      {/* Reward Tiers */}
      <SectionLayout className="py-20">
        <SectionHeader
          title="Reward Tiers"
          subtitle="Earn points with every contribution and unlock amazing rewards"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewardTiers.map((tier, index) => (
            <div
              key={index}
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-10 rounded-2xl`} />
              <div className="relative z-10">
                <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                  {tier.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {tier.points} points
                </p>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            See where you stand among our amazing contributors
          </p>
          <Button href="/community/contributors" variant="outline">
            View Current Contributor Rankings →
          </Button>
        </div>
      </SectionLayout>

      {/* How to Get Started */}
      <SectionLayout className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <SectionHeader
          title="How to Get Started"
          subtitle="Join the program in 4 simple steps"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#193ae6] to-purple-600 text-white text-2xl font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {step.description}
              </p>
              <Link
                to={step.link}
                className="text-[#193ae6] dark:text-blue-400 hover:underline font-medium"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </SectionLayout>

      {/* CTA Section */}
      <SectionLayout className="py-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join hundreds of contributors who are shaping the future of data engineering.
            Your contributions matter, and we can't wait to have you on board!
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button
              href="https://github.com/datazip-inc/olake/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22"
              size="lg"
              external
            >
              <FaHandsHelping className="mr-2" /> Start Now
            </Button>
            <Button
              href="https://github.com/datazip-inc/olake"
              variant="outline"
              size="lg"
              external
            >
              <FaGithub className="mr-2" /> Explore on GitHub
            </Button>
          </div>
        </div>
      </SectionLayout>



      <div className={clsx(
        "fixed right-0 top-24 z-40 transition-transform duration-300",
        "hidden md:block", // Hide on mobile completely
        showLinkedInPanel ? "translate-x-0" : "translate-x-full"
      )}>
        <button
          onClick={() => setShowLinkedInPanel(!showLinkedInPanel)}
          className="absolute -left-12 top-8 bg-[#0077B5] border-none text-white p-3 rounded-l-lg shadow-lg hover:bg-[#005885] transition-colors"
          aria-label={showLinkedInPanel ? "Close LinkedIn feed" : "Open LinkedIn feed"}
        >
          <FaLinkedin className="w-6 h-6" />
        </button>

        <div className="w-[400px] h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 shadow-2xl rounded-l-lg overflow-hidden">
          <div className="p-4 bg-[#0077B5] text-white">
            <h3 className="font-bold text-lg">Contributor Spotlights</h3>
            <p className="text-sm opacity-90 mt-1">Success stories from our community</p>
          </div>
          <div className="overflow-y-auto h-[calc(100%-5rem)] p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {linkedinPosts.map((post, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <iframe
                  src={`https://www.linkedin.com/embed/feed/update/${post.embedId}`}
                  height="400"
                  width="100%"
                  frameBorder="0"
                  allowFullScreen
                  title={`Contributor Story ${index + 1}`}
                  className="rounded"
                  loading="lazy" // Lazy load for performance
                />
                {post.contributor && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    - {post.contributor}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile-only floating button */}
      <button
        onClick={() => setShowLinkedInPanel(!showLinkedInPanel)}
        className="fixed bottom-6 border-none right-6 z-40 bg-[#0077B5] text-white p-4 rounded-full shadow-lg md:hidden"
        aria-label="View contributor stories"
      >
        <FaLinkedin className="w-6 h-6"  />
      </button>

      {/* Mobile LinkedIn Modal */}
      {showLinkedInPanel && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setShowLinkedInPanel(false)}>
          <div
            className="fixed inset-x-4 bottom-4 top-20 bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-[#0077B5] text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Contributor Spotlights</h3>
              <button
                onClick={() => setShowLinkedInPanel(false)}
                className="bg-[#104663] text-white hover:bg-white/20 p-2 rounded border-none "
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)] p-4 space-y-4">
              {linkedinPosts.map((post, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                  <iframe
                    src={`https://www.linkedin.com/embed/feed/update/${post.embedId}`}
                    height="350"
                    width="100%"
                    frameBorder="0"
                    allowFullScreen
                    title={`Contributor Story ${index + 1}`}
                    className="rounded"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}

export default ContributorProgramPage