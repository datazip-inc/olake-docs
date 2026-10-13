import React from 'react'
import { cn } from '@site/src/lib/utils'
import { MockFit, MockIcon as Icon, MockRail, STROKE } from '../product/mock'

/**
 * The job editor inside the blue feature card: the stream list, the selected stream's settings and
 * the "Sync mode" picker floating over them. Drawn at its design size (514 × 438) and scaled to fit;
 * a picture of the product, hidden from assistive tech.
 */

/** Stream rows under the selected one, with their heights in the design (they alternate 25 and 26px). */
const STREAMS: [string, number][] = [
  ['_airbyte_destination_state_airbyte_destinati...', 25],
  ['public_raw_stream', 26],
  ['private_encrypted_stream', 25],
  ['real_time_data_feed', 25],
  ['archived_data_storage', 26],
  ['cloud_backup_service', 26],
  ['real_time_analysis', 26],
  ['user_access_management', 26],
  ['data_encryption_protocol', 26],
  ['version_control_system', 26],
  ['compliance_tracking_tool', 26],
  ['automated_report_generation', 26]
]

const SEGMENTS = [
  { label: 'Config', icon: 'feature-mock-tab-config' },
  { label: 'Schema', icon: 'feature-mock-tab-schema' },
  { label: 'Partitioning', icon: 'feature-mock-tab-partitioning' }
]

/** The design's radio: a 9.2px circle, its label at the size the design renders it (8.07px). */
const Radio = ({ label, checked }: { label: string; checked?: boolean }) => (
  <span className='flex items-center'>
    <span className='py-[1.73px]'>
      <span
        className={cn(
          'relative block size-[9.225px] overflow-hidden rounded-full border-[0.577px] border-solid bg-white',
          checked ? 'border-[#203fdd]' : 'border-[#d9d9d9]'
        )}
      >
        {checked && (
          <span className='absolute top-[1.73px] left-[1.73px] block size-[4.613px] rounded-full bg-[#203fdd]' />
        )}
      </span>
    </span>
    <span className='px-[4.613px] text-[8.07px] leading-[12.7px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
      {label}
    </span>
  </span>
)

