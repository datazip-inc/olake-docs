import React from 'react'

interface WorkflowHeaderProps {
  subtitle?: string
  title?: React.ReactNode
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  subtitle = 'The Fundamental',
  title = (
    <>
      Experience the most <br className='hidden sm:block md:hidden lg:block' />
      <span className='font-light tracking-wide text-[#333333]'>seamless</span>{' '}
      workflow
    </>
  )
}) => {
  return (
    <div className='mx-auto mb-16 max-w-4xl text-center'>
      <h3 className='mb-4 text-lg font-medium text-[#193ae6] dark:text-blue-400'>{subtitle}</h3>
      <h2 className='text-4xl font-normal tracking-wide text-[#333333] dark:text-white sm:text-5xl md:text-6xl'>
        {title}
      </h2>
    </div>
  )
}

export default WorkflowHeader
