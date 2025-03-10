import React from 'react'
import Layout from '@theme/Layout'

const teamMembers = [
  {
    name: 'Shubham Satish Baldava',
    designation: 'CTO',
    linkedin: 'https://linkedin.com/in/shubham-baldava',
    image: '/img/authors/shubham.jpg'
  },
  {
    name: 'Sandeep Devarapalli ',
    designation: 'CEO',
    linkedin: 'https://linkedin.com/in/sandeepdevarapalli',
    image: '/img/authors/sandeep.jpg'
  },
  {
    name: 'Rohan Khameshra',
    designation: 'CPO',
    linkedin: 'https://linkedin.com/in/rohan-khameshra',
    image: '/img/authors/rohan.webp'
  }
  // Add more team members as needed...
]

const AboutTeam = () => {
  return (
    <Layout>
      <div className='bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* About Us Section */}
          <section className='mb-16'>
            <h2 className='mb-4 text-center text-3xl font-extrabold' style={{ color: '#193AE6' }}>
              About Us
            </h2>
            <p className='mx-auto max-w-2xl text-center text-lg'>
              Welcome to OLake – the fastest open source DB-to-Data LakeHouse pipeline designed to
              bring your MongoDB data into modern analytics ecosystems like Apache Iceberg. OLake
              was born out of the need to eliminate the toil of one-off ETL scripts, combat
              performance bottlenecks, and avoid vendor lock-in with a clean, high-performing
              solution. OLake’s primary goal is simple: to provide the fastest data pipeline from your database (starting with MongoDB) to a Data LakeHouse—in this case, Apache Iceberg.
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
                      alt={member.name}
                      className='h-40 w-40 rounded-full object-cover transition duration-300 hover:border hover:border-gray-300'
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
