import React, { useState, useEffect } from 'react'
import WorkflowHeader from './WorkflowHeader'
import LazyComponent from '../LazyComponent'

// Workflow items for cycling
const WORKFLOW_ITEMS = ['Sources', 'OLake', 'Destinations', 'Iceberg Catalogs', 'Query Engines']

const WorkflowSection: React.FC = () => {
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedIndex((prevIndex) => (prevIndex + 1) % WORKFLOW_ITEMS.length)
    }, 5000) // Change highlight every 5 seconds

    return () => clearInterval(interval)
  }, [highlightedIndex])

  return (
    <section className=' bg-white dark:bg-gray-900'>
      <div className=''>
        <WorkflowHeader />
        <LazyComponent
          component='WorkflowDiagram'
          highlightedIndex={highlightedIndex}
          onStepClick={setHighlightedIndex}
        />
        <LazyComponent component='InfoBoxes' highlightedIndex={highlightedIndex} />
      </div>
    </section>
  )
}

export default WorkflowSection
