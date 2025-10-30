import React from 'react'
import Layout from '@theme/Layout'
import LazyComponent from '../components/LazyComponent'

const GlaceLake: React.FC = () => {
  return (
    <Layout 
      title="AI Lake - OLake"
      description="Explore OLake's AI-powered data lake capabilities for intelligent data processing and analytics with Apache Iceberg."
    >
      <main>
        <LazyComponent component='Glace' />
      </main>
    </Layout>
  )
}

export default GlaceLake
