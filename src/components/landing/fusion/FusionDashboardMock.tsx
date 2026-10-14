import React from 'react'
import { cn } from '@site/src/lib/utils'
import { MockIcon, STROKE } from '../product/mock'

/**
 * The OLake Fusion "Run History" screen under the hero with the run-metrics card lifted over its
 * right edge, drawn at the design size (1018 px wide, 510 px showing) and scaled to fit. The card
 * reaches 75px past the screen, so the fade wraps both at 1093px. Where the page is too narrow for
 * the card to hang past the centred screen (below 1200px), the whole 1093px picture is fitted
 * instead. A picture of the product, hidden from assistive tech.
 */

const Icon = ({ name, ...rest }: React.ComponentProps<typeof MockIcon>) => (
  <MockIcon name={`fusion/${name}`} {...rest} />
)

const MUTED = 'text-[rgba(0,0,0,0.65)]'

/** A sidebar entry: icon, label and an optional trailing node. */
const NavItem = ({
  icon,
  label,
  trailing,
  className
}: {
  icon: string
  label: React.ReactNode
  trailing?: React.ReactNode
  className?: string
}) => (
  <div
    className={cn('flex h-[22.625px] w-full items-center justify-between p-[5.656px]', className)}
  >
    <span className='flex items-center gap-[6.363px]'>
      <Icon name={icon} w={14.1406} />
      <span className={cn('text-[9.9px] leading-[15.555px] whitespace-nowrap', MUTED)}>
        {label}
      </span>
    </span>
    {trailing}
  </div>
)

/** The caret drawn pointing right (the design rotates its down caret a quarter turn). */
const CaretRight = ({ name = 'dashboard-caret' }: { name?: string }) => (
  <span className='flex size-[11.313px] items-center justify-center'>
    <Icon name={name} w={11.3125} className='size-[11.313px] -rotate-90' />
  </span>
)

const STATUS = {
  success: {
    label: 'Success',
    icon: 'fusion/dashboard-status-success',
    className: 'bg-[#f6ffed] text-[#52c41a]',
    left: 103.23
  },
  running: {
    label: 'Running',
    icon: 'product/status-running',
    className: 'bg-[#fff7e6] text-[#fa8c16]',
    left: 103.93
  },
  failed: {
    label: 'Failed',
    icon: 'product/status-failed',
    className: 'bg-[#fff1f0] text-[#f5222d]',
    left: 108.18
  }
} as const

const RUNS: {
  id: string
  status: keyof typeof STATUS
  type: string
  start: string
  duration: string
}[] = [
  { id: '005/261', status: 'success', type: 'Minor', start: '11:15:00', duration: '25 Mins' },
  { id: '001/261', status: 'running', type: 'Major', start: '15:10:00', duration: '32 Mins' },
  { id: '004/261', status: 'failed', type: 'Major', start: '12:00:00', duration: '30 Mins' }
]

/** Header cells: the first sits at its left edge, the others are centred on their x. */
const COLUMNS: [string, number][] = [
  ['Status', 131.07],
  ['Type', 248.48],
  ['Start Time', 366.95],
  ['Duration', 497.07],
  ['Metrics', 615.98],
  ['Logs', 735.41]
]

const CELL =
  'absolute top-[19.81px] -translate-y-1/2 text-[9.898px] leading-[16.969px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'

const ViewButton = ({ left }: { left: number }) => (
  <span
    className='absolute top-[11.31px] flex w-[56.563px] items-center justify-center rounded-[2.828px] border-[0.707px] border-solid border-[#d9d9d9] bg-white px-[5.656px]'
    style={{ left }}
  >
    <span className='flex h-[16.969px] items-center text-[9.9px] leading-[15.555px] text-[rgba(0,0,0,0.88)]'>
      View
    </span>
  </span>
)

