import React from 'react'
import WorkflowHeader from './WorkflowHeader'
import WorkflowDiagram from './WorkflowDiagram'
import InfoBoxes from './InfoBoxes'

const WorkflowSection: React.FC = () => {
  return (
    <section className='bg-white pt-6 pb-12 dark:bg-gray-900 md:pt-6 md:pb-12'>
      <div className=''>
        <WorkflowHeader />
        <WorkflowDiagram />
        <InfoBoxes />
      </div>
    </section>
  )
}

export default WorkflowSection
