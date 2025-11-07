import InitialComponents from '@theme-original/MDXComponents';
import Badge from "./Badge";
import Tpsr from "./Tpsr";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Hr from '@site/src/components/Hr'
import BlogCTA from '@site/src/components/BlogCTA'

import YouTubeEmbed from '@site/src/components/webinars/YouTubeEmbed';

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

import DockerDiscoverOracle from '../../../docs/shared/commands/DockerDiscoverOracle.mdx'
import DockerSyncOracle from '../../../docs/shared/commands/DockerSyncOracle.mdx'

import LocalDiscoverMongoDB from '../../../docs/shared/commands/LocalDiscoverMongoDB.mdx'
import LocalSyncMongoDB from '../../../docs/shared/commands/LocalSyncMongoDB.mdx'
import LocalSyncWithStateMongoDB from '../../../docs/shared/commands/LocalSyncWithStateMongoDB.mdx'

import LocalDiscoverMySQL from '../../../docs/shared/commands/LocalDiscoverMySQL.mdx'
import LocalSyncMySQL from '../../../docs/shared/commands/LocalSyncMySQL.mdx'
import LocalSyncWithStateMySQL from '../../../docs/shared/commands/LocalSyncWithStateMySQL.mdx'

import LocalDiscoverPostgres from '../../../docs/shared/commands/LocalDiscoverPostgres.mdx'
import LocalSyncPostgres from '../../../docs/shared/commands/LocalSyncPostgres.mdx'
import LocalSyncWithStatePostgres from '../../../docs/shared/commands/LocalSyncWithStatePostgres.mdx'

import LocalDiscoverOracle from '../../../docs/shared/commands/LocalDiscoverOracle.mdx'
import LocalSyncOracle from '../../../docs/shared/commands/LocalSyncOracle.mdx'

import MongoDBSourceConfig from '../../../docs/shared/config/MongoDBSourceConfig.mdx'
import MongoDBSourceConfigWithSRV from '../../../docs/shared/config/MongoDBSourceConfigWithSRV.mdx'
import MongoDBSourceConfigDetails from '../../../docs/shared/config/MongoDBSourceConfigDetails.mdx'
import MongoDBStateConfig from '../../../docs/shared/config/MongoDBStateConfig.mdx'
import MongoDBStateConfigDetails from '../../../docs/shared/config/MongoDBStateConfigDetails.mdx'

import MySQLSourceConfig from '../../../docs/shared/config/MySQLSourceConfig.mdx'
import MySQLSourceConfigDetails from '../../../docs/shared/config/MySQLSourceConfigDetails.mdx'
import MySQLStateConfig from '../../../docs/shared/config/MySQLStateConfig.mdx'
import MySQLStateConfigDetails from '../../../docs/shared/config/MySQLStateConfigDetails.mdx'
import MySQLToIcebergDatatypes from '../../../docs/shared/config/MySQLToIcebergDatatypes.mdx'

import PostgresSourceConfig from '../../../docs/shared/config/PostgresSourceConfig.mdx'
import PostgresSourceConfigDetails from '../../../docs/shared/config/PostgresSourceConfigDetails.mdx'
import PostgresStateConfig from '../../../docs/shared/config/PostgresStateConfig.mdx'
import PostgresStateConfigDetails from '../../../docs/shared/config/PostgresStateConfigDetails.mdx'
import PostgresToIcebergDatatypes from '../../../docs/shared/config/PostgresToIcebergDatatypes.mdx'

import OracleSourceConfig from '../../../docs/shared/config/OracleSourceConfig.mdx'
import OraclePermissions from '../../../docs/shared/config/OraclePermissions.mdx'
import OracleToIcebergDatatypes from '../../../docs/shared/config/OracleToIcebergDatatypes.mdx'

import LocalParquetConfig from '../../../docs/shared/config/LocalParquetConfig.mdx'
import DockerParquetConfig from '../../../docs/shared/config/DockerParquetConfig.mdx'
import S3Config from '../../../docs/shared/config/S3Config.mdx'
import S3ConfigGCS from '../../../docs/shared/config/S3ConfigGCS.mdx'
import S3ConfigMinIO from '../../../docs/shared/config/S3ConfigMinIO.mdx'
import S3ConfigDetails from '../../../docs/shared/config/S3ConfigDetails.mdx'
import S3ConfigUIDetails from '../../../docs/shared/config/S3ConfigUIDetails.mdx'

import GlueIcebergWriterConfig from '../../../docs/shared/config/GlueIcebergWriterConfig.mdx'
import MinioJDBCIcebergWriterConfigLocal from '../../../docs/shared/config/MinioJDBCIcebergWriterConfigLocal.mdx'
import GlueIcebergWriterConfigDetails from '../../../docs/shared/config/GlueIcebergWriterConfigDetails.mdx'
import GlueIcebergWriterUIConfigDetails from '../../../docs/shared/config/GlueIcebergWriterUIConfigDetails.mdx'
import MinioJDBCIcebergWriterConfigLocalDetails from '../../../docs/shared/config/MinioJDBCIcebergWriterConfigLocalDetails.mdx'
import MinioJDBCIcebergWriterUIConfigLocalDetails from '../../../docs/shared/config/MinioJDBCIcebergWriterUIConfigLocalDetails.mdx'