/** The run-metrics card. Values are right-aligned on a common edge, as the design sets them. */
const METRICS: {
  label: string
  value: string
  labelTop: number
  valueTop: number
}[] = [
  { label: 'Input Data Files', value: '06', labelTop: 108.9, valueTop: 107.43 },
  {
    label: 'Input Data Size',
    value: '35.9 GB',
    labelTop: 155.99,
    valueTop: 150.26
  },
  {
    label: 'Input Equality Delete Files',
    value: '01',
    labelTop: 203.08,
    valueTop: 200.26
  },
  {
    label: 'Output Data Files',
    value: '03',
    labelTop: 250.17,
    valueTop: 248.26
  },
  {
    label: 'Output Data Size',
    value: '28.9 GB',
    labelTop: 299.17,
    valueTop: 296.26
  }
]

function RunMetricsCard() {
  return (
    <div
      className={cn(
        'absolute top-[169.5px] left-[788.89px] h-[376px] w-[304px] overflow-hidden rounded-[11.773px] bg-[#fefefd] shadow-[0_0_13.98px_0_rgba(0,0,0,0.04)]',
        STROKE,
        'after:border-[0.736px] after:border-[#d5d5d5]'
      )}
    >
      <div className='absolute top-[28.7px] left-[19.87px] flex w-[228.1px] flex-col gap-[3.679px]'>
        <p className='text-[14.716px] leading-[20.603px] font-medium text-[rgba(0,0,0,0.88)]'>
          Run Metrics for <span className='text-[#193ae6]'>Run ID 005/261</span>
        </p>
        <p className='text-[11.773px] leading-normal text-[#1d1d1d]'>
          View run metrics for the last run 2 days ago
        </p>
      </div>
      {[82.41, 135.39, 188.37, 235.46, 282.55, 331.55].map((top) => (
        <span
          key={top}
          className='absolute left-0 block w-full border-0 border-t-[0.736px] border-solid border-[#d9d9d9]'
          style={{ top }}
        />
      ))}
      {METRICS.map((m) => (
        <React.Fragment key={m.label}>
          <span
            className='absolute left-[16.92px] text-[11.773px] leading-[17.659px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'
            style={{ top: m.labelTop }}
          >
            {m.label}
          </span>
          <span
            className='absolute right-[28.2px] text-[11.773px] leading-[20.603px] font-medium whitespace-nowrap text-[rgba(0,0,0,0.88)]'
            style={{ top: m.valueTop }}
          >
            {m.value}
          </span>
        </React.Fragment>
      ))}
    </div>
  )
}

