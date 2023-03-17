import { Cache } from '../Cache/index';

export interface IOptions {
  cacheHandler: Cache;
}

export type TRestartReason = 'add' | 'unlink' | 'unlinkDir';
