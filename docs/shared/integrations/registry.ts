/**
 * Static import map for the shared blocks used by the integration pages. MDX must be imported
 * statically, so every partial is listed here; `<Partial id="..." />` looks the id up at render
 * time and the check script verifies that every id a page uses exists.
 *
 * Partials have no front matter and no H1. They may read props (`{props.engine}`).
 */
import type { ComponentType } from 'react'

import PostgresPrereqs from './sources/postgres/Prereqs.mdx'
import PostgresConnect from './sources/postgres/Connect.mdx'

import HorizonSetup from './catalogs/horizon/Setup.mdx'
import HorizonWriter from './catalogs/horizon/Writer.mdx'
import GlueSetup from './catalogs/glue/Setup.mdx'
import GlueWriter from './catalogs/glue/Writer.mdx'

import CreateJob from './jobs/CreateJob.mdx'

import SnowflakeQueryHorizon from './engines/snowflake/Query-horizon.mdx'
import SnowflakeQueryGlue from './engines/snowflake/Query-glue.mdx'
import SparkConnectHorizon from './engines/spark/Connect-horizon.mdx'
import DuckdbConnectHorizon from './engines/duckdb/Connect-horizon.mdx'

export const PARTIALS = {
  'sources/postgres/prereqs': PostgresPrereqs,
  'sources/postgres/connect': PostgresConnect,
  'catalogs/horizon/setup': HorizonSetup,
  'catalogs/horizon/writer': HorizonWriter,
  'catalogs/glue/setup': GlueSetup,
  'catalogs/glue/writer': GlueWriter,
  'jobs/create': CreateJob,
  'engines/snowflake/query-horizon': SnowflakeQueryHorizon,
  'engines/snowflake/query-glue': SnowflakeQueryGlue,
  'engines/spark/connect-horizon': SparkConnectHorizon,
  'engines/duckdb/connect-horizon': DuckdbConnectHorizon
} satisfies Record<string, ComponentType<Record<string, unknown>>>

export type PartialId = keyof typeof PARTIALS
