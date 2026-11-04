import React from 'react'
import PostCta from './PostCta'
import { SLACK_URL } from './landing/chrome/navItems'

const FusionBlogCTA = () => (
  <PostCta
    title='OLake Fusion'
    body='Open-source lakehouse maintenance for Apache Iceberg tables. 50% cheaper (2x faster) compaction than Vanilla Spark.'
    slackUrl={SLACK_URL}
    githubUrl='https://github.com/datazip-inc/olake-fusion'
    githubLabel='Explore OLake Fusion GitHub'
  />
)

export default FusionBlogCTA