export default function GoFeatureMock({ className }: { className?: string }) {
  return (
    <MockFit width={514} height={438} className={className}>
      {/* The editor panel */}
      <div
        className={cn(
          'absolute top-0 left-0 h-[437.4px] w-[507px] overflow-hidden rounded-[10.822px] bg-[#fefefd] shadow-[0_0_12.851px_0_rgba(0,0,0,0.04)]',
          STROKE,
          'after:z-10 after:border-[0.676px] after:border-[#d5d5d5]'
        )}
      >
        <span className='absolute top-[52.32px] left-[38.8px] block w-[467px] border-0 border-t-[0.7px] border-solid border-[#d9d9d9]' />

        {/* Streams, dimmed behind the selected one */}
        <div className='absolute top-[90.32px] left-[38.32px] flex w-[240px] flex-col gap-[4px] opacity-20'>
          {STREAMS.map(([name, height]) => (
            <div
              key={name}
              className='flex items-center border-0 border-b-[0.469px] border-solid border-[#e0e0e0] px-[16px]'
              style={{ height }}
            >
              <span className='block size-[7.512px] shrink-0 rounded-[1.878px] border-[0.469px] border-solid border-[#d9d9d9] bg-white' />
              <span className='truncate px-[3.756px] text-[8px] leading-[9.39px] text-black'>
                {name}
              </span>
            </div>
          ))}
        </div>

        <span className='absolute top-[52px] left-[277.8px] block h-[385px] border-0 border-l-[0.7px] border-solid border-[#d9d9d9]' />

        {/* Search and destination */}
        <div className='absolute top-[18.32px] left-[47.32px] flex items-center gap-[9px] opacity-50'>
          <div className='flex h-[17px] w-[276px] overflow-hidden rounded-[2.841px] border-[0.474px] border-solid border-[#d9d9d9]'>
            <div className='flex h-full min-w-px flex-1 items-center rounded-[2.841px] bg-white px-[5.683px] py-[1.894px]'>
              <span className='text-[6.63px] leading-[10.418px] text-[rgba(0,0,0,0.25)]'>
                Search streams
              </span>
            </div>
            <div className='flex h-full w-[15.154px] shrink-0 items-center justify-center border-0 border-l-[0.474px] border-solid border-[#d9d9d9] bg-white'>
              <Icon name='go/feature-mock-search' w={7.57688} />
            </div>
          </div>
          <div className='relative h-[17.048px] w-[154.852px] overflow-hidden rounded-[2.841px] border-[0.474px] border-solid border-[#d9d9d9] bg-white'>
            <span className='absolute top-[0.47px] left-[66.77px] text-[6.63px] leading-[15.154px] whitespace-nowrap text-black'>
              Postgres_Retail / Sales
            </span>
            <span className='absolute top-[0.47px] left-[4.73px] text-[6.63px] leading-[15.154px] font-medium whitespace-nowrap text-black'>
              DestinationDB
            </span>
            <Icon
              name='go/feature-mock-pencil'
              w={7.57688}
              className='absolute top-[4.26px] left-[141.59px]'
            />
          </div>
        </div>

        {/* The selected stream */}
        <div
          className={cn(
            'absolute top-[61.32px] left-[55.25px] h-[26px] w-[206.143px] overflow-hidden rounded-[5.571px] bg-white',
            STROKE,
            'after:border-[0.838px] after:border-[#d9d9d9]'
          )}
        >
          <span className='absolute top-[3.74px] left-[7.01px] flex items-center'>
            <span className='py-[2.148px]'>
              <Icon name='go/feature-mock-checkbox' w={11.4562} />
            </span>
            <span className='px-[5.728px] text-[10px] leading-[14.6px] text-[rgba(0,0,0,0.88)]'>
              Payments
            </span>
          </span>
        </div>

        {/* The stream's settings */}
        <div className='absolute top-[61.32px] left-[288.32px] flex w-[204px] flex-col gap-[6.541px] opacity-50'>
          <p className='text-[6.541px] leading-[9.812px] font-medium text-black'>Payments</p>
          <div className='flex h-[13.082px] items-center rounded-[2.453px] bg-[#f5f5f5] p-[0.818px]'>
            {SEGMENTS.map((segment, i) => (
              <span
                key={segment.label}
                className={cn(
                  'flex h-[11.447px] min-w-px flex-1 items-center justify-center gap-[1.635px] rounded-[1.635px] px-[4.906px]',
                  i === 0 &&
                    'border-[0.409px] border-solid border-[#203fdd] bg-white shadow-[0_0.818px_0.818px_rgba(0,0,0,0.02),0_0.409px_1.226px_rgba(0,0,0,0.02),0_0.409px_0.409px_rgba(0,0,0,0.03)]'
                )}
              >
                <Icon name={`go/${segment.icon}`} w={6.54108} />
                <span
                  className={cn(
                    'truncate text-[5.723px] leading-[8.994px]',
                    i === 0 ? 'text-[#203fdd]' : 'text-[rgba(0,0,0,0.88)]'
                  )}
                >
                  {segment.label}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className='absolute top-[207.32px] left-[289.32px] flex w-[203px] items-center justify-between rounded-[3.284px] border-[0.41px] border-solid border-[#e3e3e3] px-[6.567px] py-[4.926px] opacity-50'>
          <span className='text-[6px] leading-[8.209px] font-medium whitespace-nowrap text-[#575757]'>
            Full Load Filter
          </span>
          <span className='flex min-w-[18.06px] items-center rounded-full bg-[rgba(0,0,0,0.25)] p-[0.821px]'>
            <span className='block size-[7.388px] rounded-full bg-white shadow-[0_0.821px_0.821px_rgba(0,0,0,0.02),0_0.41px_1.231px_rgba(0,0,0,0.02),0_0.41px_0.41px_rgba(0,0,0,0.03)]' />
          </span>
        </div>

        <span className='absolute top-[60.32px] left-[398.32px] flex items-center justify-center overflow-hidden rounded-[2px] bg-[#f9f9f9] px-[2px] py-px'>
          <span className='text-[5.723px] leading-[8.994px] whitespace-nowrap text-[rgba(0,0,0,0.32)]'>
            Destination Table: W87erT_01992ij
          </span>
        </span>

        <MockRail className='opacity-50' />
      </div>

      {/* The "Sync mode" picker */}
      <div
        className={cn(
          'absolute top-[100.8px] left-[267.67px] h-[92.965px] w-[245.469px] overflow-hidden rounded-[12px] bg-white',
          STROKE,
          'after:border-[0.942px] after:border-[#d9d9d9]'
        )}
      >
        <p className='absolute top-[10.03px] left-[11.08px] w-[213.866px] text-[9.693px] leading-normal font-medium text-[#575757]'>
          Sync mode
        </p>
        <span className='absolute top-[30.39px] left-0 block w-full border-0 border-t-[0.627px] border-solid border-[#e7e7e7]' />
        <div className='absolute top-[43.45px] left-[11.08px] flex w-[221.607px] flex-col gap-[9.401px]'>
          <div className='flex w-full items-center justify-between'>
            <Radio label='Full refresh' checked />
            <Radio label='Full Refresh + Incremental' />
          </div>
          <div className='flex items-center gap-[18.802px]'>
            <Radio label='Full Refresh + CDC' />
            <Radio label='CDC Only' />
          </div>
        </div>
      </div>
    </MockFit>
  )
}