export default function FusionDashboardMock() {
  return (
    <div
      aria-hidden='true'
      className='product-fit relative mx-auto [--fit-w:1093] min-[1200px]:[--fit-w:1018]'
      style={{ '--fit-h': 510 } as React.CSSProperties}
    >
      <div className='font-helvetica'>
        <div
          className='product-fade absolute top-0 left-0 h-[510px] w-[1093px]'
          style={{ '--fade-from': '328px', '--fade-to': '509.8px' } as React.CSSProperties}
        >
          <div
            className={cn(
              'absolute top-0 left-0 isolate h-[652px] w-[1018px] overflow-hidden rounded-[16px] bg-[#fefefd] shadow-[0_0_19px_0_rgba(0,0,0,0.04)]',
              STROKE,
              'after:z-10 after:border after:border-[#d5d5d5]'
            )}
          >
            {/* The app, offset as in the design by its own 0.7px frame */}
            <div className='absolute top-[-1.71px] left-[-1.77px] h-[724px] w-[1018.125px] bg-white'>
              {/* Run history */}
              <div className='absolute top-[67.17px] left-[197.97px] flex w-[247.461px] flex-col gap-[5.656px]'>
                <span className='flex items-center gap-[5.656px]'>
                  <span className='flex size-[11.313px] items-center justify-center'>
                    <Icon name='dashboard-caret' w={11.3125} className='-scale-y-100 -rotate-90' />
                  </span>
                  <span className={cn('text-[9.9px] leading-[15.555px]', MUTED)}>Back</span>
                </span>
                <span className='flex flex-col gap-[2.828px] text-[rgba(0,0,0,0.88)]'>
                  <span className='text-[14.141px] leading-[19.797px] font-medium whitespace-nowrap'>
                    Run History for <span className='text-[#193ae6]'>Orders_Table_Veridian</span>
                  </span>
                  <span className='text-[9.898px] leading-[15.555px]'>
                    View logs, runs &amp; performance metrics
                  </span>
                </span>
              </div>

              <div className='absolute top-[149.18px] left-[197.97px] flex w-[796.824px] flex-col gap-[16.969px]'>
                <div className='flex items-center gap-[16.969px]'>
                  <span className='flex h-[25.453px] w-[159.789px] overflow-hidden rounded-[4.242px] border-[0.707px] border-solid border-[#d9d9d9]'>
                    <span className='flex h-full min-w-px flex-1 items-center rounded-[4.242px] bg-white px-[8.484px] py-[2.828px] text-[9.898px] leading-[15.555px] text-[rgba(0,0,0,0.25)]'>
                      Search Run ID
                    </span>
                    <span className='flex h-full w-[22.625px] shrink-0 items-center justify-center border-0 border-l-[0.707px] border-solid border-[#d9d9d9] bg-white'>
                      <Icon name='dashboard-search' w={11.3125} />
                    </span>
                  </span>
                  <span className='flex items-center gap-[5.656px] text-[9.898px] leading-[14.141px] whitespace-nowrap'>
                    <span
                      className={cn(
                        'flex h-[25.453px] items-center rounded-[4.242px] border-[0.707px] border-solid border-[#d9d9d9] bg-[#f5f5f5] px-[8.484px]',
                        MUTED
                      )}
                    >
                      All Runs
                    </span>
                    <span className='flex h-[25.453px] items-center rounded-[4.242px] border-[0.707px] border-solid border-[#d9d9d9] p-[5.656px] text-[#575757]'>
                      Failed Runs
                    </span>
                  </span>
                </div>

                <div className='relative h-[159.789px] w-[796.824px] overflow-hidden rounded-[5.656px] border-[0.707px] border-solid border-[#e5e5e5] bg-white'>
                  <div
                    className={cn(
                      'absolute top-[-0.71px] left-[-0.71px] h-[33.938px] w-[796.824px] overflow-hidden border-[0.707px] border-solid border-[#d9d9d9] bg-[#fafafa] text-[8.484px] leading-[14.141px] font-medium whitespace-nowrap',
                      MUTED
                    )}
                  >
                    <span className='absolute top-[16.69px] left-[21.92px] -translate-y-1/2'>
                      Run ID
                    </span>
                    {COLUMNS.map(([label, x]) => (
                      <span
                        key={label}
                        className='absolute top-[16.69px] -translate-1/2'
                        style={{ left: x }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className='absolute top-[34.64px] left-[-0.71px] flex w-[796.824px] flex-col gap-[2.828px]'>
                    {RUNS.map((run) => {
                      const status = STATUS[run.status]
                      return (
                        <div
                          key={run.id}
                          className='relative h-[39.594px] w-full overflow-hidden border-0 border-b-[0.707px] border-solid border-[#d9d9d9] bg-white'
                        >
                          <span className={cn(CELL, 'left-[20.5px]')}>{run.id}</span>
                          <span className={cn(CELL, 'left-[237.56px]')}>{run.type}</span>
                          <span className={cn(CELL, 'left-[347.86px]')}>{run.start}</span>
                          <span className={cn(CELL, 'left-[479.37px]')}>{run.duration}</span>
                          <span
                            className={cn(
                              'absolute top-[12.02px] flex items-center gap-[2.828px] rounded-[14.141px] px-[5.656px] py-[0.707px] text-[8.484px] leading-[14.141px] font-medium whitespace-nowrap',
                              status.className
                            )}
                            style={{ left: status.left }}
                          >
                            <MockIcon name={status.icon} w={11.3125} />
                            {status.label}
                          </span>
                          <ViewButton left={588.96} />
                          <ViewButton left={709.15} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Breadcrumb bar */}
              <div className='absolute top-[-0.71px] left-[181px] h-[45.25px] w-[836.418px] overflow-hidden border-0 border-b-[0.707px] border-solid border-[#d9d9d9] bg-white'>
                <div className='absolute top-[17.68px] left-[16.97px] flex items-center text-[9.9px] leading-[15.555px] whitespace-nowrap text-[rgba(0,0,0,0.45)]'>
                  <span className='px-[2.828px]'>Optimisation</span>
                  <span className='px-[2.828px]'>/</span>
                  <span className='px-[2.828px]'>Tables</span>
                  <span className='px-[2.828px]'>/</span>
                  <span className='px-[2.828px] text-[rgba(0,0,0,0.88)]'>
                    Run Logs &lt;Table_Name&gt;
                  </span>
                </div>
              </div>

              {/* Sidebar */}
              <div className='absolute top-[-0.71px] left-[-0.71px] h-[724px] w-[181.707px] overflow-hidden border-0 border-r-[0.707px] border-solid border-[#d9d9d9] bg-white'>
                <div className='absolute top-[17.68px] left-[19.5px] flex w-[147.77px] items-center justify-between'>
                  <span className='text-[14.141px] leading-normal font-medium text-[#203fdd]'>
                    OLake
                  </span>
                  <Icon name='dashboard-sidebar-toggle' w={14.1406} />
                </div>

                <div className='absolute top-[57.2px] left-[19.5px] flex w-[147.77px] flex-col gap-[5.656px]'>
                  <span className='text-[8.484px] leading-[15.555px] font-medium text-[rgba(0,0,0,0.45)]'>
                    Services
                  </span>
                  <div className='flex w-full flex-col gap-[5.656px]'>
                    <NavItem
                      icon='dashboard-nav-ingestion'
                      label='Ingestion'
                      trailing={<CaretRight />}
                    />
                    <NavItem
                      icon='dashboard-nav-optimisation'
                      label={
                        <span className='flex items-center gap-[6.363px]'>
                          Optimisation
                          <span className='rounded-[14.141px] bg-[#f3f5fd] px-[5.656px] py-[0.707px] text-[8.48px] leading-[14.141px] font-medium text-[#193ae6]'>
                            New
                          </span>
                        </span>
                      }
                      trailing={<Icon name='dashboard-caret' w={11.3125} />}
                      className='rounded-[4.242px]'
                    />
                    <div className='flex w-full items-end gap-[14.141px] px-[11.313px] py-[5.656px]'>
                      <span className='block h-[67.168px] border-0 border-l-[0.707px] border-solid border-[#d9d9d9]' />
                      <div className='flex w-[115.953px] flex-col gap-[8.484px] text-[9.9px] leading-[15.555px] whitespace-nowrap'>
                        <span className='flex h-[16.969px] items-center gap-[6.363px] rounded-[4.242px] bg-[#f5f5f5] p-[5.656px] text-[rgba(0,0,0,0.88)]'>
                          <Icon name='dashboard-nav-tables' w={11.3125} />
                          Tables
                        </span>
                        <span
                          className={cn(
                            'flex h-[16.969px] items-center gap-[6.363px] p-[5.656px]',
                            MUTED
                          )}
                        >
                          <Icon name='dashboard-nav-catalogs' w={11.3125} />
                          Catalogs
                        </span>
                        <span
                          className={cn(
                            'flex h-[16.969px] items-center gap-[6.363px] p-[5.656px]',
                            MUTED
                          )}
                        >
                          <Icon name='dashboard-nav-compute' w={11.3125} />
                          Compute
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='absolute top-[229.7px] left-[19.5px] flex w-[147.77px] flex-col gap-[5.656px]'>
                  <span className='text-[8.484px] leading-[15.555px] font-medium text-[rgba(0,0,0,0.45)]'>
                    System
                  </span>
                  <div className='flex w-full flex-col gap-[5.656px]'>
                    <NavItem
                      icon='dashboard-nav-settings'
                      label='Settings'
                      trailing={<CaretRight name='dashboard-caret-system' />}
                    />
                    <NavItem
                      icon='dashboard-nav-help'
                      label='Help & Support'
                      trailing={<CaretRight name='dashboard-caret-system' />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RunMetricsCard />
        </div>
      </div>
    </div>
  )
}
