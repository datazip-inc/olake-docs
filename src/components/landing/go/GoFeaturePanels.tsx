import React from 'react'
import { cn } from '@site/src/lib/utils'
import { MockFit, MockIcon as Icon, STROKE } from './mock'

/**
 * The job-editor panels of the Schema Evolution, Parallel Chunking and Resumable Syncs tabs (the
 * design's go-2, go-3 and go-4 frames). They share the panel, its navigation rail and the search /
 * destination bar; each is drawn at the design size (514 × 391) and scaled to fit. Pictures of the
 * product, hidden from assistive tech. The CDC tab's editor is GoFeatureMock.
 */

/** The panel with its rail and search bar; `barLeft` is where the search bar starts (it moves a little between frames). */
function Panel({
  barLeft,
  className,
  children
}: {
  barLeft: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <MockFit width={514.1} height={391.4} className={className}>
      <div
        className={cn(
          'absolute inset-0 overflow-hidden rounded-[13.611px] bg-[#fefefd] shadow-[0_0_16.163px_0_rgba(0,0,0,0.04)]',
          STROKE,
          'after:z-10 after:border-[0.851px] after:border-[#d5d5d5]'
        )}
      >
        <div
          className='absolute top-[19.27px] flex items-center gap-[11.319px] opacity-50'
          style={{ left: barLeft }}
        >
          <div className='flex h-[21.381px] w-[183.627px] overflow-hidden rounded-[3.574px] border-[0.596px] border-solid border-[#d9d9d9]'>
            <div className='flex h-full min-w-px flex-1 items-center rounded-[3.574px] bg-white px-[7.147px] py-[2.382px]'>
              <span className='text-[8.338px] leading-[13.103px] text-[rgba(0,0,0,0.25)]'>
                Search streams
              </span>
            </div>
            <div className='flex h-full w-[19.059px] shrink-0 items-center justify-center border-0 border-l-[0.596px] border-solid border-[#d9d9d9] bg-white'>
              <Icon name='feature-panel-search' w={9.52956} />
            </div>
          </div>
          <div className='relative h-[21.442px] w-[194.76px] overflow-hidden rounded-[3.574px] border-[0.596px] border-solid border-[#d9d9d9] bg-white'>
            <span className='absolute top-[0.6px] left-[83.98px] text-[8.338px] leading-[19.059px] whitespace-nowrap text-black'>
              Postgres_Retail / Sales
            </span>
            <span className='absolute top-[0.6px] left-[5.95px] text-[8.338px] leading-[19.059px] font-medium whitespace-nowrap text-black'>
              DestinationDB
            </span>
            <Icon
              name='feature-panel-pencil'
              w={9.52956}
              className='absolute top-[5.36px] left-[178.08px]'
            />
          </div>
        </div>

        {children}

        {/* Navigation rail */}
        <div className='absolute top-[-159.32px] left-[-0.85px] h-[548.364px] w-[50.309px] overflow-hidden border-0 border-r-[0.851px] border-solid border-[#eaeaea] bg-white opacity-50'>
          <div className='absolute top-[178.33px] left-[19.84px] flex w-[14.317px] flex-col items-center gap-[15.313px]'>
            <Icon name='feature-panel-sidebar-toggle' w={13.5873} />
            <div className='flex w-[17.324px] flex-col items-center gap-[17.014px]'>
              <span className='flex w-full items-center justify-center overflow-hidden rounded-[4.076px] bg-[#f5f5f5] p-[2.717px]'>
                <Icon name='feature-panel-sidebar-jobs' w={13.5873} />
              </span>
              <span className='flex w-full items-center overflow-hidden rounded-[4.076px] bg-white p-[2.717px]'>
                <Icon name='feature-panel-sidebar-sparkle' w={11.8889} />
              </span>
              <Icon name='feature-panel-sidebar-settings' w={13.5873} />
              <Icon name='feature-panel-sidebar-help' w={13.5873} />
            </div>
          </div>
        </div>
      </div>
    </MockFit>
  )
}

