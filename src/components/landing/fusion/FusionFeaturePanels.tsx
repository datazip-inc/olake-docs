import React from 'react'
import { cn } from '@site/src/lib/utils'
import { MockFit, MockIcon, MockRail, STROKE } from '../product/mock'

/**
 * The OLake UI pictures in the four feature tabs of the OLake Fusion page (the design's fusion-1 to
 * fusion-4 frames): the tables list with its compaction tiers, the maintenance checklist, the
 * cleanup schedule and the deployment card. Each is drawn at the design size (507 × 437) and
 * scaled to fit; pictures of the product, hidden from assistive tech.
 */

const Icon = ({ name, ...rest }: React.ComponentProps<typeof MockIcon>) => (
  <MockIcon name={`fusion/${name}`} {...rest} />
)

/** The editor panel with the collapsed rail (Optimisation selected). */
function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <MockFit width={507} height={437.4} className={className}>
      <div
        className={cn(
          'absolute inset-0 overflow-hidden rounded-[10.822px] bg-[#fefefd] shadow-[0_0_12.851px_0_rgba(0,0,0,0.04)]',
          STROKE,
          'after:z-10 after:border-[0.676px] after:border-[#d5d5d5]'
        )}
      >
        {children}
        <MockRail activeIndex={1} className='opacity-60' />
      </div>
    </MockFit>
  )
}

/** "Optimisation / Tables /" */
const Breadcrumb = ({ className }: { className: string }) => (
  <div
    className={cn(
      'absolute flex items-center text-[8.91px] leading-[14px] whitespace-nowrap text-[rgba(0,0,0,0.45)]',
      className
    )}
  >
    <span className='px-[2.545px]'>Optimisation</span>
    <span className='px-[2.545px]'>/</span>
    <span className='px-[2.545px] text-[rgba(0,0,0,0.88)]'>Tables</span>
    <span className='px-[2.545px]'>/</span>
  </div>
)

/** Page title and its one-line description. */
const Heading = ({ title, className }: { title: string; className: string }) => (
  <div
    className={cn(
      'absolute flex w-[149.389px] flex-col gap-[2.307px] text-[rgba(0,0,0,0.88)]',
      className
    )}
  >
    <span className='text-[11.536px] leading-[16.15px] font-medium'>{title}</span>
    <span className='text-[8.075px] leading-[12.689px] whitespace-pre'>
      Select Catalog &amp; Database to view tables &amp; run optimisation
    </span>
  </div>
)

/** The light-blue "OLake" tag after a table name. */
const OlakeTag = () => (
  <span className='rounded-[11.716px] bg-[#f3f5fd] px-[4.686px] text-[5.858px] leading-[11.716px] font-medium text-[#193ae6]'>
    OLake
  </span>
)

/* ---- Tiered Compaction (fusion-1) ----------------------------------------------------------- */

/** A table's last run of each tier (Quick, Standard, Deep), shown as Q, S and D tags. */
type TierState = {
  q: keyof typeof STATE_ICON
  s: keyof typeof STATE_ICON
  d: keyof typeof STATE_ICON
}
const STATE_ICON = {
  running: { icon: 'feature-tables-running', className: 'bg-[#fff7e6] text-[#fa8c16]' },
  failed: { icon: 'feature-tables-failed', className: 'bg-[#fff1f0] text-[#f5222d]' },
  success: { icon: 'feature-tables-success', className: 'bg-[#f6ffed] text-[#52c41a]' }
}

