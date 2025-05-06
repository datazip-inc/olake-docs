import React from 'react'
import WorkflowHeader from './WorkflowHeader'
import WorkflowDiagram from './WorkflowDiagram'
import InfoBoxes from './InfoBoxes'

const WorkflowSection: React.FC = () => {
  return (
    <section className='bg-white py-16 dark:bg-white md:py-16'>
      <div className=''>
        <WorkflowHeader />
        <WorkflowDiagram />
        <InfoBoxes />
      </div>
    </section>
  )
}

export default WorkflowSection
