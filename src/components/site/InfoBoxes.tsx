import React, { useEffect } from 'react'
import clsx from 'clsx'
import { PiPath, PiLinktreeLogo } from 'react-icons/pi'

// Icon card component with white background and subtle shadow
const IconCard: React.FC<{ src: string; alt: string; className?: string }> = ({
  src,
  alt,
  className = ''
}) => (
  <div
    className={clsx(
      'absolute z-10 flex items-center justify-center rounded-lg border-2 border-white bg-white shadow-[0_0_26px_rgba(0,0,0,0.08)] md:rounded-xl',
      'h-10 w-10 md:h-16 md:w-16',
      className
    )}
  >
    <img
      src={src}
      alt={alt}
      loading='lazy'
      decoding='async'
      className='h-6 w-6 object-contain md:h-10 md:w-10'
    />
  </div>
)

// Step 0: Sources content
const SourcesContent: React.FC = () => (
  <div className='relative flex w-full flex-col items-center justify-center overflow-hidden px-2 pb-16 pt-8 xl:flex-row'>
    {/* Text content - positioned absolutely on desktop, stacked below on mobile */}
    <div className='relative z-20 order-2 mt-8 w-full space-y-2 px-4 xl:absolute xl:left-28 xl:top-8 xl:order-1 xl:mt-0 xl:w-auto xl:space-y-6 xl:px-0'>
      {/* Sources header */}
      <div className='flex items-center gap-2'>
        <PiPath size={20} color='#193AE6' />
        <h3 className='m-0 font-medium text-primary-600'>Sources</h3>
      </div>

      {/* Main heading */}
      <h3 className='m-0 text-xl font-medium leading-tight text-gray-900 lg:text-3xl'>
        <div>High-throughput ingestion to</div>
        <div>S3/Iceberg without</div>
        <div>overloading the source.</div>
      </h3>
      <div className='mt-4 h-px w-3/5 bg-neutral-200' />
      {/* Sync Modes section */}
      <div>
        <p className='m-0 text-[8px] font-medium tracking-wide text-brand-gray-900 lg:text-sm'>
          Sync Modes
        </p>
        <p className='m-0 mt-1 max-w-48 text-sm font-semibold text-brand-gray-900 lg:text-2xl'>
          CDC, Full Load & Incremental
        </p>
      </div>
    </div>

    {/* Sources illustration - scales automatically */}
    <div className='relative order-1 w-full max-w-4xl xl:order-2 xl:ml-10'>
      <img
        src='/img/sources.svg'
        alt='OLake Sources - MongoDB, PostgreSQL, MySQL, Kafka, Oracle'
        loading='lazy'
        decoding='async'
        className='h-auto w-full object-contain'
      />
    </div>
  </div>
)

