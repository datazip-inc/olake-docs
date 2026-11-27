import React from 'react'
import Link from '@docusaurus/Link'
import {
  CATALOGS,
  DELETE_FORMAT_LABELS,
  ENGINES,
  PAIRS,
  SOURCES,
  type CatalogId,
  type DeleteFormat,
  type Engine,
  type EngineId,
  type Support
} from '@site/src/data/integrations'

const MARK: Record<Support, string> = { yes: 'Yes', partial: 'Partial', no: 'No' }
const FORMATS: DeleteFormat[] = ['eq', 'pos', 'dv']
const fmt = (f: DeleteFormat) => DELETE_FORMAT_LABELS[f].toLowerCase()
const listFormats = (fs: DeleteFormat[]) =>
  fs.length > 1 ? `${fs.slice(0, -1).map(fmt).join(', ')} and ${fmt(fs[fs.length - 1])}` : fmt(fs[0])

/** Catalogs with a hub page under docs/integrations/catalogs; the others link to their setup page. */
const CATALOG_HUBS: CatalogId[] = ['glue', 'polaris', 'lakekeeper', 'horizon', 'unity', 'biglake', 's3tables']

const engineHubPath = (id: EngineId) => `/docs/integrations/${id}/`
const catalogPath = (id: CatalogId) =>
  CATALOG_HUBS.includes(id) ? `/docs/integrations/catalogs/${id}/` : CATALOGS[id].docsPath

/** Pairs that have a page (draft or live), in source order. Planned pairs have no URL yet. */
function guidesFor(filter: (p: (typeof PAIRS)[number]) => boolean) {
  return PAIRS.filter((p) => p.status !== 'planned' && filter(p))
}

function GuideList({ items, empty }: { items: { title: string; to: string }[]; empty: string }) {
  if (items.length === 0) return <p>{empty}</p>
  return (
    <ul>
      {items.map((i) => (
        <li key={i.to}>
          <Link to={i.to}>{i.title}</Link>
        </li>
      ))}
    </ul>
  )
}

function Sources({ sources }: { sources: { title: string; url: string; checked: string }[] }) {
  return (
    <p className='text-olake-muted text-[13px]'>
      Sources:{' '}
      {sources.map((s, i) => (
        <span key={s.url}>
          {i > 0 ? '; ' : ''}
          <a href={s.url} target='_blank' rel='noopener noreferrer'>
            {s.title}
          </a>{' '}
          (checked {s.checked})
        </span>
      ))}
      .
    </p>
  )
}

/**
 * How an engine steers the delete format. OLake Go preselects the first of eq, pos, dv that every
 * target query engine reads and the catalog accepts (types/query_engine.go). An engine OLake Go does
 * not list is a reader only, so the sentence names a listed stand-in or the upsert type to set by hand.
 */
function TargetEngineNote({ e }: { e: Engine }) {
  if (e.targetEngine) {
    return (
      <p>
        Set <strong>{e.targetEngine.label}</strong> as a target query engine on the OLake Go job, and OLake Go offers
        only the delete formats it reads and the catalog accepts. With {e.label} as the only target engine, OLake Go
        preselects {fmt(e.recommendedDelete)}.
      </p>
    )
  }
  const standIn = e.standIn ? ENGINES[e.standIn] : undefined
  const lead = `${e.label} is not in OLake Go's target query engine list, so it reads the tables without narrowing the delete formats OLake Go offers.`
  if (standIn?.targetEngine) {
    return standIn.recommendedDelete === e.recommendedDelete ? (
      <p>
        {lead} Set <strong>{standIn.targetEngine.label}</strong> in its place, and OLake Go preselects{' '}
        {fmt(e.recommendedDelete)}, which {e.label} reads.
      </p>
    ) : (
      <p>
        {lead} Set <strong>{standIn.targetEngine.label}</strong> in its place, then switch the upsert type from{' '}
        {fmt(standIn.recommendedDelete)} to {fmt(e.recommendedDelete)} by hand.
      </p>
    )
  }
  return e.recommendedDelete === 'eq' ? (
    <p>
      {lead} With no target engine set, OLake Go preselects {fmt('eq')}, which {e.label} reads.
    </p>
  ) : (
    <p>
      {lead} With no target engine set, OLake Go preselects {fmt('eq')}, so switch the upsert type to{' '}
      {fmt(e.recommendedDelete)} by hand.
    </p>
  )
}

/**
 * Which catalogs an engine reads, which delete formats it reads, and the guides for it. For the
 * `iceberg` entry (the table format itself, no single engine) the headings and the closing
 * sentence describe the spec instead.
 */
