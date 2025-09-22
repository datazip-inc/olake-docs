import React from 'react'
import WorkflowHeader from './WorkflowHeader'
import LazyComponent from '../LazyComponent'

const WorkflowSection: React.FC = () => {
  return (
    <section className='bg-white py-16 dark:bg-gray-900 md:py-16'>
      <div className=''>
        <WorkflowHeader />
        <LazyComponent component='WorkflowDiagram' />
        <LazyComponent component='InfoBoxes' />
      </div>
    </section>
  )
}

export default WorkflowSection
