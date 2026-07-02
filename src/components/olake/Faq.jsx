import React, { useState } from 'react'
import SectionHeader from '../SectionHeader'

const Accordion = ({ question, answer, defaultExpanded }) => {
  const [expanded, setExpanded] = useState(defaultExpanded || false)

  return (
    <div className='border-b py-4 '>
      <div
        className='flex cursor-pointer items-center justify-between rounded p-2 transition-colors '
        onClick={() => setExpanded(!expanded)}
      >
        <div className='text-base font-bold leading-6 text-gray-900 dark:text-white'>
          {question}
        </div>
        <div className='text-2xl text-gray-400 dark:text-gray-500 flex-shrink-0 ml-4'>
        {expanded ? '↑' : '↓'}
      </div>
      </div>
      {expanded && (
        <div className='mt-3 px-2'>
          <div className='text-sm font-normal leading-relaxed text-gray-900 dark:text-gray-500'>
            {answer}
          </div>
        </div>
      )}
    </div>
  )
}

const Faq = ({ data, showHeading }) => {
  return (
    <div className='flex w-full flex-col rounded-lg md:p-6 font-sans'>
      {showHeading && (
        
        <SectionHeader
          heading={
            <>
              Frequently Asked Questions
            </>
          }
         
        />
      )}
      {data?.map((item, index) => (
        <Accordion
          key={index}
          question={item.question}
          answer={item.answer}
          defaultExpanded={index === 0}
        />
      ))}
    </div>
  )
}

export default Faq