/* eslint-disable no-param-reassign */
import uniq from 'lodash.uniq';
import { v4 as uuidv4 } from 'uuid';
import { LOGGER } from '@Utils/Logger';
import flatCache, { Cache as FlatCache } from 'flat-cache';
import {
  isChildProcess,
  isProcessRunning,
  killProcess,
  runMacroTask,
} from '@Utils/helpers';
import { IOptions, IWatchingCacheData } from './types';
import { MetaCache } from './MetaCache';

/**
 * Cache handler that allow us to read the data from the cache.
 * Reset the cache after that. While the data will be accessible through values prop
 * The design is that every mix initial process would have it's own session
 * Every session is a flat-cache
 * Then there is the meta cache that track all sessions. So that we can detect orphans processes
 * And clean them through cleanOrphans() function.
 *
 * Actual meta cache flat cache structure.
 *
 * ```json
 * [
 *    { sessions: '1' },
 *    ['2', '3', '4'],
 *    { id: '5', masterProcessId: 66865 },
 *    { id: '6', masterProcessId: 73938 },
 *    { id: '7', masterProcessId: 80739 },
 *    'laravel-mix-glob:session-a61493e5-48e4-4a56-ae07-4b2b22300569',
 *    'laravel-mix-glob:session-a3f49d5a-37a3-4884-9270-5d7f4e5a9418',
 *    'laravel-mix-glob:session-8f9f63db-9046-4624-a89d-3bf1876bc90e',
 * ];
 * ```
 * ```ts
 * export interface IMetaData {
 *   sessions: ISession[];
 * }
 *
 * export interface ISession {
 *   id: string;
 *   masterProcessId: number;
 * }
 * ```
 * NOTE: You can find it on `node_modules/flat-cache/.cache/laravel-mix-glob:meta`
 *
 * Every session cache would go as:
 *
 * ```ts
 * export interface IWatchingCacheData {
 *   childPids: number[];
 * }
 * ```
 *
 * With a flat cache id like `laravel-mix-glob:session-0ba13e16-22fb-4dbd-a0a6-905727b6aef5`
 *
 * where the session id is `session-0ba13e16-22fb-4dbd-a0a6-905727b6aef5` generated using uuid v4.
 */
export class Cache {
  public flatCache!: FlatCache;

  public metaCache: MetaCache;

  public sessionId!: string;

  private _values: IWatchingCacheData = {
    childPids: [],
  };

  constructor(options?: IOptions) {
    this.metaCache = options?.metaCache || new MetaCache();

    if (options?.cache) {
      this.flatCache = options.cache;
      return;
    }

    this.sessionId = this._getSessionCacheId();
    // loading the cache and syncing
    this.syncWithCache();
  }

  get values(): IWatchingCacheData {
    return this._values;
  }

  private _getSessionCacheId(): string {
    LOGGER.debug('Get Session Cache Id >');

    if (isChildProcess()) {
      LOGGER.debug(
        `Already exist (child) > ${process.env.GLOB_MIX_SESSION_ID}`,
      );
      return process.env.GLOB_MIX_SESSION_ID as string;
    }

    const sessionId = `laravel-mix-glob:session-${uuidv4()}`;
    LOGGER.debug(`Master > Generate new one > ${sessionId}`);

    this.metaCache.addSessions([
      {
        id: sessionId,
        masterProcessId: process.pid,
      },
    ]);

    this.metaCache.save();

    return sessionId;
  }

  /**
   * Load cache data to values and update cache ref
   *
   * NOTE: After reset of the cache the values are not reset
   */
  public syncWithCache(): this {
    this.flatCache = flatCache.load(this.sessionId);
    this._values = this.flatCache.all() as IWatchingCacheData;

    if (!this._values.childPids) {
      this._values.childPids = [];
    }

    this._values.childPids = this._values.childPids.map(
      (pid: number | string) => Number(pid),
    );

    LOGGER.debug('Cache: sync (file read):');
    LOGGER.debug(this._values);

    return this;
  }

  public destroy(): void {
    this.flatCache.destroy();
  }

  /**
   * commit and save the changes to the cache
   * @returns this
   */
  public save(): this {
    LOGGER.debug('Cache: save()');
    this.flatCache.save();
    return this;
  }

  /**
   * Push child pids into the list with keeping unicity
   * @param pids child pids to push to the list
   * @returns true if new elements are added. False if none new are added.
   */
  public addChildPids(pids: number[]): this {
    LOGGER.debug(`Cache: add child pids ${JSON.stringify(pids)}`);
    const oldValue = JSON.stringify(this._values.childPids);

    this._values.childPids = uniq([...this._values.childPids, ...pids]);

    LOGGER.debug(`${oldValue} => ${JSON.stringify(this._values.childPids)}`);

    this.flatCache.setKey('childPids', this._values.childPids);

    return this;
  }

  /**
   * Remove child pids from the list with keeping unicity
   * @param pids child pids to remove from the list
   * @returns true if new elements are remove. False if none are removed.
   */
  public removeChildPids(pids: number[]): this {
    LOGGER.debug(`Cache: removing child pids ${JSON.stringify(pids)}`);
    const oldValue = JSON.stringify(this._values.childPids);

    this._values.childPids = this._values.childPids.filter(
      (pid) => !pids.includes(pid),
    );

    LOGGER.debug(`${oldValue} => ${JSON.stringify(this._values.childPids)}`);

    this.flatCache.setKey('childPids', this._values.childPids);
    return this;
  }

  public resetChildPids(): this {
    if (this._values.childPids.length > 0) {
      this._values.childPids = [];
      this.flatCache.setKey('childPids', this._values.childPids);
    }
    return this;
  }

  /**
   * Set a specific cache entry
   * @param key entry key
   * @param value entry value
   * @returns this
   */
  public set<T extends keyof IWatchingCacheData>(
    key: T,
    value: IWatchingCacheData[T],
  ): this {
    if (this._values[key] !== value) {
      this._values[key] = value;
      this.flatCache.setKey(key, value);
    }
    return this;
  }

  /**
   * Clean orphan sessions (clean cache and processes)
   * - kill any orphans processes
   * - delete cache documents
   * @returns this
   */
  public cleanOrphans(): this {
    LOGGER.debug('cleanOrphans >');
    LOGGER.debug('Sessions:', this.metaCache.values.sessions);

    if (this.metaCache.values.sessions.length > 0) {
      this.metaCache.values.sessions.forEach((session) => {
        LOGGER.debug(`session-${session.id} > schedule macro task`);

        runMacroTask(() => {
          LOGGER.debug(
            `session-${session.id} > check if master process is running`,
          );

          if (!isProcessRunning(session.masterProcessId)) {
            LOGGER.debug(
              `session-${session.id} > process not running > clean orphans`,
            );

            /**
             * remove orphan session from cache
             * - kill any orphans processes
             * - delete cache document
             */
            LOGGER.debug(`session-${session.id} > load cache`);
            const toCleanCache = flatCache.load(session.id);

            // kill any orphan processes
            const childPids: number[] = toCleanCache.getKey('childPids') || [];
            LOGGER.debug(`session-${session.id} > childPids`, childPids);
            if (childPids.length > 0) {
              childPids.forEach((pid) => {
                killProcess(pid);
              });
            }

            // delete cache document
            LOGGER.debug(`session-${session.id} > destroy cache document`);
            toCleanCache.destroy();

            // update sessions in meta cache
            LOGGER.debug(
              `session-${session.id} > remove session from meta cache`,
            );
            this.metaCache.removeSessionsByIds([session.id]).save();
          }
        });
      });
    }
    return this;
  }
}
