import React from 'react'

interface WorkflowHeaderProps {
  subtitle?: string
  title?: React.ReactNode
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  subtitle = 'The Fundamental',
  title = (
    <>
      Experience the most <span className='font-light'>seamless</span> workflow
    </>
  )
}) => {
  return (
    <div className='mx-auto mb-16 text-center'>
      <h3 className='mb-4 text-xs font-medium text-[#193ae6] dark:text-blue-400 sm:text-xl'>
        {subtitle}
      </h3>
      <h2 className='text-xl font-medium tracking-tighter text-[#333333] dark:text-white sm:text-5xl'>
        {title}
      </h2>
    </div>
  )
}

export default WorkflowHeader