/** Tables under the selected one: name, size before and after, tier states (or not optimised), switch. */
const TABLES: {
  name: string
  before: string
  after: string
  tiers?: TierState
  on: boolean
  tag?: boolean
}[] = [
  { name: 'Products_Table_Cerulean', before: '15 GB', after: '12 GB', on: false },
  {
    name: 'Customers_Table_Azure',
    before: '20 GB',
    after: '16 GB',
    tiers: { q: 'running', s: 'failed', d: 'failed' },
    on: true
  },
  {
    name: 'Shipments_Table_Indigo',
    before: '25 GB',
    after: '20 GB',
    tiers: { q: 'success', s: 'success', d: 'success' },
    on: false
  },
  { name: 'Payments_Table_Fuchsia', before: '30 GB', after: '24 GB', on: false },
  { name: 'Reviews_Table_Scarlet', before: '35 GB', after: '28 GB', on: false, tag: true }
]

const TierTags = ({ tiers }: { tiers: TierState }) => (
  <span className='absolute top-[9.37px] left-[303.43px] flex items-center gap-[2.343px]'>
    {(['q', 's', 'd'] as const).map((key) => {
      const state = STATE_ICON[tiers[key]]
      return (
        <span
          key={key}
          className={cn(
            'flex items-center gap-[2.343px] rounded-[11.716px] px-[4.686px] py-[0.586px] text-[7.029px] leading-[11.716px] font-medium',
            state.className
          )}
        >
          <Icon name={state.icon} w={9.37246} />
          {key.toUpperCase()}
        </span>
      )
    })}
  </span>
)

const RowButton = ({
  left,
  width,
  children
}: {
  left: number
  width?: number
  children: string
}) => (
  <span
    className='absolute top-[9.37px] flex items-center justify-center rounded-[2.343px] border-[0.586px] border-solid border-[#d9d9d9] bg-white px-[4.686px]'
    style={{ left, width }}
  >
    <span className='flex h-[14.059px] items-center text-[8.2px] leading-[12.887px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
      {children}
    </span>
  </span>
)

const Switch = ({ on }: { on: boolean }) => (
  <span
    className={cn(
      'absolute top-[11.72px] left-[607.45px] flex rounded-[20px]',
      on ? 'bg-[#52c41a]' : 'bg-[rgba(0,0,0,0.25)]'
    )}
  >
    <span
      className={cn('flex h-[9.372px] w-[16.402px] items-center p-[1.172px]', on && 'justify-end')}
    >
      <span className='block size-[7.029px] rounded-[16px] bg-white' />
    </span>
  </span>
)

const Health = ({ before, after, left }: { before: string; after: string; left: number }) => (
  <span
    className='absolute top-[9.37px] flex items-center gap-[3.515px] text-[8.201px] leading-[14.059px] whitespace-nowrap'
    style={{ left }}
  >
    <span className='text-[rgba(0,0,0,0.88)]'>{before}</span>
    <Icon name='feature-tables-arrow' w={9.37246} />
    <span className='text-[#52c41a]'>{after}</span>
  </span>
)

const NotOptimised = ({ top }: { top: number }) => (
  <span
    className='absolute left-[316.32px] rounded-[11.716px] bg-[#f5f5f5] px-[4.686px] py-[0.586px] text-[7.029px] leading-[11.716px] font-medium text-[rgba(0,0,0,0.65)]'
    style={{ top }}
  >
    Not Optimised
  </span>
)

const TABLE_HEADERS: [string, number, boolean][] = [
  ['Actions', 30.66, true],
  ['Table', 60.33, false],
  ['Health Score', 236.57, true],
  ['Last Run Status', 344.66, true],
  ['Metrics', 447.15, true],
  ['Optimisation', 534.14, true],
  ['Status', 615.61, true]
]

/** The compaction tiers of the selected table: last run and state of each. */
const TIERS = [
  {
    name: 'Quick',
    last: 'last run 6 hr ago',
    state: 'Running',
    icon: 'feature-tiers-running',
    color: 'text-[#fa8c16]',
    top: 8.4
  },
  {
    name: 'Standard',
    last: 'last run 32 min ago',
    state: 'Failed',
    icon: 'feature-tiers-failed',
    color: 'text-[#f5222d]',
    top: 36.76
  },
  {
    name: 'Deep',
    last: 'last run 32 min ago',
    state: 'Success',
    icon: 'feature-tiers-success',
    color: 'text-[#52c41a]',
    top: 65.12
  }
]

