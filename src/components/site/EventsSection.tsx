import React from 'react'

const EventsSection: React.FC = () => {
  return (
    <section className='bg-white py-2 dark:bg-gray-900 md:py-2'>
      <div className='mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-2'>
        <div className='mt-4'>
          <iframe 
            width="100%" 
            height="400" 
            frameBorder="0" 
            src="https://app.livestorm.co/datazip-inc/upcoming?limit=3" 
            title="OLake by Datazip events | Livestorm"
          />
        </div>
      </div>
    </section>
  )
}

export default EventsSection
