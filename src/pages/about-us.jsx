import React from 'react'
import Layout from '@theme/Layout'

const teamMembers = [
  {
    name: 'Shubham Satish Baldava',
    designation: 'CTO',
    linkedin: 'https://linkedin.com/in/shubham-baldava',
    image: '/img/authors/shubham.webp'
  },
  {
    name: 'Rohan Khameshra',
    designation: 'CEO',
    linkedin: 'https://linkedin.com/in/rohan-khameshra',
    image: '/img/authors/rohan.webp'
  },  
  {
    name: 'Sandeep Devarapalli ',
    designation: 'CMO',
    linkedin: 'https://linkedin.com/in/sandeepdevarapalli',
    image: '/img/authors/sandeep.webp'
  },

  // Add more team members as needed...
]

const AboutTeam = () => {
  return (
    <Layout 
      title="About Us - OLake Team"
      description="Meet the OLake team behind the fastest open-source data replication tool. Learn about our mission to simplify database to Apache Iceberg workflows."
    >
      <div className='bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* About Us Section */}
          <section className='mb-16'>
            <h2 className='mb-4 text-center text-3xl font-extrabold' style={{ color: '#193AE6' }}>
              About Us
            </h2>
            <p className='mx-auto max-w-2xl text-center text-lg'>
              OLake is the fastest open-source, Iceberg-first EL engine that removes the pain of brittle scripts and one-off pipelines. We make "database → Apache Iceberg" simple, fast, and observable—with recent benchmarks showing up to 500× faster ingest than common alternatives—so your team can stop handling connectors and start focusing on models, products, and impact.
            </p>
            <p className='mx-auto max-w-2xl text-center text-lg mt-6'>
              Born from real-world issues with slow, fragile ingestion, OLake gives you a clean UI/CLI, resilient CDC, and a path that keeps getting faster with every release—and we're actively pushing those benchmarks even further. No vendor lock-in, no plumbing issues—just a reliable way to move data into Iceberg for your modern analytics.
            </p>
          </section>

          {/* Our Team Section */}
          <section>
            <h2 className='mb-8 text-center text-3xl font-extrabold' style={{ color: '#193AE6' }}>
              Our Team
            </h2>
            <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              {teamMembers.map((member, index) => (
                <div key={index} className='text-center'>
                  <div className='mx-auto h-40 w-40'>
                    <img
                      src={member.image}
                      alt={`${member.name} | Olake ${member.designation}`}
                      className='h-40 w-40 rounded-full object-cover transition duration-300 hover:border hover:border-gray-300'
                      loading="lazy" decoding="async"
                    />
                  </div>
                  <h3 className='mt-4 text-xl font-medium'>{member.name}</h3>
                  <p className='text-gray-500 dark:text-gray-400'>{member.designation}</p>
                  <div className='mt-2'>
                    <a
                      href={member.linkedin}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[#193AE6] hover:underline'
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default AboutTeam
