import { Cache } from 'flat-cache';
import type { MetaCache } from './MetaCache';

export interface IOptions {
  cacheId?: string;
  cache?: Cache;
  metaCache?: MetaCache;
}

export interface IWatchingCacheData {
  childPids: number[];
}

export interface IMetaData {
  sessions: ISession[];
}

export interface ISession {
  id: string;
  masterProcessId: number;
}
