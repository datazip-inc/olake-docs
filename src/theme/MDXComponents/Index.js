import InitialComponents from '@theme-original/MDXComponents';
import Badge from "./Badge";
import Tpsr from "./Tpsr";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Hr from '@site/src/components/Hr'
import BlogCTA from '@site/src/components/BlogCTA'

import DocCardList from '@theme/DocCardList';
import DocsFooter from '../../../docs/shared/DocsFooter.mdx'

import DockerDiscover from '../../../docs/shared/commands/DockerDiscover.mdx'
import DockerSync from '../../../docs/shared/commands/DockerSync.mdx'
import DockerSyncWithState from '../../../docs/shared/commands/DockerSyncWithState.mdx'

import DockerDiscoverMySQL from '../../../docs/shared/commands/DockerDiscoverMySQL.mdx'
import DockerSyncMySQL from '../../../docs/shared/commands/DockerSyncMySQL.mdx'
import DockerSyncWithStateMySQL from '../../../docs/shared/commands/DockerSyncWithStateMySQL.mdx'

import DockerDiscoverPostgres from '../../../docs/shared/commands/DockerDiscoverPostgres.mdx'
import DockerSyncPostgres from '../../../docs/shared/commands/DockerSyncPostgres.mdx'
import DockerSyncWithStatePostgres from '../../../docs/shared/commands/DockerSyncWithStatePostgres.mdx'

import LocalDiscover from '../../../docs/shared/commands/LocalDiscover.mdx'
import LocalSync from '../../../docs/shared/commands/LocalSync.mdx'
import LocalSyncWithState from '../../../docs/shared/commands/LocalSyncWithState.mdx'

import LocalDiscoverMySQL from '../../../docs/shared/commands/LocalDiscoverMySQL.mdx'
import LocalSyncMySQL from '../../../docs/shared/commands/LocalSyncMySQL.mdx'
import LocalSyncWithStateMySQL from '../../../docs/shared/commands/LocalSyncWithStateMySQL.mdx'

import LocalDiscoverPostgres from '../../../docs/shared/commands/LocalDiscoverPostgres.mdx'
import LocalSyncPostgres from '../../../docs/shared/commands/LocalSyncPostgres.mdx'
import LocalSyncWithStatePostgres from '../../../docs/shared/commands/LocalSyncWithStatePostgres.mdx'

import MongoDBSourceConfig from '../../../docs/shared/config/MongoDBSourceConfig.mdx'
import MongoDBSourceConfigDetails from '../../../docs/shared/config/MongoDBSourceConfigDetails.mdx'
import MongoDBStateConfig from '../../../docs/shared/config/MongoDBStateConfig.mdx'
import MongoDBStateConfigDetails from '../../../docs/shared/config/MongoDBStateConfigDetails.mdx'

import MySQLSourceConfig from '../../../docs/shared/config/MySQLSourceConfig.mdx'
import MySQLSourceConfigDetails from '../../../docs/shared/config/MySQLSourceConfigDetails.mdx'
import MySQLStateConfig from '../../../docs/shared/config/MySQLStateConfig.mdx'
import MySQLStateConfigDetails from '../../../docs/shared/config/MySQLStateConfigDetails.mdx'

import PostgresSourceConfig from '../../../docs/shared/config/PostgresSourceConfig.mdx'
import PostgresSourceConfigDetails from '../../../docs/shared/config/PostgresSourceConfigDetails.mdx'
import PostgresStateConfig from '../../../docs/shared/config/PostgresStateConfig.mdx'
import PostgresStateConfigDetails from '../../../docs/shared/config/PostgresStateConfigDetails.mdx'

import LocalParquetConfig from '../../../docs/shared/config/LocalParquetConfig.mdx'
import S3Config from '../../../docs/shared/config/S3Config.mdx'
import S3ConfigDetails from '../../../docs/shared/config/S3ConfigDetails.mdx'


const MDXComponents = {
  ...InitialComponents,
  Badge,
  //   Image,
  Tpsr,
  //   img,
  //   Img: img,
  DocsFooter,
  Tabs,
  TabItem,
  Hr,
  BlogCTA,
  DocCardList,

  DockerDiscover,
  DockerSync,
  DockerSyncWithState,

  DockerDiscoverMySQL,
  DockerSyncMySQL,
  DockerSyncWithStateMySQL,

  DockerDiscoverPostgres,
  DockerSyncPostgres,
  DockerSyncWithStatePostgres,

  LocalDiscover,
  LocalSync,
  LocalSyncWithState,

  LocalDiscoverMySQL,
  LocalSyncMySQL,
  LocalSyncWithStateMySQL,

  LocalDiscoverPostgres,
  LocalSyncPostgres,
  LocalSyncWithStatePostgres,

  MongoDBSourceConfig,
  MongoDBSourceConfigDetails,
  MongoDBStateConfig,
  MongoDBStateConfigDetails,

  MySQLSourceConfig,
  MySQLSourceConfigDetails,
  MySQLStateConfig,
  MySQLStateConfigDetails,
  
  PostgresSourceConfig,
  PostgresSourceConfigDetails,
  PostgresStateConfig,
  PostgresStateConfigDetails,

  S3Config,
  S3ConfigDetails,
  LocalParquetConfig,
};

export default MDXComponents;
