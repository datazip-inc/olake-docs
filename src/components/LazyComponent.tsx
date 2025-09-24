import React, { Suspense, lazy, ComponentType, useEffect, useRef, useState } from 'react'

// Define component types for better type safety
type LazyComponentName =
  | 'BlogShowcase'
  | 'BenchmarkSection'
  | 'FeatureShowcase'
  | 'IcebergHero'
  | 'WorkflowDiagram'
  | 'InfoBoxes'
  | 'SetupStepsSection'
  | 'RegistrationSection'
  | 'Glace'
  | 'WebinarGrid'
  | 'ActiveContributors'

// Lazy load heavy components with error handling
const createLazyComponent = (importFn: () => Promise<{ default: ComponentType<any> }>) => {
  return lazy(() =>
    importFn().catch((error) => {
      console.error('Failed to load component:', error)
      // Return a fallback component
      return {
        default: () => (
          <div className='flex items-center justify-center p-8 text-red-500'>
            <div className='text-center'>
              <div className='mb-2 text-lg font-semibold'>Component Failed to Load</div>
              <div className='text-sm'>Please refresh the page to try again</div>
            </div>
          </div>
        )
      }
    })
  )
}

const BlogShowcase = createLazyComponent(() => import('./site/BlogShowcase'))
const BenchmarkSection = createLazyComponent(() => import('./site/BenchmarkSection'))
const FeatureShowcase = createLazyComponent(() => import('./site/FeatureShowcase'))
const IcebergHero = createLazyComponent(() => import('./site/IcebergHero'))
const WorkflowDiagram = createLazyComponent(() => import('./site/WorkflowDiagram'))
const InfoBoxes = createLazyComponent(() => import('./site/InfoBoxes'))
const SetupStepsSection = createLazyComponent(() => import('./site/SetupStepsSection'))
const RegistrationSection = createLazyComponent(() => import('./site/RegistrationSection'))
const Glace = createLazyComponent(() => import('./site/Glace'))
const WebinarGrid = createLazyComponent(() => import('./webinars/WebinarGrid'))
const ActiveContributors = createLazyComponent(
  () => import('./community/improved/ActiveContributors')
)

// Loading fallback component
const LoadingFallback: React.FC<{ componentName: string; minHeight?: number }> = ({ componentName, minHeight = 200 }) => (
  <div className='flex items-center justify-center p-8' style={{ minHeight }}>
    <div className='flex w-full animate-pulse space-x-4'>
      <div className='h-10 w-10 rounded-full bg-gray-300'></div>
      <div className='flex-1 space-y-2 py-1'>
        <div className='h-4 w-3/4 rounded bg-gray-300'></div>
        <div className='space-y-2'>
          <div className='h-4 rounded bg-gray-300'></div>
          <div className='h-4 w-5/6 rounded bg-gray-300'></div>
        </div>
      </div>
    </div>
  </div>
)

// Component mapping for type safety
const COMPONENT_MAP: Record<LazyComponentName, ComponentType<any>> = {
  BlogShowcase,
  BenchmarkSection,
  FeatureShowcase,
  IcebergHero,
  WorkflowDiagram,
  InfoBoxes,
  SetupStepsSection,
  RegistrationSection,
  Glace,
  WebinarGrid,
  ActiveContributors
} as const

// Lazy component wrapper
interface LazyComponentProps {
  component: LazyComponentName
  fallback?: React.ReactNode
  /** IntersectionObserver root margin (e.g., '200px') */
  rootMargin?: string
  /** IntersectionObserver threshold */
  threshold?: number
  /** Placeholder min height before component loads */
  placeholderMinHeight?: number
  [key: string]: any
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  component,
  fallback,
  rootMargin = '200px',
  threshold = 0,
  placeholderMinHeight = 200,
  ...props
}) => {
  const LazyComponent = COMPONENT_MAP[component]

  if (!LazyComponent) {
    console.warn(`Unknown lazy component: ${component}`)
    return (
      <div className='flex items-center justify-center p-8 text-yellow-600'>
        <div className='text-center'>
          <div className='mb-2 text-lg font-semibold'>Component Not Found</div>
          <div className='text-sm'>Component "{component}" is not available</div>
        </div>
      </div>
    )
  }

  // Defer mount until near viewport
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) return
    const element = containerRef.current
    if (!element || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { root: null, rootMargin, threshold }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [isVisible, rootMargin, threshold])

  return (
    <div ref={containerRef}>
      {isVisible ? (
        <Suspense fallback={fallback || <LoadingFallback componentName={component} minHeight={placeholderMinHeight} />}>
          <LazyComponent {...props} />
        </Suspense>
      ) : (
        fallback || <LoadingFallback componentName={component} minHeight={placeholderMinHeight} />
      )}
    </div>
  )
}

export default LazyComponent
