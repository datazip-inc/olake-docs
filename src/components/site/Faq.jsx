import React, { useState } from 'react'
import SectionHeader from '../SectionHeader'

const Accordion = ({ question, answer, defaultExpanded }) => {
  const [expanded, setExpanded] = useState(defaultExpanded || false)

  return (
    <div className='border-b border-gray-200 dark:border-gray-700 py-4'>
      <div
        className='flex cursor-pointer items-center justify-between rounded p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'
        onClick={() => setExpanded(!expanded)}
      >
        <div className='text-base font-bold leading-6 text-gray-900 dark:text-white'>
          {question}
        </div>
        <div
          className={`text-xl text-gray-900 transition-transform duration-200 ease-in-out dark:text-white`}
        >
          {expanded ? '↑' : '↓'}
        </div>
      </div>
      {expanded && (
        <div className='mt-3 px-2 rounded bg-gray-50 dark:bg-gray-800/50 p-3'>
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
    <div className='flex w-full flex-col rounded-lg font-sans bg-white dark:bg-gray-900 md:p-6'>
      {showHeading && <SectionHeader showHr={false} heading={<>Frequently Asked Questions</>} />}
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
