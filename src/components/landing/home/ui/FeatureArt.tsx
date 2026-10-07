import React from 'react'
import type { FeatureArt as FeatureArtKind } from '@site/src/data/landing/home/features'

/**
 * The product mock-ups inside each feature card. The design draws them as
 * vector groups that Figma will not export (they sit off-canvas in a scrolling
 * row), so they are rebuilt here as DOM — which also keeps them crisp and
 * themeable. Values shown are the design's sample content, not live data.
 */

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className='flex h-[186px] items-center justify-center bg-olake-line px-[22px] lg:h-[240px]'>
    <div className='h-full w-full max-w-[420px] translate-y-[16px] overflow-hidden rounded-[8px] bg-[#fdfdfd] px-[16px] pt-[14px] shadow-[0_0_10px_0_rgba(0,0,0,0.15)]'>
      {children}
    </div>
  </div>
)

const Ingestion = () => (
  <Shell>
    <p className='text-[11px] text-olake-ink'>Running Ingestion</p>
    <pre className='mt-[10px] whitespace-pre font-mono text-[10px] leading-[1.7] text-olake-text-2'>
      {`# run it
$ OLake sync
orders      1,204,553 rows   00:41  ✓
customers     318,090 rows   00:12  ✓`}
    </pre>
    <div className='mt-[14px] flex items-center justify-between text-[10px]'>
      <span className='text-olake-blue'>Run Progress</span>
      <span className='text-olake-blue'>57%</span>
    </div>
    <div className='mt-[6px] h-[5px] w-full overflow-hidden rounded-[3px] bg-olake-line'>
      <div className='h-full w-[57%] rounded-[3px] bg-linear-to-r from-[#1e3ae0] to-[#c8d2ff]' />
    </div>
  </Shell>
)

const TREE: { depth: number; label: string; size?: string; active?: boolean }[] = [
  { depth: 0, label: 'orders/' },
  { depth: 1, label: 'metadata/' },
  { depth: 2, label: 'v3.metadata.json', size: '4.3 KB' },
  { depth: 2, label: 'snap-8814402.avro', size: '6.7 KB' },
  { depth: 2, label: 'manifest-list.avro', size: '2.1 KB' },
  { depth: 1, label: 'data/' },
  { depth: 2, label: '00000-3-a9f2b.parquet', size: '118 MB', active: true },
  { depth: 2, label: '00001-3-c4e81.parquet', size: '121 MB' },
  { depth: 2, label: '00002-3-1d7ac.parquet', size: '116 MB' }
]

const Lakehouse = () => (
  <Shell>
    <p className='border-0 border-b border-solid border-olake-line pb-[10px] text-[11px] text-olake-ink'>
      s3://lake/warehouse
    </p>
    <div className='mt-[8px] font-mono text-[9px] leading-[1.9] text-olake-text-2'>
      {TREE.map((row) => (
        <div
          key={row.label}
          className={`flex items-center justify-between rounded-[3px] px-[4px] ${
            row.active ? 'bg-[#f1f3ff] text-olake-blue' : ''
          }`}
        >
          <span style={{ paddingLeft: `${row.depth * 12}px` }}>
            {row.depth > 0 ? '└─ ' : ''}
            {row.label}
          </span>
          {row.size && <span className='text-olake-muted'>{row.size}</span>}
        </div>
      ))}
    </div>
  </Shell>
)

const Vpc = () => (
  <Shell>
    <div className='mx-auto flex h-[20px] w-[180px] items-center gap-[6px] rounded-[4px] bg-olake-line px-[8px] text-[9px] text-olake-ink'>
      <span aria-hidden='true'>🔒</span>
      YOUR-VPC
      <span className='ml-auto text-olake-text-2'>APC SOUTH 1</span>
    </div>
    <div className='mt-[12px] rounded-[6px] border border-dashed border-[#d6d6d6] bg-[rgba(236,236,236,0.2)] px-[14px] py-[12px]'>
      <div className='flex items-center gap-[8px] text-[10px] text-olake-ink'>
        <span className='inline-block h-[8px] w-[8px] rounded-full bg-[#1e3ae0]' />
        Postgress
      </div>
      <p className='ml-[3px] border-0 border-l border-solid border-[#d6d6d6] pl-[14px] font-mono text-[9px] text-olake-blue'>
        res
      </p>
      <div className='flex items-center gap-[8px] text-[10px] text-olake-ink'>
        <span className='inline-block h-[8px] w-[8px] rounded-full bg-[#1e3ae0]' />
        OLake
      </div>
      <p className='ml-[3px] border-0 border-l border-solid border-[#d6d6d6] pl-[14px] font-mono text-[9px] text-olake-blue'>
        container
      </p>
      <div className='mt-[6px] flex h-[20px] items-center gap-[8px] rounded-[4px] bg-olake-line px-[8px] text-[10px] text-olake-ink'>
        s3://lake
        <span className='ml-auto font-mono text-[9px] text-olake-blue'>iceberg</span>
      </div>
    </div>
  </Shell>
)

const Maintenance = () => (
  <Shell>
    <div className='flex items-center justify-between text-[11px] text-olake-ink'>
      <span>/order</span>
      <span className='text-olake-muted'>last 90 days</span>
    </div>
    <svg viewBox='0 0 240 76' className='mt-[12px] h-[76px] w-full' aria-hidden='true'>
      <path
        d='M0 60 C40 58, 60 40, 96 42 S168 20, 240 14'
        fill='none'
        stroke='#1e3ae0'
        strokeWidth='1.6'
      />
      <path
        d='M0 66 C48 64, 74 56, 110 58 S180 46, 240 44'
        fill='none'
        stroke='#d6d6d6'
        strokeWidth='1.4'
      />
    </svg>
    <div className='mt-[8px] grid grid-cols-2 gap-[10px] text-[9px]'>
      <div>
        <p className='text-olake-muted'>P95 Query Time</p>
        <p className='mt-[2px] text-[11px] text-olake-ink'>0.9s</p>
      </div>
      <div>
        <p className='text-olake-muted'>Table Size</p>
        <p className='mt-[2px] text-[11px] text-olake-ink'>12.4 TB</p>
      </div>
    </div>
  </Shell>
)

const ART: Record<FeatureArtKind, () => React.JSX.Element> = {
  ingestion: Ingestion,
  lakehouse: Lakehouse,
  vpc: Vpc,
  maintenance: Maintenance
}

export default function FeatureArt({ kind }: { kind: FeatureArtKind }) {
  const Art = ART[kind]
  return <Art />
}
