import InitialComponents from '@theme-original/MDXComponents';
import Badge from "./Badge";
import Tpsr from "./Tpsr";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Hr from '@site/src/components/Hr'
import BlogCTA from '@site/src/components/BlogCTA'

import DocCardList from '@theme/DocCardList';
import DocsFooter from '../../../docs/shared/DocsFooter.mdx'

import DockerDiscoverMongoDB from '../../../docs/shared/commands/DockerDiscoverMongoDB.mdx'
import DockerSyncMongoDB from '../../../docs/shared/commands/DockerSyncMongoDB.mdx'
import DockerSyncWithStateMongoDB from '../../../docs/shared/commands/DockerSyncWithStateMongoDB.mdx'

import DockerDiscoverMySQL from '../../../docs/shared/commands/DockerDiscoverMySQL.mdx'
import DockerSyncMySQL from '../../../docs/shared/commands/DockerSyncMySQL.mdx'
import DockerSyncWithStateMySQL from '../../../docs/shared/commands/DockerSyncWithStateMySQL.mdx'

import DockerDiscoverPostgres from '../../../docs/shared/commands/DockerDiscoverPostgres.mdx'
import DockerSyncPostgres from '../../../docs/shared/commands/DockerSyncPostgres.mdx'
import DockerSyncWithStatePostgres from '../../../docs/shared/commands/DockerSyncWithStatePostgres.mdx'

import LocalDiscoverMongoDB from '../../../docs/shared/commands/LocalDiscoverMongoDB.mdx'
import LocalSyncMongoDB from '../../../docs/shared/commands/LocalSyncMongoDB.mdx'
import LocalSyncWithStateMongoDB from '../../../docs/shared/commands/LocalSyncWithStateMongoDB.mdx'

import LocalDiscoverMySQL from '../../../docs/shared/commands/LocalDiscoverMySQL.mdx'
import LocalSyncMySQL from '../../../docs/shared/commands/LocalSyncMySQL.mdx'
import LocalSyncWithStateMySQL from '../../../docs/shared/commands/LocalSyncWithStateMySQL.mdx'

import LocalDiscoverPostgres from '../../../docs/shared/commands/LocalDiscoverPostgres.mdx'
import LocalSyncPostgres from '../../../docs/shared/commands/LocalSyncPostgres.mdx'
import LocalSyncWithStatePostgres from '../../../docs/shared/commands/LocalSyncWithStatePostgres.mdx'

import MongoDBSourceConfig from '../../../docs/shared/config/MongoDBSourceConfig.mdx'
import MongoDBSourceConfigWithSRV from '../../../docs/shared/config/MongoDBSourceConfigWithSRV.mdx'
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
import DockerParquetConfig from '../../../docs/shared/config/DockerParquetConfig.mdx'
import S3Config from '../../../docs/shared/config/S3Config.mdx'
import S3ConfigDetails from '../../../docs/shared/config/S3ConfigDetails.mdx'

import GlueIcebergWriterConfig from '../../../docs/shared/config/GlueIcebergWriterConfig.mdx'
import MinioJDBCIcebergWriterConfigLocal from '../../../docs/shared/config/MinioJDBCIcebergWriterConfigLocal.mdx'
import GlueIcebergWriterConfigDetails from '../../../docs/shared/config/GlueIcebergWriterConfigDetails.mdx'
import MinioJDBCIcebergWriterConfigLocalDetails from '../../../docs/shared/config/MinioJDBCIcebergWriterConfigLocalDetails.mdx'

import RESTIcebergWriterConfig from '../../../docs/shared/config/RESTIcebergWriterConfig.mdx'
import RESTIcebergWriterConfigDetails from '../../../docs/shared/config/RESTIcebergWriterConfigDetails.mdx'

import HiveIcebergWriterConfig from '../../../docs/shared/config/HiveIcebergWriterConfig.mdx'
import HiveIcebergWriterConfigDetails from '../../../docs/shared/config/HiveIcebergWriterConfigDetails.mdx'

import AdditionalReferences from '../../../docs/shared/AdditionalReferences.mdx'
import CatalogQuery from '../../../docs/shared/CatalogQuery.mdx'
import YouTubeEmbed from '@site/src/components/webinars/YouTubeEmbed'

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

  DockerDiscoverMongoDB,
  DockerSyncMongoDB,
  DockerSyncWithStateMongoDB,

  DockerDiscoverMySQL,
  DockerSyncMySQL,
  DockerSyncWithStateMySQL,

  DockerDiscoverPostgres,
  DockerSyncPostgres,
  DockerSyncWithStatePostgres,

  LocalDiscoverMongoDB,
  LocalSyncMongoDB,
  LocalSyncWithStateMongoDB,

  LocalDiscoverMySQL,
  LocalSyncMySQL,
  LocalSyncWithStateMySQL,

  LocalDiscoverPostgres,
  LocalSyncPostgres,
  LocalSyncWithStatePostgres,

  MongoDBSourceConfig,
  MongoDBSourceConfigWithSRV,
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
  DockerParquetConfig,

  GlueIcebergWriterConfig,
  MinioJDBCIcebergWriterConfigLocal,
  GlueIcebergWriterConfigDetails,
  MinioJDBCIcebergWriterConfigLocalDetails,

  RESTIcebergWriterConfig,
  RESTIcebergWriterConfigDetails,

  HiveIcebergWriterConfig,
  HiveIcebergWriterConfigDetails,

  AdditionalReferences,
  CatalogQuery,
  YouTubeEmbed
};

export default MDXComponents;
