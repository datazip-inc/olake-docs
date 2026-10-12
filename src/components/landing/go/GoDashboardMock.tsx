import React from 'react'
import { cn } from '@site/src/lib/utils'
import { MockFit, MockIcon as Icon, STROKE } from './mock'

/**
 * The OLake Go "Jobs" screen under the hero, drawn at its design size (1018 × 471) and scaled to
 * fit. It is a picture of the product, so it is hidden from assistive tech; its lower half fades
 * into the page.
 */

const TABS = ['Active jobs', 'Inactive jobs', 'Saved jobs', 'Failed jobs']

const COLUMNS = [
  { label: 'Actions', className: 'w-[92.224px] text-center' },
  { label: 'Job Name', className: 'w-[139.131px]' },
  { label: 'Source', className: 'flex-1' },
  { label: 'Destination', className: 'w-[136.746px]' },
  { label: 'Last sync', className: 'flex-1' },
  { label: 'Last sync status', className: 'flex-1' }
]

/** The rows under the highlighted one; the last two sit in the fade. */
const ROWS = [
  {
    name: 'Table_name_test_3',
    source: 'MySQL',
    destination: 'Dropbox',
    lastSync: '2 days ago',
    status: 'Failed',
    opacity: 'opacity-70'
  },
  {
    name: 'Table_name_test_4',
    source: 'PostgreSQL',
    destination: 'Google Drive',
    lastSync: '1 day ago',
    status: 'Success',
    opacity: 'opacity-70'
  },
  {
    name: 'Table_name_test_5',
    source: 'MongoDB',
    destination: 'OneDrive',
    lastSync: '3 days ago',
    status: 'Pending',
    opacity: 'opacity-40'
  },
  {
    name: 'Table_name_test_6',
    source: 'SQLite',
    destination: 'Box',
    lastSync: '4 hours ago',
    status: 'Failed',
    opacity: 'opacity-40'
  }
]

const ROW_TEXT = 'whitespace-nowrap text-[11.782px] leading-[20.197px]'

