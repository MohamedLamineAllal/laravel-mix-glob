/* eslint-disable import/first */
import { jest } from '@jest/globals';

jest.mock('./MetaCache');
import { MetaCache } from './MetaCache';
import { Cache } from './index';

const MetaCacheMock = jest.mocked(MetaCache);

beforeEach(() => {
  MetaCacheMock.mockClear();
});

describe('Main actions', () => {
  test('Cache constructed correctly and session added', () => {
    const cache = new Cache();
    expect(MetaCacheMock).toBeCalledTimes(1);
    const instanceMock = MetaCacheMock.mock.instances[0];
    expect(instanceMock.addSessions).toBeCalledTimes(1);
    expect(instanceMock.addSessions).toBeCalledWith([
      {
        id: cache.sessionId,
        masterProcessId: process.pid,
      },
    ]);
    expect(instanceMock.save).toBeCalledTimes(1);

    cache.destroy();
  });

  test('save and sync cache works well', () => {
    const cache = new Cache();

    const toAddPids = [1, 2];

    cache.set('childPids', toAddPids);
    cache.syncWithCache();

    expect(cache.values.childPids).toEqual([]);

    cache.addChildPids(toAddPids).save();
    expect(cache.values.childPids).toEqual(toAddPids);

    cache.destroy();
  });

  test('addChildPids() works well', () => {
    const cache = new Cache();

    const toAddPids = [1, 2];

    cache.addChildPids(toAddPids);
    expect(cache.values.childPids).toEqual(toAddPids);

    cache.syncWithCache();
    expect(cache.values.childPids).not.toEqual(toAddPids);

    cache.addChildPids(toAddPids).save();
    cache.syncWithCache();
    expect(cache.values.childPids).toEqual(toAddPids);

    const newAdded = [4, 5, 6];
    cache.addChildPids(newAdded);
    expect(cache.values.childPids).toEqual([...toAddPids, ...newAdded]);

    cache.destroy();
  });

  test('removeChildPids works well', () => {
    const cache = new Cache();

    const toAddPids = [1, 2, 3, 4];

    cache.addChildPids(toAddPids);
    cache.removeChildPids([2, 4]);
    expect(cache.values.childPids).toEqual([toAddPids[0], toAddPids[2]]);

    cache.set('childPids', toAddPids);
    cache.removeChildPids([4]);
    expect(cache.values.childPids).toEqual(toAddPids.slice(0, 3));

    cache.set('childPids', toAddPids);
    cache.removeChildPids(toAddPids);
    expect(cache.values.childPids).toEqual([]);

    cache.destroy();
  });
});
