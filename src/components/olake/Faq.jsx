import React, { useState } from 'react'
import SectionHeader from '../SectionHeader'

const Accordion = ({ question, answer, defaultExpanded }) => {
  const [expanded, setExpanded] = useState(defaultExpanded || false)

  return (
    <div className='border-b border-gray-200 py-4 dark:border-gray-700'>
      <div
        className='flex cursor-pointer items-center justify-between rounded p-2 transition-colors '
        onClick={() => setExpanded(!expanded)}
      >
        <div className='text-base font-bold leading-6 text-gray-900 dark:text-white'>
          {question}
        </div>
        <div
          className={`text-xl transition-transform duration-200 ease-in-out ${
            expanded ? 'rotate-180' : ''
          } text-gray-900 dark:text-white`}
        >
          &#9660;
        </div>
      </div>
      {expanded && (
        <div className='mt-3 px-2'>
          <div className='text-sm font-normal leading-relaxed text-gray-700 dark:text-gray-300'>
            {answer}
          </div>
        </div>
      )}
    </div>
  )
}

const Faq = ({ data, showHeading }) => {
  return (
    <div className='flex w-full flex-col rounded-lg md:p-6 font-sans shadow-lg'>
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
