import React from 'react'
import Link from '@docusaurus/Link'
import { CATALOGS, DELETE_FORMAT_LABELS, ENGINES, type DeleteFormat, type EngineId, type Support } from '@site/src/data/integrations'
import { useIntegration } from './useIntegration'

const MARK: Record<Support, string> = { yes: 'Yes', partial: 'Partial', no: 'No' }

/**
 * The catalogs this page offers and how the engine reads each one, from engines.ts. The tested
 * column comes from the page's front matter, so a catalog that was never run says so.
 */
export function CatalogStrip() {
  const { engine, catalogs, frontMatter } = useIntegration()
  const tested = new Set<string>(frontMatter.tested?.catalogs ?? [])
  return (
    <table className='olake-compat-strip'>
      <thead>
        <tr>
          <th>Catalog</th>
          <th>OLake Go writes</th>
          <th>{engine.label} reads</th>
          <th>Verified on this page</th>
        </tr>
      </thead>
      <tbody>
        {catalogs.map((c) => {
          const support = engine.catalogs[c.id]
          return (
            <tr key={c.id}>
              <td>
                <Link to={c.docsPath}>{c.label}</Link>
              </td>
              <td>Yes</td>
              <td>
                {support ? `${MARK[support.reads]}: ${support.how}` : 'No'}
                {support?.note ? ` (${support.note})` : ''}
              </td>
              <td>{tested.has(c.id) ? 'Yes, end to end' : 'Documented, not yet run by us'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

/**
 * Which row-level delete formats each engine on the page can read. The main engine comes
 * first, then the engines in `alsoRead`. The recommended OLake Go upsert type is the one every
 * listed engine reads.
 */
export function DeleteFormatTable({ engines }: { engines?: EngineId[] }) {
  const { engine } = useIntegration()
  const ids: EngineId[] = [engine.id, ...(engines ?? []).filter((e) => e !== engine.id)]
  const formats: DeleteFormat[] = ['eq', 'pos', 'dv']
  return (
    <>
      <table className='olake-delete-formats'>
        <thead>
          <tr>
            <th>Engine</th>
            {formats.map((f) => (
              <th key={f}>{DELETE_FORMAT_LABELS[f]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ids.map((id) => {
            const e = ENGINES[id]
            return (
              <tr key={id}>
                <td>
                  <a href={e.docsUrl} target='_blank' rel='noopener noreferrer'>
                    {e.label}
                  </a>{' '}
                  <span className='text-olake-muted'>({e.version})</span>
                </td>
                {formats.map((f) => (
                  <td key={f}>{MARK[e.deletes[f]]}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      <p>{engine.deletesNote}</p>
    </>
  )
}

/** Label of a catalog, for prose inside MDX: `<CatalogName id="horizon" />`. */
export function CatalogName({ id }: { id: keyof typeof CATALOGS }) {
  return <>{CATALOGS[id]?.label ?? id}</>
}
