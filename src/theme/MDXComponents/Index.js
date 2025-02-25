import InitialComponents from '@theme-original/MDXComponents';
import Badge from "./Badge";
// import Image from "./Image";
import Tpsr from "./Tpsr";
// import img from "./ZoomedImage";
import DocsFooter from '../../../docs/shared/DocsFooter.mdx'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


const MDXComponents = {
  ...InitialComponents,
  Badge,
//   Image,
  Tpsr,
//   img,
//   Img: img,
DocsFooter,
Tabs,
TabItem
};

export default MDXComponents;