// Step 1: OLake content
const OLakeContent: React.FC = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Center the scroll view on mount
    if (scrollRef.current) {
      scrollRef.current.scrollLeft =
        (scrollRef.current.scrollWidth - scrollRef.current.clientWidth) / 2
    }
  }, [])

  return (
    <div ref={scrollRef} className='relative w-full overflow-x-auto xl:overflow-x-visible'>
      {/* Scrollable wrapper for mobile - content takes its natural width */}
      <div className='min-w-[1400px] xl:min-w-0'>
        <div className='relative flex min-h-[500px] w-full items-center justify-center overflow-hidden px-4 py-16 sm:px-6'>
          {/* Container for the diagram */}
          <div className='relative z-100 flex h-[400px] w-full max-w-6xl items-center justify-center'>
            {/* SVG Connector layer */}
            <svg
              className='pointer-events-none absolute inset-0 z-20 h-full w-full'
              viewBox='0 0 1000 400'
              preserveAspectRatio='xMidYMid meet'
            >
              <defs>
                <marker
                  id='dot-blue'
                  viewBox='0 0 10 10'
                  refX='5'
                  refY='5'
                  markerWidth='6'
                  markerHeight='6'
                >
                  <rect x='2' y='2' width='6' height='6' fill='#203FDD' />
                </marker>
              </defs>

              {/* Left Branch - To 'O' (Top-Left) */}
              <path
                d='M 190 260 L 290 260 L 325 225'
                fill='none'
                stroke='#203FDD'
                strokeWidth='1.5'
                markerEnd='url(#dot-blue)'
              />

              {/* Top Right Branch - To 'k' (Top) */}
              <path
                d='M 770 100 L 630 100 L 590 140'
                fill='none'
                stroke='#203FDD'
                strokeWidth='1.5'
                markerEnd='url(#dot-blue)'
              />

              {/* Bottom Right Branch - To 'e' (Bottom) */}
              <path
                d='M 840 300 L 700 300 L 645 240'
                fill='none'
                stroke='#203FDD'
                strokeWidth='1.5'
                markerEnd='url(#dot-blue)'
              />
            </svg>

            {/* Center Content: OLake */}
            <div className='relative z-10 flex flex-col items-center justify-center bg-white/80 px-4 backdrop-blur-sm md:px-0'>
              <div className='select-none bg-[linear-gradient(142.87deg,#203FDD_33.99%,#009FEE_133.5%)] bg-clip-text text-center text-[100px] font-bold leading-[100px] text-transparent md:text-[120px] md:leading-[140px]'>
                OLake
              </div>
              <div className='-mt-2 text-center text-[24px] font-normal leading-tight text-[#606060] md:text-[32px]'>
                Managed Lakehouse
              </div>
            </div>

            {/* Left Text Block */}
            <div className='absolute left-[3%] top-3/4 max-w-[220px] -translate-y-1/2 text-right'>
              <p className='font-space text-sm font-medium leading-[120%] tracking-[-0.05em] text-brand-gray-900 sm:text-xl'>
                Effortlessly integrate with data sources, featuring adaptive schema migration and
                zero downtime.
              </p>
            </div>

            {/* Top Right Text Block */}
            <div className='absolute right-[5%] top-[20%] max-w-[240px] text-left'>
              <p className='font-space text-sm font-medium leading-[120%] tracking-[-0.05em] text-brand-gray-900 sm:text-xl'>
                Quickly connect to data sources seamlessly.
              </p>
            </div>

            {/* Bottom Right Text Block */}
            <div className='absolute -right-[7%] bottom-[12%] max-w-[300px] text-left'>
              <p className='font-space text-sm font-medium leading-[120%] tracking-[-0.05em] text-brand-gray-900 sm:text-xl'>
                Achieve lightning-fast data replication from sources with sub-second latency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 2: Destinations content (placeholder)
const DestinationsContent: React.FC = () => (
  <div className='relative flex min-h-[400px] w-full flex-col items-center justify-center px-4 sm:flex-row sm:px-6'>
    {/* Image - first on mobile, left on desktop */}
    <div className='order-1 w-full sm:order-1 sm:w-auto'>
      <img
        src='/img/site/olake-destinations.svg'
        alt='olake-destinations'
        loading='lazy'
        decoding='async'
        className='h-auto w-full object-contain'
      />
    </div>
    {/* Content - below image on mobile, right on desktop */}
    <div className='order-2 mt-6 w-full sm:order-2 sm:mt-0 sm:w-auto'>
      <div className='flex items-center gap-x-2 font-medium text-primary-600'>
        <PiLinktreeLogo className='size-5 sm:size-7' />
        <h3 className='m-0 text-lg sm:text-2xl'>Destinations</h3>
      </div>
      <h3 className='m-0 mt-2 text-xl font-medium tracking-tighter text-brand-gray-900 sm:text-[32px]'>
        <div>
          <span className='font-bold'>Sync</span> data from sources to
        </div>
        <div>Iceberg or S3</div>
      </h3>
      <div className='mt-4 space-y-1 border-l-0 border-r-0 border-solid py-4 text-xs text-brand-gray-900 sm:mt-8 sm:space-y-2 sm:py-8 sm:text-sm'>
        <h4 className='m-0 text-base font-bold sm:text-lg'>S3</h4>
        <div>
          <div>Fast landing for raw replication and downstream transforms.</div>
          <div>Optimized file sizing + multipart uploads.</div>
        </div>
      </div>
      <div className='space-y-1 border-l-0 border-r-0 border-t-0 border-solid py-4 text-xs text-brand-gray-900 sm:space-y-2 sm:py-8 sm:text-sm'>
        <h4 className='m-0 text-base font-bold sm:text-lg'>Apache Iceberg</h4>
        <div>
          <div>Table-managed writes for governed analytics: snapshots, partitions,</div>
          <div>schema evolution, and upserts/deletes (when enabled).</div>
        </div>
      </div>
    </div>
  </div>
)

// Catalog item component
const CatalogItem: React.FC<{ src: string; alt: string; label: string }> = ({
  src,
  alt,
  label
}) => (
  <div className='flex w-[180px] items-center justify-center gap-x-2 rounded-xl px-4 py-4 shadow-[2px_3px_20px_1px_#00000014]'>
    <img
      src={src}
      alt={alt}
      loading='lazy'
      decoding='async'
      className={label === 'Rest Catalog' ? 'h-[18px] w-[24px]' : 'size-[18px]'}
    />
    {label}
  </div>
)

// Step 3: Iceberg Catalogs content
const IcebergCatalogsContent: React.FC = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Center the scroll view on mount
    if (scrollRef.current) {
      scrollRef.current.scrollLeft =
        (scrollRef.current.scrollWidth - scrollRef.current.clientWidth) / 2
    }
  }, [])

  return (
    <div ref={scrollRef} className='relative w-full overflow-x-auto xl:overflow-x-visible'>
      {/* Scrollable wrapper for mobile - content takes its natural width */}
      <div className='min-w-[1400px] xl:min-w-0'>
        <div className='relative flex min-h-[550px] w-full items-center justify-center overflow-hidden px-4 py-8 text-brand-gray-900 sm:px-6'>
          {/* Container for the diagram */}
          <div className='relative z-100 flex w-full max-w-7xl items-center justify-center'>
            {/* SVG Connector layer */}
            <svg
              className='pointer-events-none absolute inset-0 z-20 h-full w-full'
              viewBox='0 0 1000 450'
              preserveAspectRatio='xMidYMid meet'
            >
              <defs>
                <marker
                  id='dot-gray'
                  viewBox='0 0 10 10'
                  refX='5'
                  refY='5'
                  markerWidth='6'
                  markerHeight='6'
                >
                  <rect x='2' y='2' width='6' height='6' fill='#9CA3AF' />
                </marker>
              </defs>

              {/* Hive Branch (Left to 2nd Item) */}
              <path
                d='M 210 170 L 390 170 L 420 215'
                fill='none'
                stroke='#9CA3AF'
                strokeWidth='1'
                markerEnd='url(#dot-gray)'
              />

              {/* Rest Catalog Branch (Left to 3rd Item) */}
              <path
                d='M 210 380 L 380 380 L 420 310'
                fill='none'
                stroke='#9CA3AF'
                strokeWidth='1'
                markerEnd='url(#dot-gray)'
              />

              {/* AWS Glue Branch (Right to 1st Item) */}
              <path
                d='M 810 140 L 620 140 L 580 170'
                fill='none'
                stroke='#9CA3AF'
                strokeWidth='1'
                markerEnd='url(#dot-gray)'
              />

              {/* JDBC Branch (Right to 4th Item) */}
              <path
                d='M 810 400 L 620 400 L 580 370'
                fill='none'
                stroke='#9CA3AF'
                strokeWidth='1'
                markerEnd='url(#dot-gray)'
              />
            </svg>

            {/* Main Header (Top Left) */}
            <div className='absolute -left-10 -top-10'>
              <h4 className='m-0 mb-2 font-medium text-primary-600'>Catalogs</h4>
              <p className='font-space font-bold leading-tight text-brand-gray-900'>
                Use the catalog your platform already runs: OLake writes
                <br />
                tables that your engines can read consistently.
              </p>
            </div>

            {/* Hive Description (Left) */}
            <div className='absolute left-[7%] top-[40%] max-w-[280px] -translate-y-1/2 text-right'>
              <p className='text-xs leading-relaxed text-brand-gray-900'>
                The classic metastore used with Apache Hive to manage table schemas and partitions.
                <br />A solid old-timer—reliable, widely supported, and still doing its job without
                drama.
              </p>
            </div>

            {/* Rest Catalog Description (Bottom Left) */}
            <div className='absolute bottom-0 left-[7%] max-w-[280px] text-right'>
              <p className='text-xs leading-relaxed text-brand-gray-900'>
                A catalog exposed over REST APIs for flexible, decoupled metadata access.
                <br />
                Great for modern architectures where services talk over APIs, not handshakes.
              </p>
            </div>

            {/* Center Content: Catalog Box */}
            <div className='relative z-10 rounded-[36px] border-solid border-[#E3E3E3] bg-zinc-50 px-6 py-8 shadow-[0_0_0_10px_#00000008]'>
              <div className='mb-8 mt-4 flex items-center justify-center gap-x-2'>
                <img
                  src='/img/logo/iceberg.webp'
                  alt='iceberg'
                  loading='lazy'
                  decoding='async'
                  className='size-6'
                />
                <div className='font-medium'>Iceberg catalogs</div>
              </div>
              <div className='space-y-4 font-helvetica text-sm font-medium text-[#343434]'>
                <CatalogItem src='/img/logo/glue.webp' alt='aws' label='AWS Glue' />
                <CatalogItem src='/img/logo/hive.webp' alt='hive' label='Hive' />
                <CatalogItem src='/img/logo/rest.webp' alt='rest' label='Rest Catalog' />
                <CatalogItem src='/img/logo/jdbc.webp' alt='jdbc' label='JDBC' />
              </div>
            </div>

            {/* AWS Glue Description (Top Right) */}
            <div className='absolute right-[6%] top-[18%] max-w-[280px] text-left'>
              <p className='text-xs leading-relaxed text-brand-gray-900'>
                A fully managed data catalog from AWS that automatically discovers and organizes
                metadata.
                <br />
                Perfect if your data lives on AWS and you like things to "just work" without
                babysitting.
              </p>
            </div>

            {/* JDBC Description (Bottom Right) */}
            <div className='absolute bottom-0 right-[6%] max-w-[280px] text-left'>
              <p className='text-xs leading-relaxed text-brand-gray-900'>
                Connects to external databases using standard JDBC interfaces as a catalog source.
                <br />
                Ideal when your metadata lives in relational databases and you want plug-and-play
                access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 4: Query Engines content (placeholder)
const QueryEnginesContent: React.FC = () => (
  <div className='mx-auto flex min-h-[400px] w-full flex-col items-center justify-center gap-6 px-4 py-10 md:px-16 xl:flex-row xl:items-start xl:gap-x-24 xl:px-6'>
    <img
      src='/img/site/query-engines.svg'
      alt='query-engines'
      loading='lazy'
      decoding='async'
      className='order-1 h-auto w-auto max-w-[60%] object-contain xl:order-1 xl:w-auto'
    />
    <div className='order-2 w-full xl:order-2 xl:w-auto'>
      <h3 className='m-0 text-lg font-medium leading-relaxed tracking-tighter text-primary-600 lg:text-xl xl:mt-16'>
        Query Engines
      </h3>
      <div className='mt-2 text-xs font-normal lg:text-base'>
        <div>
          Seamlessly connect with a wide range of query engines to
          <div>analyze your data wherever it lives.</div>
        </div>
        <div className='mt-4'>
          <div>From large-scale distributed processing to fast, interactive</div>
          <div>analytics, choose the engine that fits your workload, no</div>
          <div>lock-in, no compromises (and no existential SQL crises).</div>
        </div>
        <div className='mt-4 font-bold'>Works with Iceberg-compatible engines</div>
      </div>
    </div>
  </div>
)

// Array of step components
const STEP_COMPONENTS = [
  SourcesContent,
  OLakeContent,
  DestinationsContent,
  IcebergCatalogsContent,
  QueryEnginesContent
]

interface InfoBoxesProps {
  highlightedIndex?: number
}

const InfoBoxes: React.FC<InfoBoxesProps> = ({ highlightedIndex = 0 }) => {
  const StepComponent = STEP_COMPONENTS[highlightedIndex] || STEP_COMPONENTS[0]

  return (
    <div className='min-h-screen w-full xl:min-h-[70vh]'>
      <StepComponent />
    </div>
  )
}

export default InfoBoxes
