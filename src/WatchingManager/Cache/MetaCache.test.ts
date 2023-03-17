import { MetaCache } from './MetaCache';

describe('Main actions', () => {
  test('save and sync meta data works well', () => {
    const cache = new MetaCache({
      id: 'testing:metaCache:addSessions',
    });

    const toAddSessions = [
      {
        id: '1',
        masterProcessId: 65465,
      },
      {
        id: '2',
        masterProcessId: 65466,
      },
    ];

    cache.set('sessions', toAddSessions);

    cache.syncWithCache();
    expect(cache.values.sessions).toEqual([]);

    cache.addSessions(toAddSessions).save();
    expect(cache.values.sessions).toEqual(toAddSessions);

    cache.flatCache.destroy();
  });

  test('addSessions() works well', () => {
    const cache = new MetaCache({
      id: 'testing:metaCache:addSessions',
    });

    const toAddSessions = [
      {
        id: '1',
        masterProcessId: 65465,
      },
      {
        id: '2',
        masterProcessId: 65466,
      },
    ];

    cache.addSessions(toAddSessions);
    expect(cache.values.sessions).toEqual(toAddSessions);

    cache.syncWithCache();
    expect(cache.values.sessions).not.toEqual(toAddSessions);

    cache.addSessions(toAddSessions).save();
    cache.syncWithCache();
    expect(cache.values.sessions).toEqual(toAddSessions);

    const newToAddSessions = [
      {
        id: '3',
        masterProcessId: 32365,
      },
      {
        id: '4',
        masterProcessId: 45466,
      },
    ];
    cache.addSessions(newToAddSessions);
    expect(cache.values.sessions).toEqual([
      ...toAddSessions,
      ...newToAddSessions,
    ]);

    cache.flatCache.destroy();
  });

  test('removeSessionsByIds works well', () => {
    const cache = new MetaCache({
      id: 'testing:metaCache:removeSessionsByIds',
    });

    const toAddSessions = [
      {
        id: 'session-1',
        masterProcessId: 65465,
      },
      {
        id: 'session-2',
        masterProcessId: 65466,
      },
      {
        id: 'session-3',
        masterProcessId: 65463,
      },
      {
        id: 'session-4',
        masterProcessId: 65445,
      },
    ];

    cache.addSessions(toAddSessions);
    cache.removeSessionsByIds(['session-2', 'session-4']);
    expect(cache.values.sessions).toEqual([toAddSessions[0], toAddSessions[2]]);

    cache.set('sessions', toAddSessions);
    cache.removeSessionsByIds(['session-4']);
    expect(cache.values.sessions).toEqual(toAddSessions.slice(0, 3));

    cache.set('sessions', toAddSessions);
    cache.removeSessionsByIds(toAddSessions.map((session) => session.id));
    expect(cache.values.sessions).toEqual([]);

    cache.flatCache.destroy();
  });

  test('removeSessionsByIndexes works well', () => {
    const cache = new MetaCache({
      id: 'testing:metaCache:removeSessionsByIndexes',
    });

    const toAddSessions = [
      {
        id: 'session-1',
        masterProcessId: 65465,
      },
      {
        id: 'session-2',
        masterProcessId: 65466,
      },
      {
        id: 'session-3',
        masterProcessId: 65463,
      },
      {
        id: 'session-4',
        masterProcessId: 65445,
      },
    ];

    cache.addSessions(toAddSessions);
    cache.removeSessionsByIndexes([0, 2]);
    expect(cache.values.sessions).toEqual([toAddSessions[1], toAddSessions[3]]);

    cache.set('sessions', toAddSessions);
    cache.removeSessionsByIndexes([3]);
    expect(cache.values.sessions).toEqual(toAddSessions.slice(0, 3));

    cache.set('sessions', toAddSessions);
    cache.removeSessionsByIndexes(toAddSessions.map((_, index) => index));
    expect(cache.values.sessions).toEqual([]);

    cache.flatCache.destroy();
  });
});
