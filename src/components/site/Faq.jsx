import clsx from 'clsx'
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
      <button
        type='button'
        className='flex w-full cursor-pointer appearance-none items-center justify-between rounded border-none bg-transparent p-2 text-left font-space transition-colors'
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className='text-base font-bold leading-6 text-[#2f2f2f] dark:text-white'>
          {question}
        </div>
        <div
          className={clsx(
            'text-xl transition-transform duration-200 ease-in-out',
            expanded ? 'text-black' : 'text-brand-gray-400'
          )}
        >
          {expanded ? '↑' : '↓'}
        </div>
      </button>
      <div
        className={clsx(
          'grid transition-all duration-300 ease-in-out',
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className='overflow-hidden'>
          <div className='-mt-2 rounded p-3 px-2'>
            <div className='text-sm font-normal leading-relaxed text-brand-gray-900 dark:text-gray-300'>
              {answer}
            </div>
          </div>
        </div>
      </div>
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
          className='mb-16 flex flex-col gap-4 text-xl font-medium leading-tight text-brand-gray-900 dark:text-white sm:text-[64px] sm:leading-tight'
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
