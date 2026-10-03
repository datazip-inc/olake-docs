import React from 'react'
import Link from '@docusaurus/Link'

const FEATURES = [
  'Feature Comparison Matrix',
  'Performance Benchmarks',
  'Configuration Examples',
  'Best Practices & Tips'
]

const ENGINES = ['Spark', 'Trino', 'Flink', 'More']

/** The "Query Engines Hub" panel at the top of the first page of /iceberg. Styled in blog.css (.ob-hub). */
export default function QueryEngineAdvertisement() {
  return (
    <section className='ob-hub' aria-labelledby='ob-hub-title'>
      <div className='ob-hub__content'>
        <p className='ob-hub__eyebrow'>Query Engines Hub</p>
        <h2 id='ob-hub-title' className='ob-hub__title'>
          Explore Iceberg Query Engines
        </h2>
        <p className='ob-hub__text'>
          Discover comprehensive guides for Apache Spark, Trino, Flink, DuckDB, and more. Compare features,
          capabilities, and find the perfect engine for your data workloads.
        </p>
        <ul className='ob-hub__features'>
          {FEATURES.map((feature) => (
            <li key={feature}>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                <path d='M5 13l4 4L19 7' />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className='ob-hub__side'>
        <ul className='ob-hub__engines' aria-label='Covered engines'>
          {ENGINES.map((engine) => (
            <li key={engine}>{engine}</li>
          ))}
        </ul>
        <Link to='/iceberg/query-engine' className='ob-btn ob-btn--primary'>
          Explore Query Engines
        </Link>
        <Link to='/iceberg/query-engine' className='ob-btn'>
          View Feature Matrix
        </Link>
      </div>
    </section>
  )
}