export default function GoDashboardMock() {
  return (
    <MockFit width={1018} height={471} className='mx-auto' innerClassName='go-dashboard-fade'>
      <div
        className={cn(
          'relative h-[652px] w-[1018px] overflow-hidden rounded-[16px] bg-[#fefefd] shadow-[0_0_19px_0_rgba(0,0,0,0.04)]',
          STROKE,
          'after:z-10 after:border after:border-[#d5d5d5]'
        )}
      >
        {/* Page header */}
        <div className='absolute top-[20px] left-[88px] flex w-[865px] items-center justify-between'>
          <div className='flex w-[301px] flex-col gap-[4px]'>
            <div className='flex items-center gap-[10px]'>
              <Icon name='dashboard-git-commit' w={19.047} />
              <p className='text-[19.047px] leading-normal font-medium text-[#0a0a0a]'>Jobs</p>
            </div>
            <p className='text-[12px] leading-[17.46px] text-[rgba(0,0,0,0.45)]'>
              A list of all your jobs stacked at one place for you to see
            </p>
          </div>
          <span className='flex h-[31.745px] items-center justify-center gap-[6.349px] rounded-[6.349px] bg-[#0029ce] px-[12.698px] py-[3.175px]'>
            <Icon name='dashboard-plus' w={12.698} />
            <span className='text-[12.698px] leading-[19.047px] whitespace-nowrap text-[#f0f0f0]'>
              Create job
            </span>
          </span>
        </div>

        {/* Tabs */}
        <div className='absolute top-[83px] left-[50px] flex w-[1035px] items-start gap-[27.973px] border-0 border-b border-solid border-[#e3e3e3] bg-white px-[41.959px]'>
          {TABS.map((tab, i) => (
            <span
              key={tab}
              className={cn(
                'flex items-center justify-center py-[10.49px] text-[12.25px] leading-[16.811px] whitespace-nowrap',
                i === 0
                  ? 'border-0 border-b-[1.748px] border-solid border-[#203fdd] font-medium text-[#203fdd]'
                  : 'text-[rgba(0,0,0,0.88)]'
              )}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Jobs table */}
        <div
          className={cn(
            'absolute top-[165px] left-[89px] h-[496.103px] w-[865px] overflow-hidden rounded-[6.36px] bg-white',
            STROKE,
            'after:border-[0.795px] after:border-[#e5e5e5]'
          )}
        >
          <div className='absolute top-0 left-0 flex w-[865px] items-center border-0 border-b-[0.795px] border-solid border-[#c4c4c4]'>
            <div className='flex flex-1 items-center gap-[9.54px] border-0 border-y-[0.795px] border-r-[0.795px] border-solid border-[#f0f0f0] bg-[rgba(0,0,0,0.02)] p-[12.721px] text-[11.131px] leading-[17.491px] font-medium text-[rgba(0,0,0,0.88)]'>
              {COLUMNS.map((col) => (
                <span key={col.label} className={cn('min-w-px', col.className)}>
                  {col.label}
                </span>
              ))}
            </div>
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.name}
              className={cn('absolute left-0 h-[38px] w-[865px]', row.opacity)}
              style={{ top: `${142.25 + i * 49.71}px` }}
            >
              <Icon
                name='dashboard-row-actions'
                w={69.008}
                h={20.408}
                className='absolute top-0 left-[22.93px]'
              />
              <span
                className={cn(
                  'absolute top-[10.5px] left-[115.66px] -translate-y-1/2 text-[rgba(0,0,0,0.88)]',
                  ROW_TEXT
                )}
              >
                {row.name}
              </span>
              <span className='absolute top-0 left-[260.03px] flex items-center'>
                <Icon name='dashboard-row-source' w={20.197} />
                <span className={cn('text-black', ROW_TEXT)}>{row.source}</span>
              </span>
              <span className='absolute top-0 left-[415.92px] flex items-center gap-[8.416px]'>
                <Icon name='dashboard-row-destination' w={16.831} />
                <span className={cn('text-black', ROW_TEXT)}>{row.destination}</span>
              </span>
              <span
                className={cn(
                  'absolute top-[10.5px] left-[558.62px] -translate-y-1/2 text-[rgba(0,0,0,0.88)]',
                  ROW_TEXT
                )}
              >
                {row.lastSync}
              </span>
              <span className='absolute top-[-0.96px] left-[724.77px] flex items-center gap-[3.691px] rounded-[3.691px] bg-[#f6ffed] px-[7.382px] py-[0.923px]'>
                <Icon name='dashboard-row-check' w={11.073} />
                <span className='text-[11.073px] leading-[18.455px] whitespace-nowrap text-[#389e0d]'>
                  {row.status}
                </span>
              </span>
              <span className='absolute top-[37px] left-0 block w-[865px] border-0 border-t-[0.795px] border-solid border-[#e5e5e5]' />
            </div>
          ))}
        </div>

        {/* The highlighted job, lifted over the table */}
        <div
          className={cn(
            'absolute top-[227px] left-[75px] h-[62px] w-[895px] overflow-hidden rounded-[12px] bg-white shadow-[0_2px_3px_0_rgba(0,0,0,0.04)]',
            STROKE,
            'after:border after:border-[#e8e8e8]'
          )}
        >
          <Icon
            name='dashboard-highlight-actions'
            w={13.27}
            h={1.99}
            className='absolute top-[29.23px] left-[62.37px]'
          />
          <span className='absolute top-[30.5px] left-[129.16px] -translate-y-1/2 text-[12.385px] leading-[21.232px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
            Table_name_test_1
          </span>
          <span className='absolute top-[19.5px] left-[270.59px] flex h-[22px] w-[78.432px] items-center'>
            <Icon name='dashboard-highlight-source' w={21.232} />
            <span className='text-[12.385px] leading-[21.232px] whitespace-nowrap text-black'>
              MongoDB
            </span>
          </span>
          <span className='absolute top-[19.5px] left-[426.68px] flex h-[22px] w-[90.34px] items-center gap-[8.847px]'>
            <Icon name='dashboard-highlight-destination' w={17.693} />
            <span className='text-[12.385px] leading-[21.232px] whitespace-nowrap text-black'>
              Amazon S3
            </span>
          </span>
          <span className='absolute top-[30.5px] left-[570.33px] -translate-y-1/2 text-[12.385px] leading-[21.232px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
            21 hours ago
          </span>
          <span className='absolute top-[20.38px] left-[732.14px] flex h-[20.469px] w-[69.009px] items-center gap-[3.539px] rounded-[3.539px] bg-[#f6ffed] px-[7.077px] py-[0.885px]'>
            <Icon name='dashboard-highlight-check' w={10.616} />
            <span className='text-[10.616px] leading-[17.693px] whitespace-nowrap text-[#52c41a]'>
              Success
            </span>
          </span>
        </div>

        {/* Navigation rail */}
        <div className='absolute top-[-1px] left-[-1px] h-[1024px] w-[59px] overflow-hidden border-0 border-r border-solid border-[#eaeaea] bg-white'>
          <div className='absolute top-[32.22px] left-[23.34px] flex w-[16.83px] flex-col items-center gap-[18px]'>
            <Icon name='dashboard-sidebar-toggle' w={15.972} />
            <div className='flex w-[20.364px] flex-col items-center gap-[20px]'>
              <span className='flex w-full items-center justify-center overflow-hidden rounded-[4.792px] bg-[#f5f5f5] p-[3.194px]'>
                <Icon name='dashboard-sidebar-jobs' w={15.972} />
              </span>
              <span className='flex w-full items-center overflow-hidden rounded-[4.792px] bg-white p-[3.194px]'>
                <Icon name='dashboard-sidebar-sparkle' w={13.976} />
              </span>
              <Icon name='dashboard-sidebar-settings' w={15.972} />
              <Icon name='dashboard-sidebar-help' w={15.972} />
            </div>
          </div>
        </div>
      </div>
    </MockFit>
  )
}
