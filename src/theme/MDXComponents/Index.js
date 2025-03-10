import InitialComponents from '@theme-original/MDXComponents';
import Badge from "./Badge";
// import Image from "./Image";
import Tpsr from "./Tpsr";
// import img from "./ZoomedImage";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import DocsFooter from '../../../docs/shared/DocsFooter.mdx'

import DockerDiscover from '../../../docs/shared/commands/DockerDiscover.mdx'
import DockerSync from '../../../docs/shared/commands/DockerSync.mdx'
import DockerSyncWithState from '../../../docs/shared/commands/DockerSyncWithState.mdx'

import DockerDiscoverMySQL from '../../../docs/shared/commands/DockerDiscoverMySQL.mdx'
import DockerSyncMySQL from '../../../docs/shared/commands/DockerSyncMySQL.mdx'
import DockerSyncWithStateMySQL from '../../../docs/shared/commands/DockerSyncWithStateMySQL.mdx'

import LocalDiscover from '../../../docs/shared/commands/LocalDiscover.mdx'
import LocalSync from '../../../docs/shared/commands/LocalSync.mdx'
import LocalSyncWithState from '../../../docs/shared/commands/LocalSyncWithState.mdx'

import LocalDiscoverMySQL from '../../../docs/shared/commands/LocalDiscoverMySQL.mdx'
import LocalSyncMySQL from '../../../docs/shared/commands/LocalSyncMySQL.mdx'
import LocalSyncWithStateMySQL from '../../../docs/shared/commands/LocalSyncWithStateMySQL.mdx'


import MySQLSourceConfig from '../../../docs/shared/config/MySQLSourceConfig.mdx'
import MySQLSourceConfigDetails from '../../../docs/shared/config/MySQLSourceConfigDetails.mdx'
import MySQLStateConfig from '../../../docs/shared/config/MySQLStateConfig.mdx'
import MySQLStateConfigDetails from '../../../docs/shared/config/MySQLStateConfigDetails.mdx'

import MongoDBSourceConfig from '../../../docs/shared/config/MongoDBSourceConfig.mdx'
import MongoDBSourceConfigDetails from '../../../docs/shared/config/MongoDBSourceConfigDetails.mdx'
import MongoDBStateConfig from '../../../docs/shared/config/MongoDBStateConfig.mdx'
import MongoDBStateConfigDetails from '../../../docs/shared/config/MongoDBStateConfigDetails.mdx'

import LocalParquetConfig from '../../../docs/shared/config/LocalParquetConfig.mdx'
import S3Config from '../../../docs/shared/config/S3Config.mdx'
import S3ConfigDetails from '../../../docs/shared/config/S3ConfigDetails.mdx'


import Hr from '@site/src/components/Hr'
import DocCardList from '@theme/DocCardList';


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
  DocCardList,

  DockerDiscover,
  DockerSync,
  DockerSyncWithState,

  DockerDiscoverMySQL,
  DockerSyncMySQL,
  DockerSyncWithStateMySQL,

  LocalDiscover,
  LocalSync,
  LocalSyncWithState,

  LocalDiscoverMySQL,
  LocalSyncMySQL,
  LocalSyncWithStateMySQL,

  MySQLSourceConfig,
  MySQLSourceConfigDetails,
  MySQLStateConfig,
  MySQLStateConfigDetails,

  MongoDBSourceConfig,
  MongoDBSourceConfigDetails,
  MongoDBStateConfig,
  MongoDBStateConfigDetails,
  
  S3Config,
  S3ConfigDetails,
  LocalParquetConfig,
};

export default MDXComponents;