import RESTIcebergWriterConfig from '../../../docs/shared/config/RESTIcebergWriterConfig.mdx'
import RESTIcebergWriterConfigDetails from '../../../docs/shared/config/RESTIcebergWriterConfigDetails.mdx'
import RESTIcebergWriterUIConfigDetails from '../../../docs/shared/config/RESTIcebergWriterUIConfigDetails.mdx'

import HiveIcebergWriterConfig from '../../../docs/shared/config/HiveIcebergWriterConfig.mdx'
import HiveIcebergWriterConfigDetails from '../../../docs/shared/config/HiveIcebergWriterConfigDetails.mdx'
import HiveIcebergWriterUIConfigDetails from '../../../docs/shared/config/HiveIcebergWriterUIConfigDetails.mdx'

import AdditionalReferences from '../../../docs/shared/AdditionalReferences.mdx'
import CatalogQuery from '../../../docs/shared/CatalogQuery.mdx'
import IcebergQueryEngines from '@site/src/components/Iceberg/IcebergQueryEngines'

import OLakeFeaturesTLDR from '../../../docs/shared/OLakeFeaturesTLDR.mdx'
import SupportedSources from '../../../docs/shared/SupportedSources.mdx'
import SupportedDestinations from '../../../docs/shared/SupportedDestinations.mdx'
import SupportedIcebergCatalogs from '../../../docs/shared/SupportedIcebergCatalogs.mdx'

import SelectedStreamsOnly from '../../../docs/shared/streams/SelectedStreamsOnly.mdx'
import SelectedStreamsOnlyDetails from '../../../docs/shared/streams/SelectedStreamsOnlyDetails.mdx'
import StreamsFull from '../../../docs/shared/streams/StreamsFull.mdx'
import StreamsOnly from '../../../docs/shared/streams/StreamsOnly.mdx'
import StreamsOnlyDetails from '../../../docs/shared/streams/StreamsOnlyDetails.mdx'
import StreamsConfiguration from '../../../docs/shared/streams/StreamsConfiguration.mdx'

import OLakePathInfo from '../../../docs/shared/OLakePathInfo.mdx'
import StreamSelectionExample from '../../../docs/shared/StreamSelectionExample.mdx'


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

  DockerDiscoverOracle,
  DockerSyncOracle,

  LocalDiscoverMongoDB,
  LocalSyncMongoDB,
  LocalSyncWithStateMongoDB,

  LocalDiscoverMySQL,
  LocalSyncMySQL,
  LocalSyncWithStateMySQL,

  LocalDiscoverPostgres,
  LocalSyncPostgres,
  LocalSyncWithStatePostgres,

  LocalDiscoverOracle,
  LocalSyncOracle,

  MongoDBSourceConfig,
  MongoDBSourceConfigWithSRV,
  MongoDBSourceConfigDetails,
  MongoDBStateConfig,
  MongoDBStateConfigDetails,

  MySQLSourceConfig,
  MySQLSourceConfigDetails,
  MySQLStateConfig,
  MySQLStateConfigDetails,
  MySQLToIcebergDatatypes,
  
  PostgresSourceConfig,
  PostgresSourceConfigDetails,
  PostgresStateConfig,
  PostgresStateConfigDetails,
  PostgresToIcebergDatatypes,

  OracleSourceConfig,
  OraclePermissions,
  OracleToIcebergDatatypes,

  S3Config,
  S3ConfigGCS,
  S3ConfigMinIO,
  S3ConfigDetails,
  S3ConfigUIDetails,
  LocalParquetConfig,
  DockerParquetConfig,

  GlueIcebergWriterConfig,
  MinioJDBCIcebergWriterConfigLocal,
  GlueIcebergWriterConfigDetails,
  GlueIcebergWriterUIConfigDetails,
  MinioJDBCIcebergWriterConfigLocalDetails,
  MinioJDBCIcebergWriterUIConfigLocalDetails,

  RESTIcebergWriterConfig,
  RESTIcebergWriterConfigDetails,
  RESTIcebergWriterUIConfigDetails,

  HiveIcebergWriterConfig,
  HiveIcebergWriterConfigDetails,
  HiveIcebergWriterUIConfigDetails,

  AdditionalReferences,
  CatalogQuery,
  YouTubeEmbed,
  IcebergQueryEngines,

  OLakeFeaturesTLDR,
  SupportedSources,
  SupportedDestinations,
  SupportedIcebergCatalogs,

  SelectedStreamsOnly,
  SelectedStreamsOnlyDetails,
  StreamsFull,
  StreamsOnly,
  StreamsOnlyDetails,
  StreamsConfiguration,

  OLakePathInfo,
  StreamSelectionExample
};

export default MDXComponents;
