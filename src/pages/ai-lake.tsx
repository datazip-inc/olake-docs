import React from 'react'
import Layout from '@theme/Layout'
import LazyComponent from '../components/LazyComponent'

const GlaceLake: React.FC = () => {
  return (
    <Layout>
      <main>
        <LazyComponent component='Glace' />
      </main>
    </Layout>
  )
}

export default GlaceLake