/* ---- Schema Evolution (go-2) ---------------------------------------------------------------- */

const SCHEMA_TABS = [
  { label: 'Config', icon: 'feature-schema-tab-config' },
  { label: 'Schema', icon: 'feature-schema-tab-schema' },
  { label: 'Partitioning', icon: 'feature-schema-tab-partitioning' }
]

/** Column rows under the highlighted one; the first three are dimmed, the rest run off the panel. */
const SCHEMA_ROWS = [
  ['Order_Date', 'Order_Date', 'Array +2', true],
  ['Product_Code', 'SKU_Code', 'String', true],
  ['Quantity', 'Units_Sold', 'String', true],
  ['Column_1', 'Destination Column', 'String', false]
] as const

/** The design's Antd tag: light blue, upper case. */
const Tag = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    className={cn(
      'flex items-center justify-center rounded-[3.177px] bg-[#e6f4ff] px-[6.353px] py-[0.794px] text-[9px] leading-[12.614px] whitespace-nowrap text-[#203fdd] uppercase',
      className
    )}
  >
    {children}
  </span>
)

export function SchemaMock({ className }: { className?: string }) {
  return (
    <Panel barLeft={84.67} className={className}>
      <div className='absolute top-[60.78px] left-[84.67px] h-[508.272px] w-[389.145px] overflow-hidden rounded-[6.353px] border-[0.561px] border-solid border-[#eee] bg-white'>
        <div className='absolute top-[20.09px] left-[15.33px] flex w-[355.79px] flex-col gap-[15.883px]'>
          <div className='flex w-full items-start justify-between whitespace-nowrap text-black opacity-40'>
            <span className='text-[12.594px] leading-[19.06px]'>Payments</span>
            <span className='flex h-[22.489px] w-[210.498px] items-center gap-[6.353px] overflow-hidden rounded-[4.765px] bg-[#f5f5f5] px-[13.501px] py-[3.177px] text-[8.996px] leading-normal'>
              <span className='font-medium'>Destination:</span>
              <span>Postgres_Retail-Sales/Payments</span>
            </span>
          </div>
          <div className='flex h-[25.414px] w-full items-center rounded-[4.765px] bg-[#f5f5f5] p-[1.588px]'>
            {SCHEMA_TABS.map((tab, i) => (
              <span
                key={tab.label}
                className={cn(
                  'flex h-[22.237px] min-w-px flex-1 items-center justify-center gap-[3.177px] rounded-[3.177px] px-[9.53px]',
                  i === 1
                    ? 'border-[0.794px] border-solid border-[#203fdd] bg-white shadow-[0_1.588px_1.588px_rgba(0,0,0,0.02),0_0.794px_2.383px_rgba(0,0,0,0.02),0_0.794px_0.794px_rgba(0,0,0,0.03)]'
                    : 'opacity-30'
                )}
              >
                <Icon name={tab.icon} w={12.7068} />
                <span
                  className={cn(
                    'truncate text-[11.118px] leading-[17.472px]',
                    i === 1 ? 'text-[#203fdd]' : 'text-[rgba(0,0,0,0.88)]'
                  )}
                >
                  {tab.label}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className='absolute top-[95.53px] left-[15.33px] flex h-[28.59px] w-[355.79px] overflow-hidden rounded-[4.765px] border-[0.794px] border-solid border-[#d9d9d9]'>
          <div className='flex h-full min-w-px flex-1 items-center rounded-[4.765px] bg-white px-[9.53px] py-[3.177px]'>
            <span className='text-[11.118px] leading-[17.472px] text-[rgba(0,0,0,0.25)]'>
              Search streams
            </span>
          </div>
          <div className='flex h-full w-[25.414px] shrink-0 items-center justify-center border-0 border-l-[0.794px] border-solid border-[#d9d9d9] bg-white'>
            <Icon name='feature-schema-search' w={12.7068} />
          </div>
        </div>

        <div className='absolute top-[133.65px] left-[15.33px] flex w-[354.996px] items-center gap-[23.031px] rounded-t-[3.177px] bg-[#f5f5f5] px-[12.707px] py-[9.53px] text-[9.53px] leading-[17.472px] whitespace-nowrap text-[rgba(128,128,128,0.88)]'>
          <span className='py-[2.383px]'>
            <Icon name='feature-schema-checkbox-all' w={12.7068} />
          </span>
          <span className='w-[77.83px] truncate px-[6.353px]'>Column name</span>
          <span className='px-[6.353px]'>Destination Column</span>
          <span className='w-[73.064px] px-[6.353px]'>Source Data type</span>
        </div>

        {SCHEMA_ROWS.map(([column, destination, type, dim], i) => (
          <div
            key={column + i}
            className={cn(
              'absolute left-[15.33px] flex w-[354.996px] items-center gap-[26.208px] border-[0.794px] border-solid border-[#d9d9d9] bg-white px-[12.707px] py-[9.53px]',
              dim && 'opacity-30'
            )}
            style={{ top: 206.17 + i * 36.255 }}
          >
            <span className='py-[2.383px]'>
              <Icon name='feature-schema-checkbox' w={12.7068} />
            </span>
            <span className='w-[61.151px] shrink-0 px-[6.353px] text-[9.53px] leading-[17.472px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
              {column}
            </span>
            <span className='flex w-[116.744px] shrink-0 justify-center px-[6.353px] text-[9.53px] leading-[13.876px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
              {destination}
            </span>
            <Tag className='min-w-[56.386px]'>{type}</Tag>
          </div>
        ))}
      </div>

      {/* The highlighted column, lifted over the list */}
      <div className='absolute top-[231.46px] left-[91.58px] flex w-[373.621px] items-center gap-[27.583px] rounded-[7.197px] border-[0.836px] border-solid border-[#d9d9d9] bg-white px-[13.373px] py-[10.03px]'>
        <span className='py-[2.508px]'>
          <Icon name='feature-schema-checkbox-highlight' w={13.3735} />
        </span>
        <span className='w-[64.36px] shrink-0 px-[6.687px] text-[10.03px] leading-[18.389px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
          User_ID
        </span>
        <span className='flex w-[122.869px] shrink-0 justify-center px-[6.687px] text-[10.03px] leading-[15.37px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
          Customer_ID
        </span>
        <Tag className='rounded-[3.343px] px-[6.687px] py-[0.836px] text-[10px] leading-[16.7px]'>
          String +3
        </Tag>
      </div>
    </Panel>
  )
}

/* ---- Parallel Chunking (go-3) --------------------------------------------------------------- */

/** The chunks behind the first one, each fainter than the last. */
const CHUNKS = [
  {
    name: 'Payment_Chunk_2',
    pct: '85%',
    fill: 276.429,
    done: '850K / 1M',
    rate: '30K rows/s',
    opacity: 'opacity-70'
  },
  {
    name: 'Payment_Chunk_3',
    pct: '92%',
    fill: 308,
    done: '920K / 1M',
    rate: '35K rows/s',
    opacity: 'opacity-40'
  },
  {
    name: 'Payment_Chunk_4',
    pct: '92%',
    fill: 276.429,
    done: '750K / 1M',
    rate: '30K rows/s',
    opacity: 'opacity-20'
  }
]

export function ChunkingMock({ className }: { className?: string }) {
  return (
    <Panel barLeft={76.3} className={className}>
      <div className='absolute top-[97.1px] left-[77.3px] h-[40px] w-[388px] overflow-hidden rounded-t-[8px] bg-[#f5f5f5]'>
        {/* The live dot, a 6px circle in a 2px halo */}
        <span className='absolute top-[14px] left-[11px] block size-[6px] rounded-full bg-[#38ba02] shadow-[0_0_0_2px_rgba(66,195,12,0.32)]' />
        <span className='absolute top-[12px] left-[25px] text-[8px] leading-normal whitespace-nowrap text-[#1d5e02]'>
          4 active workers · Reading chunks concurrently
        </span>
      </div>

      {CHUNKS.map((chunk, i) => (
        <div
          key={chunk.name}
          className={cn(
            'absolute left-[76.3px] h-[54px] w-[389px] overflow-hidden border-[0.943px] border-solid border-[#eaeaea] bg-white',
            i === CHUNKS.length - 1 && 'rounded-b-[8px]',
            chunk.opacity
          )}
          style={{ top: 176.1 + i * 53 }}
        >
          <span className='absolute top-[9.43px] left-[11.32px] text-[8.491px] leading-normal whitespace-nowrap text-black'>
            {chunk.name}
          </span>
          <span className='absolute top-[11.32px] left-[348.26px] text-[8.491px] leading-normal whitespace-nowrap text-[#8b8b8b]'>
            {chunk.pct}
          </span>
          <span className='absolute top-[23.59px] left-[11.32px] flex items-center gap-[2.83px] text-[7px] leading-normal whitespace-nowrap text-[#878787]'>
            {chunk.done}
            <Icon name='feature-chunking-dot' w={1.88689} />
            {chunk.rate}
          </span>
          <span className='absolute top-[41.06px] left-[11.06px] block h-[2px] w-[355px] overflow-hidden bg-[#eaeaea]'>
            <span className='block h-[1.887px] bg-[#bfbfbf]' style={{ width: chunk.fill }} />
          </span>
        </div>
      ))}

      <span className='absolute top-[64.1px] left-[76.3px] text-[12.594px] leading-[19.06px] whitespace-nowrap text-black'>
        Payments
      </span>

      {/* The first chunk, in progress */}
      <div className='absolute top-[127.1px] left-[76.3px] h-[58px] w-[389px] overflow-hidden rounded-[8px] border border-solid border-[#eaeaea] bg-white'>
        <span className='absolute top-[10px] left-[12px] text-[9px] leading-normal whitespace-nowrap text-black'>
          Payment_Chunk_1
        </span>
        <span className='absolute top-[12px] left-[349px] text-[9px] leading-normal whitespace-nowrap text-[#8b8b8b]'>
          78%
        </span>
        <span className='absolute top-[25px] left-[12px] flex items-center gap-[3px] text-[7px] leading-normal whitespace-nowrap text-[#878787]'>
          750K / 1M
          <Icon name='feature-chunking-dot-lg' w={2} />
          25K rows/s
        </span>
        <span className='absolute top-[44px] left-[12px] block h-[2px] w-[357px] overflow-hidden bg-[#eaeaea]'>
          <span className='block h-[2px] w-[293px] bg-[#0811ff]' />
        </span>
      </div>
    </Panel>
  )
}

/* ---- Resumable Syncs (go-4) ----------------------------------------------------------------- */

/** The checkpoint log: when, what, and where the line sits in the card. */
const TIMELINE = [
  { at: '17:23:78', text: 'Checkpoint Saved', top: 138 },
  { at: '12:56:32', text: 'Connection Interrupted', top: 164 },
  { at: '11:42:21', text: 'Connection Restored. Sync Resumed', top: 191 }
]

/** One table's checkpoint card; `muted` is the greyed second card running off the panel. */
function CheckpointCard({ table, top, muted }: { table: string; top: number; muted?: boolean }) {
  return (
    <div
      className='absolute left-[84.3px] h-[230px] w-[389px] overflow-hidden rounded-[8px] border border-solid border-[#eaeaea] bg-white'
      style={{ top }}
    >
      <div className='absolute top-[11px] left-[12px] flex w-[129px] flex-col gap-[3px] leading-normal'>
        <span className='flex items-start gap-[4px] text-[9px] whitespace-nowrap text-black'>
          <Icon name='feature-resumable-table' w={12} />
          {table}
        </span>
        <span className='text-[7px] text-[#878787]'>Checkpoint restored · Snapshot resumed</span>
      </div>

      <span className='absolute top-[43px] left-[13px] text-[9px] leading-normal whitespace-nowrap text-[#8b8b8b]'>
        Snapshot Progress
      </span>
      <span className='absolute top-[43px] left-[350px] text-[9px] leading-normal text-[#8b8b8b]'>
        72%
      </span>
      <span className='absolute top-[59px] left-[13px] block h-[4px] w-[357px] overflow-hidden bg-[#eaeaea]'>
        <span
          className={cn(
            'absolute top-0 left-0 block h-[4px] w-[257px]',
            muted ? 'bg-[#dbdbdb]' : 'bg-[#767bff]'
          )}
        />
        <span
          className={cn(
            'absolute top-0 left-[257px] block h-[4px] w-[30px]',
            muted ? 'bg-[#8b8b8b]' : 'bg-[#0811ff]'
          )}
        />
      </span>
      {/* Where the sync resumed from */}
      <span
        className={cn(
          'absolute top-[55px] left-[268.5px] block h-[12px] border-0 border-l border-solid',
          muted ? 'border-[#b2b2b2]' : 'border-[#203fdd]'
        )}
      />
      <span
        className={cn(
          'absolute top-[46px] left-[266px] text-[5px] leading-normal font-medium',
          muted ? 'text-[#dbdbdb]' : 'text-[#0811ff]'
        )}
      >
        64%
      </span>
      <span
        className={cn(
          'absolute top-[68px] left-[259px] text-[5px] leading-normal',
          muted ? 'text-[#dbdbdb]' : 'text-[#0811ff]'
        )}
      >
        Resumed
      </span>

      <div className='absolute top-[80px] left-[13px] flex w-[90px] flex-col gap-[5px] leading-normal'>
        <span className='text-[9px] text-[#8b8b8b]'>Records Synced</span>
        <span className='text-[10px] text-[#0a0a0a]'>720,000 / 1,000,000</span>
      </div>
      <div className='absolute top-[80px] left-[134px] flex w-[90px] flex-col gap-[5px] leading-normal'>
        <span className='text-[9px] text-[#8b8b8b]'>Restored Checkpoint</span>
        <span className='text-[10px] text-[#0a0a0a]'>640,000 records</span>
      </div>

      <span className='absolute top-[134.5px] left-[1px] block w-[388px] border-0 border-t border-solid border-[#eaeaea]' />

      {TIMELINE.map((step) => (
        <React.Fragment key={step.text}>
          <span
            className='absolute left-[35px] text-[5px] leading-normal whitespace-nowrap text-[#9c9c9c]'
            style={{ top: step.top }}
          >
            {step.at}
          </span>
          <span
            className='absolute left-[35px] text-[7px] leading-normal whitespace-nowrap text-[#232323]'
            style={{ top: step.top + 8 }}
          >
            {step.text}
          </span>
        </React.Fragment>
      ))}
      <Icon
        name='feature-resumable-check-circle'
        w={10}
        className='absolute top-[143px] left-[13px]'
      />
      <Icon name='feature-resumable-plugs' w={10} className='absolute top-[168px] left-[13px]' />
      <Icon
        name='feature-resumable-arrow-ccw'
        w={10}
        className='absolute top-[195px] left-[13px]'
      />
      <span className='absolute top-[156px] left-[17.75px] block h-[11px] border-0 border-l-[0.5px] border-solid border-[#dcdcdc]' />
      <span className='absolute top-[180px] left-[17.75px] block h-[11px] border-0 border-l-[0.5px] border-solid border-[#dcdcdc]' />
    </div>
  )
}

export function ResumableMock({ className }: { className?: string }) {
  return (
    <Panel barLeft={84.67} className={className}>
      <CheckpointCard table='Public.orders' top={59.1} />
      <CheckpointCard table='Payment.orders' top={305.1} muted />
    </Panel>
  )
}
