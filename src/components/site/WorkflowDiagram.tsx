import React, { useEffect } from 'react'
import { PiPath, PiLinktreeLogo } from 'react-icons/pi'

// Workflow step configuration
interface WorkflowStep {
  label: string
  icon?: (isHighlighted: boolean) => React.ReactNode
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    label: 'Sources',
    icon: (isHighlighted) => <PiPath size={20} color={isHighlighted ? '#193AE6' : '#374151'} />
  },
  {
    label: 'OLake'
  },
  {
    label: 'Destinations',
    icon: (isHighlighted) => (
      <PiLinktreeLogo size={20} color={isHighlighted ? '#193AE6' : '#374151'} />
    )
  },
  {
    label: 'Iceberg Catalogs',
    icon: () => (
      <img src='/img/logo/iceberg.webp' alt='Iceberg' className='h-5 w-5 object-contain' />
    )
  },
  {
    label: 'Query Engines'
  }
]

// Pill component for workflow items
interface PillProps {
  icon?: React.ReactNode
  label: string
  isHighlighted?: boolean
}

const Pill: React.FC<PillProps> = ({ icon, label, isHighlighted = false }) => (
  <div
    className={`flex items-center gap-2 rounded-full px-4 py-1 transition-all duration-300 sm:px-6 sm:py-3 ${isHighlighted ? 'sm:bg-[#E4E8FF] sm:shadow-[0_0_0_8px_#f4f5fe]' : 'sm:bg-[#F3F3F3]'}`}
  >
    {icon && <span className='flex flex-shrink-0 items-center'>{icon}</span>}
    <span
      className={`whitespace-nowrap text-center font-space text-[12px] font-medium leading-[120%] tracking-[-0.05em] transition-colors duration-300 sm:text-base sm:leading-normal sm:tracking-normal ${isHighlighted ? 'text-primary-600' : 'text-brand-gray-400 sm:text-gray-700'}`}
    >
      {label}
    </span>
  </div>
)

// Connector line - supports horizontal and vertical with flow animation
interface ConnectorProps {
  direction?: 'horizontal' | 'vertical'
  connectorIndex: number
  highlightedIndex: number
}

const Connector: React.FC<ConnectorProps> = ({
  direction = 'horizontal',
  connectorIndex,
  highlightedIndex
}) => {
  const isFullyFilled = highlightedIndex > connectorIndex + 1
  const isAnimating = highlightedIndex === connectorIndex + 1
  const isActive = isFullyFilled || isAnimating

  const getTransitionClass = () => {
    if (highlightedIndex === 0) return ''
    if (isAnimating) return 'transition-transform duration-[800ms] ease-out'
    if (isFullyFilled) return ''
    return ''
  }

  const isHorizontal = direction === 'horizontal'

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-gray-200 ${
        isHorizontal ? 'h-[2px] w-[50px]' : 'h-6 w-[2px]'
      }`}
    >
      <div
        className={`from-brand-blue-500 to-brand-blue-400 absolute inset-0 bg-gradient-to-r ${
          isHorizontal ? 'origin-left' : 'origin-top'
        } ${getTransitionClass()} ${
          isActive
            ? isHorizontal
              ? 'scale-x-100'
              : 'scale-y-100'
            : isHorizontal
              ? 'scale-x-0'
              : 'scale-y-0'
        }`}
      />
    </div>
  )
}

// Renders the workflow pipeline (pills + connectors)
interface WorkflowPipelineProps {
  highlightedIndex: number
  direction: 'horizontal' | 'vertical'
  hideConnectors?: boolean
  pillRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>
  onStepClick?: (index: number) => void
}

const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({
  highlightedIndex,
  direction,
  hideConnectors = false,
  pillRefs,
  onStepClick
}) => (
  <>
    {WORKFLOW_STEPS.map((step, index) => (
      <React.Fragment key={step.label}>
        <div
          ref={(el) => {
            if (pillRefs) pillRefs.current[index] = el
          }}
          onClick={() => onStepClick?.(index)}
          className='cursor-pointer whitespace-nowrap'
        >
          <Pill
            icon={step.icon?.(highlightedIndex === index)}
            label={step.label}
            isHighlighted={highlightedIndex === index}
          />
        </div>
        {index < WORKFLOW_STEPS.length - 1 && !hideConnectors && (
          <Connector
            direction={direction}
            connectorIndex={index}
            highlightedIndex={highlightedIndex}
          />
        )}
      </React.Fragment>
    ))}
  </>
)

interface WorkflowDiagramProps {
  highlightedIndex?: number
  onStepClick?: (index: number) => void
}

const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({ highlightedIndex = 0, onStepClick }) => {
  const pillRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const mobileContainerRef = React.useRef<HTMLDivElement | null>(null)

  // Auto-scroll to highlighted pill on mobile only (horizontal scroll within container)
  useEffect(() => {
    const container = mobileContainerRef.current
    const highlightedPill = pillRefs.current[highlightedIndex]

    // Only scroll if on mobile (container is visible) and we have both refs
    if (container && highlightedPill && window.innerWidth < 640) {
      const containerRect = container.getBoundingClientRect()
      const pillRect = highlightedPill.getBoundingClientRect()

      // Calculate scroll position to center the pill
      const scrollLeft =
        pillRect.left -
        containerRect.left +
        container.scrollLeft -
        containerRect.width / 2 +
        pillRect.width / 2

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
    }
  }, [highlightedIndex])

  return (
    <div className='container mb-12 w-full overflow-hidden'>
      <div className='flex w-full justify-center'>
        <div className='relative mx-auto w-full max-w-6xl'>
          {/* Mobile (below sm): Horizontal layout without connectors */}
          <div
            ref={mobileContainerRef}
            className='flex items-center gap-4 overflow-x-auto py-8 sm:hidden'
          >
            <WorkflowPipeline
              highlightedIndex={highlightedIndex}
              direction='horizontal'
              hideConnectors
              pillRefs={pillRefs}
              onStepClick={onStepClick}
            />
          </div>

          {/* Tablet (sm to lg): Vertical stack */}
          <div className='hidden flex-col items-center py-8 sm:flex lg:hidden'>
            <WorkflowPipeline
              highlightedIndex={highlightedIndex}
              direction='vertical'
              onStepClick={onStepClick}
            />
          </div>

          {/* Desktop (lg+): Horizontal layout */}
          <div className='hidden items-center justify-center gap-0 py-8 lg:flex'>
            <WorkflowPipeline
              highlightedIndex={highlightedIndex}
              direction='horizontal'
              onStepClick={onStepClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkflowDiagram
