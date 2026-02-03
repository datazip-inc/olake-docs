import React, { useState } from 'react'
import SectionHeader from '../SectionHeader'

const Accordion = ({ question, answer, defaultExpanded }) => {
  const [expanded, setExpanded] = useState(defaultExpanded || false)

  return (
    <div
      className='py-4'
      style={{
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <div
        className='flex cursor-pointer items-center justify-between rounded p-2 transition-colors'
        onClick={() => setExpanded(!expanded)}
      >
        <div className='text-base font-bold leading-6 text-[#2f2f2f] dark:text-white'>
          {question}
        </div>
        <div
          className={`text-xl transition-transform duration-200 ease-in-out ${
            expanded ? 'text-black' : 'text-brand-gray-400'
          }`}
        >
          {expanded ? '↑' : '↓'}
        </div>
      </div>
      {expanded && (
        <div className='-mt-2 rounded p-3 px-2'>
          <div className='text-brand-gray-900 text-sm font-normal leading-relaxed dark:text-gray-300'>
            {answer}
          </div>
        </div>
      )}
    </div>
  )
}

const Faq = ({ data, showHeading }) => {
  return (
    <div className='flex w-full flex-col rounded-lg bg-white dark:bg-gray-900 md:p-6'>
      {showHeading && (
        // <SectionHeader showHr={false} heading={<>Frequently Asked Questions</>} />
        <div
          id='faq-heading'
          className='text-brand-gray-900 mb-4 flex flex-col gap-4 text-xl font-medium dark:text-white sm:text-[64px]'
        >
          Frequently Asked Questions
        </div>
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