export function TieredMock({ className }: { className?: string }) {
  return (
    <Panel className={className}>
      <Breadcrumb className='top-[17.32px] left-[55.32px]' />
      <div className='absolute top-[41.32px] left-[55.32px] flex w-[338px] flex-col gap-[9.229px]'>
        <Heading title='Tables' className='static' />
        <div className='flex items-center gap-[9.229px]'>
          {[
            ['OLake-default', 'text-[rgba(0,0,0,0.88)]'],
            ['Select Database', 'text-[rgba(0,0,0,0.25)]']
          ].map(([label, color]) => (
            <span
              key={label}
              className='flex w-[164.386px] items-center rounded-[3.461px] border-[0.577px] border-solid border-[#d9d9d9] px-[9.229px]'
            >
              <span className='flex h-[18.457px] min-w-px flex-1 items-center justify-between'>
                <span className={cn('text-[8.08px] leading-[12.689px] whitespace-nowrap', color)}>
                  {label}
                </span>
                <Icon name='feature-tables-dropdown' w={8.07534} />
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className='absolute top-[117.32px] left-[55.32px] h-[237.826px] w-[660.172px] overflow-hidden rounded-[4.686px] border-[0.586px] border-solid border-[#e5e5e5] bg-white'>
        <div className='absolute top-[-0.59px] left-[-0.59px] h-[28.117px] w-[660.172px] overflow-hidden border-[0.586px] border-solid border-[#d9d9d9] bg-[#fafafa] text-[7.029px] leading-[11.716px] font-medium whitespace-nowrap text-[rgba(0,0,0,0.65)]'>
          {TABLE_HEADERS.map(([label, x, centred]) => (
            <span
              key={label}
              className={cn(
                'absolute top-[13.61px]',
                centred ? '-translate-1/2' : '-translate-y-1/2'
              )}
              style={{ left: x }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* The selected table, lifted */}
        <div className='absolute top-[26.7px] left-[-0.59px] h-[32.804px] w-[660.172px] overflow-hidden border-0 border-b-[0.586px] border-solid border-[#d9d9d9] bg-white shadow-[0_2px_13px_1px_rgba(0,0,0,0.09)]'>
          <Icon
            name='feature-tables-actions'
            w={14.0587}
            className='absolute top-[9.37px] left-[22.85px]'
          />
          <span className='absolute top-[9.37px] left-[61.51px] flex items-center gap-[4.686px]'>
            <span className='text-[8.201px] leading-[14.059px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
              Orders_Table_Veridian
            </span>
            <OlakeTag />
          </span>
          <Health before='10 GB' after='8 GB' left={210.29} />
          <TierTags tiers={{ q: 'running', s: 'failed', d: 'success' }} />
          <RowButton left={417.66}>View Metrics</RowButton>
          <RowButton left={513.73} width={46.862}>
            Configure
          </RowButton>
          <Switch on />
        </div>

        {TABLES.map((table, i) => (
          <div
            key={table.name}
            className='absolute left-[-0.59px] h-[32.804px] w-[660.172px] overflow-hidden border-0 border-b-[0.586px] border-solid border-[#d9d9d9] bg-white opacity-20'
            style={{ top: 63.85 + i * 35.148 }}
          >
            <Icon
              name='feature-tables-actions'
              w={14.0587}
              className='absolute top-[9.37px] left-[22.85px]'
            />
            {table.tag ? (
              <span className='absolute top-[9.37px] left-[62.09px] flex items-center gap-[5.858px]'>
                <span className='text-[8.201px] leading-[14.059px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
                  {table.name}
                </span>
                <OlakeTag />
              </span>
            ) : (
              <span className='absolute top-[16.87px] left-[61.51px] -translate-y-1/2 text-[8.201px] leading-[14.059px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
                {table.name}
              </span>
            )}
            <Health before={table.before} after={table.after} left={207.95} />
            {table.tiers ? (
              <TierTags tiers={table.tiers} />
            ) : (
              <NotOptimised top={i === 0 ? 9.96 : 9.37} />
            )}
            <RowButton left={417.66}>View Metrics</RowButton>
            <RowButton left={513.73} width={46.862}>
              Configure
            </RowButton>
            <Switch on={table.on} />
          </div>
        ))}
      </div>

      {/* The selected table's tiers */}
      <div className='absolute top-[183.04px] left-[320.23px] h-[89.28px] w-[127.093px] overflow-hidden rounded-[4.201px] bg-white shadow-[0_3.151px_8.403px_0_rgba(0,0,0,0.08),0_1.576px_3.151px_-2.101px_rgba(0,0,0,0.12),0_4.727px_14.705px_4.201px_rgba(0,0,0,0.05)]'>
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className='absolute left-[10.5px] flex w-[108.712px] items-start justify-between'
            style={{ top: tier.top }}
          >
            <span className='flex w-[38.338px] flex-col gap-[1.05px]'>
              <span className='text-[6.302px] leading-[8.403px] font-medium text-black'>
                {tier.name}
              </span>
              <span className='text-[5.252px] leading-normal whitespace-nowrap text-[rgba(0,0,0,0.45)]'>
                {tier.last}
              </span>
            </span>
            <span
              className={cn(
                'flex items-center gap-[2.101px] text-[6.302px] leading-[10.504px] font-medium whitespace-nowrap',
                tier.color
              )}
            >
              <Icon name={tier.icon} w={6.30212} />
              {tier.state}
            </span>
          </div>
        ))}
        <span className='absolute top-[31.51px] left-0 block w-full border-0 border-t-[0.525px] border-solid border-[#d9d9d9]' />
        <span className='absolute top-[61.45px] left-0 block w-full border-0 border-t-[0.525px] border-solid border-[#d9d9d9]' />
      </div>

      {/* The table runs on under a white fade at the panel's right edge */}
      <span className='absolute top-[-0.68px] left-[433.32px] block h-[436px] w-[72px] bg-[linear-gradient(to_left,#fff_32.243%,rgba(255,255,255,0))]' />
    </Panel>
  )
}

/* ---- Omit Decay (fusion-2) ------------------------------------------------------------------ */

/** The maintenance steps, each card tucked under the one above. */
const STEPS = [
  {
    label: 'Metadata cleanup',
    note: '1.6 Gb cleaned up',
    noteLeft: 609.09,
    top: 236.05,
    done: false,
    bg: 'bg-[#f0f0f0]',
    text: 'text-[#a7a7a7]'
  },
  {
    label: 'Delete-file resolution',
    note: 'Deleted 23m ago',
    noteLeft: 616.36,
    top: 181.51,
    done: false,
    bg: 'bg-[#f9f9f9]',
    text: 'text-[#092b00]'
  },
  {
    label: 'Small-file compaction',
    note: '12.7 GB cleaned up',
    noteLeft: 598.18,
    top: 123.32,
    done: true,
    bg: 'bg-white',
    text: 'text-[#092b00]'
  }
]

export function DecayMock({ className }: { className?: string }) {
  return (
    <Panel className={className}>
      {STEPS.map((step) => (
        <div
          key={step.label}
          className={cn(
            'absolute left-[58.32px] h-[67.273px] w-[772.727px] overflow-hidden border-[1.818px] border-solid border-[#ededed]',
            step.done ? 'rounded-[14.545px]' : 'rounded-b-[14.545px]',
            step.bg
          )}
          style={{ top: step.top }}
        >
          <Icon
            name={step.done ? 'feature-decay-done' : 'feature-decay-pending'}
            w={29.0909}
            className='absolute top-[18.18px] left-[16.36px]'
          />
          <span
            className={cn(
              'absolute top-[33.18px] left-[56.36px] -translate-y-1/2 text-[16.364px] leading-[29.365px] whitespace-nowrap',
              step.text
            )}
          >
            {step.label}
          </span>
          <span
            className='absolute top-[32.14px] -translate-y-1/2 text-[14.545px] leading-normal whitespace-nowrap text-[#868686]'
            style={{ left: step.noteLeft }}
          >
            {step.note}
          </span>
        </div>
      ))}

      <span className='absolute top-[41.32px] left-[55.32px] w-[149.389px] text-[11.536px] leading-[16.15px] font-medium text-[rgba(0,0,0,0.88)]'>
        Products_Table_Cerulean
      </span>
      <span className='absolute top-[63.63px] left-[55.32px] -translate-y-1/2 text-[8px] leading-normal whitespace-nowrap text-[rgba(0,0,0,0.41)]'>
        10 GB
      </span>
      <Breadcrumb className='top-[17.32px] left-[55.32px]' />
      <div className='absolute top-[79.32px] left-[55.32px] flex w-[429px] items-center justify-between overflow-hidden rounded-[2.936px] bg-[#f6ffed] px-[8px] py-[2px] whitespace-nowrap'>
        <span className='flex items-center gap-[5.139px]'>
          <Icon name='feature-decay-banner' w={12} />
          <span className='text-[10.278px] leading-[16.151px] text-[#237804]'>
            Scheduled Maintenance Completed
          </span>
        </span>
        <span className='text-[8px] leading-normal text-[#52c41a]'>
          Last maintained · 2 minutes ago.
        </span>
      </div>
    </Panel>
  )
}

/* ---- Easy Configuration (fusion-3) ---------------------------------------------------------- */

const Select = ({ value, className }: { value: string; className?: string }) => (
  <span
    className={cn(
      'flex h-[19.644px] items-center gap-[4.911px] rounded-[3.683px] border-[0.614px] border-solid border-[#e3e3e3] px-[7.366px]',
      className
    )}
  >
    <span className='min-w-px flex-1 text-[8.594px] leading-[13.505px] text-[#a8a8a8]'>
      {value}
    </span>
    <span className='flex size-[7.366px] items-center justify-center'>
      <Icon name='feature-config-select' w={7.36634} className='rotate-90' />
    </span>
  </span>
)

/** A field label, set at the size the design renders it (its 5.3px spec is an instance scale). */
const Label = ({ children }: { children: React.ReactNode }) => (
  <span className='flex items-center gap-[2.455px] text-[8.594px] leading-[13.505px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
    {children}
  </span>
)

export function ConfigMock({ className }: { className?: string }) {
  return (
    <Panel className={className}>
      <span className='absolute top-[22.32px] left-[52.97px] w-[158.99px] text-[12.277px] leading-[17.188px] font-medium text-[rgba(0,0,0,0.88)]'>
        Configure Optimization
      </span>
      <div className='absolute top-[49.33px] left-[52.97px] h-[17.188px] w-[386.733px] overflow-hidden rounded-[2.455px] bg-[#f5f5f5] text-[8.594px] leading-[13.505px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
        <span className='absolute top-[1.84px] left-[7.98px] flex items-center gap-[4.297px]'>
          <Icon name='feature-config-table' w={9.82178} />
          Products_Table_Cerulean
        </span>
        <span className='absolute top-[8.84px] left-[352.36px] -translate-y-1/2'>10 GB</span>
      </div>

      <div className='absolute top-[72.05px] left-[33.32px] w-[427.248px] bg-white pl-[19.644px]'>
        <div className='flex w-full items-start gap-[14.733px] border-0 border-b-[0.614px] border-solid border-[#f0f0f0] text-[8.59px] leading-[13.505px]'>
          <span className='py-[7.366px] text-[rgba(0,0,0,0.88)]'>Optimize</span>
          <span className='border-0 border-b-[1.228px] border-solid border-[#193ae6] py-[7.366px] text-[#193ae6]'>
            Cleanup
          </span>
        </div>
      </div>

      <div className='absolute top-[115.63px] left-[54.2px] flex w-[364.02px] flex-col gap-[9.822px]'>
        <span className='flex items-center gap-[2.455px] text-[9.822px] leading-[14.733px] font-medium text-[rgba(0,0,0,0.88)]'>
          Cleanup Cron
          <Icon name='feature-config-question' w={8.59406} />
        </span>
        <div className='flex items-end gap-[9.822px]'>
          <span className='flex w-[143.03px] flex-col gap-[4.911px]'>
            <Label>Frequency</Label>
            <Select value='Every Week' />
          </span>
          <span className='flex w-[104.356px] flex-col gap-[4.911px]'>
            <Label>Start Day</Label>
            <Select value='Sunday' />
          </span>
          <span className='flex w-[110.495px] flex-col gap-[4.911px]'>
            <Label>
              Job Start Time <span className='text-[rgba(0,0,0,0.45)]'>(12H UTC)</span>
              <Icon name='feature-config-question' w={8.59406} />
            </Label>
            <span className='flex items-center gap-[4.911px]'>
              <Select value='1' className='w-[36.218px]' />
              <span className='flex items-center text-[8.594px] leading-normal whitespace-nowrap'>
                <span className='mr-[-0.614px] flex h-[19.644px] w-[24.554px] items-center justify-center rounded-l-[3.683px] border-[0.614px] border-solid border-[#d9d9d9] text-[#575757]'>
                  AM
                </span>
                <span className='flex h-[19.644px] w-[24.554px] items-center justify-center rounded-r-[3.683px] border-[0.614px] border-solid border-[#193ae6] bg-[#f3f5fd] text-[#193ae6]'>
                  PM
                </span>
              </span>
            </span>
          </span>
        </div>
        <div className='flex flex-col gap-[4.911px]'>
          <span className='text-[8.594px] leading-[14.733px] font-medium text-[rgba(0,0,0,0.88)]'>
            Next 3 Runs
          </span>
          <span className='flex items-center gap-[4.911px] text-[8.594px] leading-[13.505px] whitespace-nowrap text-[rgba(0,0,0,0.65)]'>
            {[
              'Sun, 22 Feb 2026, 1:00 GMT',
              'Sun, 1 Mar 2026, 2:00 GMT',
              'Sun, 8 Mar 2026, 3:00 GMT'
            ].map((run) => (
              <span key={run} className='rounded-[3.683px] bg-[#f5f5f5] px-[4.911px] py-[2.455px]'>
                {run}
              </span>
            ))}
          </span>
        </div>
      </div>

      <span className='absolute top-[250.32px] left-[39.32px] block w-[466px] border-0 border-t-[0.614px] border-solid border-[#d9d9d9]' />

      <div className='absolute top-[273.32px] left-[55.32px] flex w-[386.733px] items-center justify-between'>
        <span className='text-[9.822px] leading-[14.733px] font-medium text-[rgba(0,0,0,0.88)]'>
          Advanced Config
        </span>
        <Icon name='feature-config-caret' w={9.82178} className='-scale-y-100' />
      </div>
      <div className='absolute top-[299.11px] left-[55.32px] flex w-[386.119px] items-center gap-[2.455px]'>
        <span className='w-[337.624px] text-[9.9px] leading-[15.555px] text-[rgba(0,0,0,0.88)]'>
          Remove snapshots older than
        </span>
        <span className='flex h-[19.644px] items-center rounded-[3.683px] border-[0.614px] border-solid border-[#d9d9d9] bg-white px-[7.366px] text-[8.59px] leading-[13.505px] whitespace-nowrap text-[rgba(0,0,0,0.65)]'>
          10 Days
        </span>
      </div>
    </Panel>
  )
}

/* ---- Self-Hosted (fusion-4) ----------------------------------------------------------------- */

const Pill = ({
  children,
  className,
  left,
  top
}: {
  children: string
  className: string
  left: number
  top: number
}) => (
  <span
    className={cn(
      'absolute rounded-[17.573px] px-[7.029px] text-[8.787px] leading-[17.573px] font-medium whitespace-nowrap',
      className
    )}
    style={{ left, top }}
  >
    {children}
  </span>
)

/** The deployment's details: label, value pill, and where the row and its rule sit. */
const DEPLOYMENT = [
  {
    label: 'Service',
    value: 'OLake-Fusion',
    pill: 'bg-[#f3f5fd] text-[#193ae6]',
    pillLeft: 317,
    top: 76.5,
    rule: 106
  },
  {
    label: 'Environment',
    value: 'Production',
    pill: 'bg-[#f5f5f5] text-[#454545]',
    pillLeft: 330,
    top: 118.5,
    rule: 148
  },
  {
    label: 'Status',
    value: 'Running',
    pill: 'bg-[#f6ffed] text-[#389e0d]',
    pillLeft: 341,
    top: 162.5,
    rule: 192
  }
]

export function HostedMock({ className }: { className?: string }) {
  return (
    <Panel className={className}>
      <div className='absolute top-[88.32px] left-[60.32px] h-[40px] w-[388px] overflow-hidden rounded-t-[8px] bg-[#f5f5f5]'>
        {/* The live dot, a 6px circle in a 2px halo */}
        <span className='absolute top-[14px] left-[11px] block size-[6px] rounded-full bg-[#38ba02] shadow-[0_0_0_2px_rgba(66,195,12,0.32)]' />
        <span className='absolute top-[9px] left-[25px] flex items-center gap-[4.686px]'>
          <span className='text-[8.201px] leading-[14.059px] whitespace-nowrap text-[rgba(0,0,0,0.88)]'>
            Orders_Table_Veridian
          </span>
          <OlakeTag />
        </span>
      </div>

      <div className='absolute top-[117.32px] left-[60.32px] h-[399px] w-[485px] overflow-hidden rounded-[12px] border border-solid border-[#ececec] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
        <span className='absolute top-[17px] left-[13px] flex h-[17px] w-[338px] items-center text-[12px] leading-[16.15px] font-medium text-[rgba(0,0,0,0.88)]'>
          Your Infrastructure
        </span>
        <span className='absolute top-[42px] left-[13px] flex items-center overflow-hidden rounded-[6px] bg-[#f5f5f5] p-[0.976px] text-[7.81px] leading-[11.709px] whitespace-nowrap'>
          <span className='rounded-[1.952px] bg-white px-[5.855px] py-[1.952px] text-[rgba(0,0,0,0.88)] shadow-[0_0.488px_0.976px_0_rgba(0,0,0,0.03),0_0.488px_2.927px_-1px_rgba(0,0,0,0.02),0_0.976px_1.952px_0_rgba(0,0,0,0.02)]'>
            Kubernetes
          </span>
          <span className='px-[5.855px] py-[1.952px] text-[rgba(0,0,0,0.45)]'>Docker</span>
        </span>
        {DEPLOYMENT.map((row) => (
          <React.Fragment key={row.label}>
            <span
              className='absolute left-[13px] text-[10px] leading-[16.15px] text-[rgba(0,0,0,0.88)]'
              style={{ top: row.top }}
            >
              {row.label}
            </span>
            <Pill className={row.pill} left={row.pillLeft} top={row.top - 0.5}>
              {row.value}
            </Pill>
            <span
              className='absolute left-[14px] block w-[390px] border-0 border-t border-solid border-[#ececec]'
              style={{ top: row.rule }}
            />
          </React.Fragment>
        ))}
      </div>

      <Breadcrumb className='top-[18.32px] left-[60.32px]' />
      <Heading title='Deployment' className='top-[41.32px] left-[63.32px]' />
    </Panel>
  )
}
