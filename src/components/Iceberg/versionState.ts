import { VersionMode } from '../../types/iceberg';

const STORAGE_KEY = 'iceberg_query_engine_version';

export const normalizeVersion = (value?: string | null): VersionMode => (value === 'v2' ? 'v2' : 'v3');

export const getVersionFromUrl = (search?: string): VersionMode | null => {
  if (!search) return null;
  const params = new URLSearchParams(search);
  const version = params.get('version');
  return version === 'v2' || version === 'v3' ? version : null;
};

export const getPersistedVersion = (): VersionMode | null => {
  if (typeof window === 'undefined') return null;
  return normalizeVersion(window.localStorage.getItem(STORAGE_KEY));
};

export const persistVersion = (version: VersionMode): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, version);
};

export const buildEngineDetailUrl = (engineId: string, version: VersionMode): string =>
  `/iceberg/query-engine/${engineId}?version=${version}`;
