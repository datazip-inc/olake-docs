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
            expanded ? 'text-black' : 'text-[#939393]'
          }`}
        >
          {expanded ? '↑' : '↓'}
        </div>
      </div>
      {expanded && (
        <div className='rounded p-3 px-2' style={{ marginTop: '-0.75rem' }}>
          <div 
            className='text-sm font-normal leading-relaxed text-[#333333] dark:text-gray-300'
            dangerouslySetInnerHTML={{
              __html: answer.replace(
                /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
                '<a href="mailto:$1" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>'
              )
            }}
          />
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
          className='mb-4 flex flex-col gap-4 text-5xl font-medium text-[#333333] dark:text-white'
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
