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
import MysqlPrereqs from './sources/mysql/Prereqs.mdx'
import MysqlConnect from './sources/mysql/Connect.mdx'
import MongodbPrereqs from './sources/mongodb/Prereqs.mdx'
import MongodbConnect from './sources/mongodb/Connect.mdx'
import OraclePrereqs from './sources/oracle/Prereqs.mdx'
import OracleConnect from './sources/oracle/Connect.mdx'
import MssqlPrereqs from './sources/mssql/Prereqs.mdx'
import MssqlConnect from './sources/mssql/Connect.mdx'
import KafkaPrereqs from './sources/kafka/Prereqs.mdx'
import KafkaConnect from './sources/kafka/Connect.mdx'
import S3Prereqs from './sources/s3/Prereqs.mdx'
import S3Connect from './sources/s3/Connect.mdx'

import HorizonSetup from './catalogs/horizon/Setup.mdx'
import HorizonWriter from './catalogs/horizon/Writer.mdx'
import GlueSetup from './catalogs/glue/Setup.mdx'
import GlueWriter from './catalogs/glue/Writer.mdx'
import PolarisSetup from './catalogs/polaris/Setup.mdx'
import PolarisWriter from './catalogs/polaris/Writer.mdx'

import CreateJob from './jobs/CreateJob.mdx'

import SnowflakeQueryHorizon from './engines/snowflake/Query-horizon.mdx'
import SnowflakeQueryGlue from './engines/snowflake/Query-glue.mdx'
import SparkConnectHorizon from './engines/spark/Connect-horizon.mdx'
import DuckdbConnectHorizon from './engines/duckdb/Connect-horizon.mdx'
import DuckdbConnectPolaris from './engines/duckdb/Connect-polaris.mdx'
import DuckdbQueryPolaris from './engines/duckdb/Query-polaris.mdx'
import TrinoConnectPolaris from './engines/trino/Connect-polaris.mdx'
import ClickhouseQueryPolaris from './engines/clickhouse/Query-polaris.mdx'

export const PARTIALS = {
  'sources/postgres/prereqs': PostgresPrereqs,
  'sources/postgres/connect': PostgresConnect,
  'sources/mysql/prereqs': MysqlPrereqs,
  'sources/mysql/connect': MysqlConnect,
  'sources/mariadb/prereqs': MysqlPrereqs,
  'sources/mariadb/connect': MysqlConnect,
  'sources/mongodb/prereqs': MongodbPrereqs,
  'sources/mongodb/connect': MongodbConnect,
  'sources/oracle/prereqs': OraclePrereqs,
  'sources/oracle/connect': OracleConnect,
  'sources/mssql/prereqs': MssqlPrereqs,
  'sources/mssql/connect': MssqlConnect,
  'sources/kafka/prereqs': KafkaPrereqs,
  'sources/kafka/connect': KafkaConnect,
  'sources/s3/prereqs': S3Prereqs,
  'sources/s3/connect': S3Connect,
  'catalogs/horizon/setup': HorizonSetup,
  'catalogs/horizon/writer': HorizonWriter,
  'catalogs/glue/setup': GlueSetup,
  'catalogs/glue/writer': GlueWriter,
  'catalogs/polaris/setup': PolarisSetup,
  'catalogs/polaris/writer': PolarisWriter,
  'jobs/create': CreateJob,
  'engines/snowflake/query-horizon': SnowflakeQueryHorizon,
  'engines/snowflake/query-glue': SnowflakeQueryGlue,
  'engines/spark/connect-horizon': SparkConnectHorizon,
  'engines/duckdb/connect-horizon': DuckdbConnectHorizon,
  'engines/duckdb/connect-polaris': DuckdbConnectPolaris,
  'engines/duckdb/query-polaris': DuckdbQueryPolaris,
  'engines/trino/connect-polaris': TrinoConnectPolaris,
  'engines/clickhouse/query-polaris': ClickhouseQueryPolaris
} satisfies Record<string, ComponentType<Record<string, unknown>>>

export type PartialId = keyof typeof PARTIALS
