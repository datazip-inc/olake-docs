import React from 'react'
import PostCta from './PostCta'
import { SLACK_URL } from './landing/chrome/navItems'

const BlogCTA = () => (
  <PostCta
    title='OLake Go'
    body='Replicate databases, Kafka, and S3 into Apache Iceberg with OLake Go, an open source EL engine built for Iceberg from the ground up.'
    slackUrl={SLACK_URL}
    githubUrl='https://github.com/datazip-inc/olake'
    githubLabel='Explore OLake GitHub'
  />
)

export default BlogCTA
