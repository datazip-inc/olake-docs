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
import LocalDiscover from '../../../docs/shared/commands/LocalDiscover.mdx'
import LocalSync from '../../../docs/shared/commands/LocalSync.mdx'
import LocalSyncWithState from '../../../docs/shared/commands/LocalSyncWithState.mdx'
import Hr from '@site/src/components/Hr'

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
DockerDiscover,
DockerSync,
DockerSyncWithState,
LocalDiscover,
LocalSync,
LocalSyncWithState,
Hr
};

export default MDXComponents;