export function EngineHub({ engine: id }: { engine: EngineId }) {
  const e = ENGINES[id]
  const spec = id === 'iceberg'
  const catalogs = (Object.keys(e.catalogs) as CatalogId[])
    .filter((c) => CATALOGS[c])
    .sort((a, b) => CATALOGS[a].rank - CATALOGS[b].rank)
  const guides = guidesFor((p) => p.engine === id).map((p) => ({
    title: `${SOURCES[p.source].label} to ${e.label}`,
    to: `/docs/integrations/${p.slug}/`
  }))
  // pages for another engine where this one queried the same tables in the cross-engine section
  const alsoGuides = guidesFor((p) => p.engine !== id && p.alsoRead.includes(id)).map((p) => ({
    title: `${SOURCES[p.source].label} to ${ENGINES[p.engine].label}`,
    to: `/docs/integrations/${p.slug}/`
  }))
  return (
    <>
      <h2>{spec ? 'Catalogs OLake Go writes Iceberg tables to' : `Catalogs ${e.label} reads`}</h2>
      <table className='olake-compat-strip'>
        <thead>
          <tr>
            <th>Catalog</th>
            <th>{spec ? 'Readable' : `${e.label} reads`}</th>
            <th>How</th>
          </tr>
        </thead>
        <tbody>
          {catalogs.map((c) => {
            const s = e.catalogs[c]!
            return (
              <tr key={c}>
                <td>
                  <Link to={catalogPath(c)}>{CATALOGS[c].label}</Link>
                </td>
                <td>{MARK[s.reads]}</td>
                <td>
                  {s.how}
                  {s.note ? ` (${s.note})` : ''}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <h2>{spec ? 'Delete formats in the Iceberg spec' : `Delete formats ${e.label} reads`}</h2>
      <table className='olake-delete-formats'>
        <thead>
          <tr>
            {FORMATS.map((f) => (
              <th key={f}>{DELETE_FORMAT_LABELS[f]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {FORMATS.map((f) => (
              <td key={f}>{MARK[e.deletes[f]]}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <p>{e.deletesNote}</p>
      {spec ? null : <TargetEngineNote e={e} />}
      <Sources sources={e.sources} />
      <h2>{spec ? 'Tested guides that end in Apache Iceberg' : `Tested guides for ${e.label}`}</h2>
      <GuideList items={guides} empty={`No guide ends in ${e.label} yet.`} />
      {alsoGuides.length > 0 && (
        <>
          <h2>Guides where {e.label} reads the same tables</h2>
          <p>
            These pages show {e.label} reading the same tables through the same catalog, in their cross-engine
            section. No second copy of the data is made.
          </p>
          <GuideList items={alsoGuides} empty='' />
        </>
      )}
    </>
  )
}

/** Which engines read a catalog, what OLake Go needs to write to it, and the guides that use it. */
export function CatalogHub({ catalog: id }: { catalog: CatalogId }) {
  const c = CATALOGS[id]
  const engines = (Object.keys(ENGINES) as EngineId[])
    .map((e) => ENGINES[e])
    .filter((e) => e.id !== 'iceberg' && e.catalogs[id])
    .sort((a, b) => a.label.localeCompare(b.label))
  const guides = guidesFor((p) => p.catalogs.includes(id)).map((p) => ({
    title: `${SOURCES[p.source].label} to ${ENGINES[p.engine].label}${p.tested.includes(id) ? '' : ' (documented, not run on this catalog)'}`,
    to: `/docs/integrations/${p.slug}/?catalog=${id}`
  }))
  return (
    <>
      <h2>What OLake Go needs</h2>
      <ul>
        <li>
          <code>catalog_type</code>: <code>{c.catalogType}</code>
        </li>
        <li>Authentication OLake Go offers: {c.authTypes.join(', ')}.</li>
        <li>
          Delete formats OLake Go writes here:{' '}
          {c.deleteFormats ? (
            <>
              {listFormats(c.deleteFormats)} only (OLake Go v1.1.2 and later). {c.deleteFormatsWhy?.text}
              {c.deleteFormatsWhy ? (
                <>
                  {' '}
                  <a href={c.deleteFormatsWhy.source.url} target='_blank' rel='noopener noreferrer'>
                    {c.deleteFormatsWhy.source.title}
                  </a>{' '}
                  (checked {c.deleteFormatsWhy.source.checked}).
                </>
              ) : null}
            </>
          ) : (
            <>{listFormats(FORMATS)}, narrowed by the job&apos;s target query engines.</>
          )}
        </li>
        <li>
          Full destination reference: <Link to={c.docsPath}>{c.label} setup</Link>.
        </li>
      </ul>
      <h2>Engines that read {c.label}</h2>
      <table className='olake-compat-strip'>
        <thead>
          <tr>
            <th>Engine</th>
            <th>Reads</th>
            <th>How</th>
          </tr>
        </thead>
        <tbody>
          {engines.map((e) => {
            const s = e.catalogs[id]!
            return (
              <tr key={e.id}>
                <td>
                  <Link to={engineHubPath(e.id)}>{e.label}</Link>
                </td>
                <td>{MARK[s.reads]}</td>
                <td>
                  {s.how}
                  {s.note ? ` (${s.note})` : ''}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className='text-olake-muted text-[13px]'>
        Each engine row comes from that engine&apos;s vendor documentation. The dated sources are on the engine&apos;s
        page, linked in the first column.
      </p>
      <h2>Guides that use {c.label}</h2>
      <GuideList items={guides} empty={`No guide uses ${c.label} yet.`} />
    </>
  )
}
