import React from 'react'
import Link from '@docusaurus/Link'
import { useRunbook } from './useRunbook'

/**
 * Who wrote the page and why, in the first screen. The fixes on a runbook never depend on OLake Go,
 * and the page says so before anything else.
 */
export default function Disclosure() {
  const { family } = useRunbook()
  const relation =
    family.relation === 'alternative' ? (
      <>
        <Link to='/docs/'>OLake Go</Link> is an open source alternative to {family.product} for loading database
        changes into Apache Iceberg. Every fix on this page works without it.
      </>
    ) : family.relation === 'source' ? (
      <>
        This page is written by the team behind <Link to='/docs/'>OLake Go</Link>, which reads {family.product} change
        logs. The steps apply to any tool that reads them and need nothing from OLake Go.
      </>
    ) : (
      <>
        This page is written by the team behind <Link to='/docs/'>OLake Go</Link>, which writes {family.product}{' '}
        tables. The steps apply to tables written by any engine.
      </>
    )
  return (
    <p className='olake-runbook-disclosure mb-[16px] rounded-[8px] border border-solid border-olake-line bg-olake-surface-alt px-[14px] py-[10px] text-[14px] leading-[1.55] text-olake-ink'>
      {relation} OLake is not affiliated with {family.owner}.
    </p>
  )
}
