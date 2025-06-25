// src/pages/community/index.tsx
import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import {
  FaSlack,
  FaGithub,
  FaDiscourse,
  FaCalendarAlt,
  FaUsers,
  FaHandsHelping,
  FaRocket,
  FaBook,
  FaCode,
  FaTrophy,
  FaComments,
  FaLightbulb,
  FaGraduationCap
} from 'react-icons/fa'

import Button from '../../components/community/improved/Button'
import FeatureCard from '../../components/community/improved/FeatureCard'
import PageHeader from '../../components/community/improved/PageHeader'
import SectionHeader from '../../components/community/improved/SectionHeader'

import ActiveContributors from '../../components/community/improved/ActiveContributors'
import SectionLayout from '../../components/community/SectionLayout'
import StatCard from '@site/src/components/community/improved/StatCard'

const CommunityPage = () => {
  const channels = [
    {
      name: 'contributing-to-olake',
      description: 'Get support on starting to contribute to OLake',
      members: '2.5k+'
    },
    {
      name: 'general',
      description: 'Major community updates and announcements',
      members: '20k+'
    },
    {
      name: 'help',
      description: 'Get help from the community when you\'re stuck',
      members: '15k+'
    },
    {
      name: 'discussions',
      description: 'Share articles and resources you\'ve found helpful',
      members: '8k+'
    },
    {
      name: 'introduce-yourself',
      description: 'Best way to say hello to the community',
      members: '10k+'
    },
    {
      name: 'social-and-events',
      description: 'Everything related to OLake social events',
      members: '5k+'
    }
  ]

  const forumCategories = [
    {
      icon: <FaComments />,
      name: 'Questions',
      description: 'Ask the community for help on your questions',
      count: '4 topics'
    },
    {
      icon: <FaLightbulb />,
      name: 'Ideas',
      description: 'Share ideas for improvements and upvote others',
      count: '10+ ideas'
    },
    {
      icon: <FaRocket />,
      name: 'Show and Tell',
      description: 'Show off what you\'ve built with OLake',
      count: '3+ projects'
    },
    {
      icon: <FaTrophy />,
      name: 'Kind Words',
      description: 'Share what you love about OLake',
      count: '8+ posts on LinkedIn'
    }
  ]

  const stats = [
    { label: 'Community Members', value: '205+' },
    { label: 'Contributors', value: '10+' },
    { label: 'Pull Requests', value: '30+' },
    { label: 'Issues Resolved', value: '76+' }
  ]

  return (
    <Layout
      title='OLake Community'
      description='Join the fastest growing data engineering community. Connect, learn, and contribute with 205+ passionate practitioners.'
    >
      {/* Hero Section */}
      <PageHeader
        title={
          <>
            <span className="text-[#193ae6] dark:text-blue-400">Made</span> by engineers,
            <br />
            for engineers.
          </>
        }
        subtitle="Welcome to OLake Community"
        description="Join 20+ data professionals building the future of data lakehouse technology together"
        cta={
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="https://olake.io/slack" size="lg" external>
              <FaSlack className="mr-2" /> Join our Slack
            </Button>
            <Button href="/community/contributor-program" variant="outline" size="lg">
              <FaHandsHelping className="mr-2" /> Become a Contributor
            </Button>
          </div>
        }
      />

      {/* Stats Section */}
      <SectionLayout className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#193ae6] dark:text-blue-400">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </SectionLayout>

      {/* Slack Community Section */}
      <SectionLayout className="py-20">
        <SectionHeader
          title={
            <>
              Join the data engineering <span className="text-[#193ae6] dark:text-blue-400">community</span> on Slack
            </>
          }
          subtitle="Connect with passionate data engineering practitioners. Share ideas, get help, and stay updated with the latest in data lakehouse technology."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {channels.map((channel, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-[#193ae6] dark:text-blue-400">
                  #{channel.name}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {channel.members}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {channel.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <Button href="https://olake.io/slack" size="lg" external>
            <FaSlack className="mr-2" /> Join OLake Community Slack
          </Button>
          <p className="text-gray-600 dark:text-gray-400">
            Need direct access to our team and SLAs for support?{' '}
            <Link to="/contact" className="text-[#193ae6] dark:text-blue-400 font-semibold hover:underline">
              Talk to our team
            </Link>
          </p>
        </div>
      </SectionLayout>

      {/* Forum Section */}
      <SectionLayout className="py-20 bg-gradient-to-br from-blue-950 to-purple-950">
        <SectionHeader
          title={<span className="text-white">Community Forum & Discussions</span>}
          subtitle="Find answers, share ideas, and showcase your work in our GitHub Discussions"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {forumCategories.map((category, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-white mb-4 text-3xl">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {category.name}
              </h3>
              <p className="text-white/80 text-sm mb-3">
                {category.description}
              </p>
              <p className="text-blue-300 text-sm font-semibold">
                {category.count}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            href="https://github.com/datazip-inc/olake/discussions"
            variant="secondary"
            size="lg"
            external
          >
            <FaGithub className="mr-2" /> Explore OLake Community Forum
          </Button>
        </div>
      </SectionLayout>

      {/* How to Contribute Section */}
      <SectionLayout className="py-20">
        <SectionHeader
          title="How to contribute to OLake"
          subtitle="Ready to make your mark? We welcome contributions from everyone, whether you're a seasoned developer or just getting started."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <FeatureCard
            icon={<FaCode />}
            title="Code Contributions"
            description="Build new connectors, fix bugs, improve performance, and add features to make OLake better for everyone."
          />
          <FeatureCard
            icon={<FaBook />}
            title="Documentation"
            description="Help others learn by improving our docs, writing tutorials, and creating guides for common use cases."
            highlight
          />
          <FeatureCard
            icon={<FaGraduationCap />}
            title="Community Support"
            description="Share your knowledge by answering questions, reviewing PRs, and helping newcomers get started."
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-center mb-6">
              Contributor Rewards Program
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                <span className="font-medium">New low-code connector</span>
                <span className="font-bold text-[#193ae6] dark:text-blue-400">50 points</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                <span className="font-medium">New tutorial or quick start</span>
                <span className="font-bold text-[#193ae6] dark:text-blue-400">20 points</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                <span className="font-medium">Bug fixes and improvements</span>
                <span className="font-bold text-[#193ae6] dark:text-blue-400">10-30 points</span>
              </div>
            </div>
            <div className="text-center space-y-4">
              <Button href="/community/contributor-program" size="lg">
                Join the Contributor Program
              </Button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Earn swag, recognition, and exclusive benefits
              </p>
            </div>
          </div>
        </div>
      </SectionLayout>

      {/* Events Section */}
      <SectionLayout className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <SectionHeader
          title="Community Events & Meetups"
          subtitle="Join our webinars, meetups, and workshops to learn from experts and connect with peers"
        />

        <div className="flex justify-center">
          <Button href="/webinar" size="lg">
            <FaCalendarAlt className="mr-2" /> View All Events
          </Button>
        </div>
      </SectionLayout>

      {/* Active Contributors Section */}
      <ActiveContributors />

      {/* About Community Section */}
      <SectionLayout className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <SectionHeader
            title={
              <>
                <span className="text-[#193ae6] dark:text-blue-400">About</span> our community
              </>
            }
            subtitle="An inclusive place where engineers can find support, share knowledge, and contribute to the future of data engineering"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<FaHandsHelping className="w-8 h-8 text-[#193ae6] dark:text-blue-400" />}
              title="Inclusive"
              description="Everyone is welcome, regardless of experience level"
            />
            <StatCard
              icon={<FaUsers className="w-8 h-8 text-[#193ae6] dark:text-blue-400" />}
              title="Supportive"
              description="Get help when you need it from our amazing community"
            />
            <StatCard
              icon={<FaRocket className="w-8 h-8 text-[#193ae6] dark:text-blue-400" />}
              title="Innovative"
              description="Be part of building the future of data technology"
            />
          </div>

          <Button href="/docs/community/code-of-conduct" variant="outline" size="lg">
            Read our Code of Conduct
          </Button>
        </div>
      </SectionLayout>
    </Layout>
  )
}

export default CommunityPage