import flatCache, { Cache as FlatCache } from 'flat-cache';
import { LOGGER } from '@Utils/Logger';
import { descSortFn, stringify } from '@Utils/helpers';
import { IMetaData } from './types';

interface IOptions {
  id?: string;
}

export class MetaCache {
  public flatCache!: FlatCache;

  public id = 'laravel-mix-glob:meta';

  private _values!: IMetaData;

  constructor(options?: IOptions) {
    if (options?.id) {
      this.id = options?.id;
    }
    // Load the cache first time and sync
    this.syncWithCache();
  }

  get values(): IMetaData {
    return this._values;
  }

  public syncWithCache(): this {
    this.flatCache = flatCache.load(this.id);
    this._values = this.flatCache.all() as IMetaData;

    if (!this._values.sessions) {
      this._values.sessions = [];
    }

    LOGGER.debug('MetaCache: sync (file read):');
    LOGGER.debug(this.values);

    return this;
  }

  public set<T extends keyof IMetaData>(key: T, value: IMetaData[T]): this {
    if (this._values[key] !== value) {
      this._values[key] = value;
      this.flatCache.setKey(key, value);
    }
    return this;
  }

  public save(): this {
    LOGGER.debug('MetaCache: save()');
    this.flatCache.save();
    return this;
  }

  public getSessionIndex(sessionId: string): number {
    return this._values.sessions.findIndex(
      (session) => session.id === sessionId,
    );
  }

  public addSessions(sessions: IMetaData['sessions']): this {
    LOGGER.debug(`MetaCache: add sessions ${stringify(sessions)}`);
    const oldValue = stringify(this._values.sessions);

    sessions.forEach((session) => {
      const sessionIndex = this.getSessionIndex(session.id);
      if (sessionIndex > -1) {
        this._values.sessions.splice(sessionIndex, 1, session);
      } else {
        this._values.sessions.push(session);
      }
    });

    LOGGER.debug(`${oldValue}\n=>\n${stringify(this._values.sessions)}`);

    this.flatCache.setKey('sessions', this._values.sessions);

    return this;
  }

  public removeSessionsByIndexes(indexes: number[]): this {
    indexes.sort(descSortFn).forEach((index) => {
      this._values.sessions.splice(index, 1);
    });
    this.flatCache.setKey('sessions', this._values.sessions);
    return this;
  }

  public removeSessionsByIds(sessionsIds: string[]): this {
    LOGGER.debug(`MetaCache: add sessions ${JSON.stringify(sessionsIds)}`);
    const oldValue = stringify(this._values.sessions);

    sessionsIds.forEach((id) => {
      const index = this.getSessionIndex(id);
      if (index > -1) {
        this._values.sessions.splice(index, 1);
      }
    });

    LOGGER.debug(`${oldValue}\n=>\n${stringify(this._values.sessions)}`);

    return this;
  }
}
