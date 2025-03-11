import { usePluginData } from "@docusaurus/useGlobalData";
import { IGlobalData } from "@site/src/types/download";

function numberFormat(num: number): string | number {
  return num < 1000 ? num : (num / 1000).toFixed(1) + 'K';
}

const useGetReleases = () => {
  // Attempt to fetch plugin data, fallback to undefined if not available.
  const pluginData = usePluginData('fetch-databend-releases') as IGlobalData | undefined;

  // Use fallback defaults if pluginData is missing
  const releasesList = pluginData?.releasesList || [];
  const repoResource = pluginData?.repoResource || null;
  const stargazersCount = pluginData?.stargazersCount || 0;
  const bendsqlRecource = pluginData?.bendsqlRecource || null;
  
  // Use a fallback name; you can update this if needed
  const name = releasesList.length > 0 ? releasesList[0].name : 'latest';
  const formatStargazersCount = numberFormat(stargazersCount);
  
  return {
    releasesList,
    tagName: name,
    name,
    repoResource,
    stargazersCount,
    formatStargazersCount,
    bendsqlRecource,
  };
};

export default useGetReleases;
