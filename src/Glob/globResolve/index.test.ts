import path from 'path';
import { globResolve } from './index';
import { TGlobResolveGlobParam } from './types';

const fixtureDir = path.resolve(__dirname, './__fixtures__');

const dotFilesList: string[] = [
  `${fixtureDir}/dotFiles/.bashrc`,
  `${fixtureDir}/dotFiles/.eslintignore`,
  `${fixtureDir}/dotFiles/.myAliases`,
  `${fixtureDir}/dotFiles/.npmignore`,
  `${fixtureDir}/dotFiles/.some1.json`,
  `${fixtureDir}/dotFiles/.zshrc`,
];

interface ITestObj {
  name?: string;
  glb: TGlobResolveGlobParam;
  expected: string[];
}

function runTests(category: string, tests: ITestObj[]): void {
  tests.forEach((tst, index) => {
    test(
      tst.name
        ? `${category}: ${tst.name}`
        : `${category}: test of index ${index}`,
      () => {
        const result = globResolve(tst.glb);
        expect(result).toEqual(tst.expected);
      },
    );
  });
}

test('that returned paths are absolute paths', () => {
  function runIsAbsoluteTests(globs: TGlobResolveGlobParam[]) {
    globs.forEach((glob) => {
      const files = globResolve(glob);
      expect(Array.isArray(files)).toBeTruthy();
      files.forEach((file) => {
        expect(path.isAbsolute(file)).toBeTruthy();
      });
    });
  }

  runIsAbsoluteTests([
    `${fixtureDir}/**/*`,
    [`${fixtureDir}/**/*.ts`, `${fixtureDir}/**/*.json`],
    {
      pattern: `${fixtureDir}/**/*`,
      options: {
        ignore: [`${fixtureDir}/**/*.json`],
      },
    },
    (fglb) => fglb(`${fixtureDir}/**/*`),
  ]);
});

describe('Testing params', () => {
  runTests('String param', [
    {
      glb: `${fixtureDir}/**/*/index.ts`,
      expected: [
        /**
         * NOTE: Order follow the traversal order. Top down.
         * NOTE: And it follow the Local compare => case sensitive  Alphabetic
         * NOTE: case sensitive means Capital letters go first alphabetically
         * NOTE: then next not capital one
         * MORE Performing that way. default of fast-glob
         */
        `${fixtureDir}/files/src/index.ts`,
        `${fixtureDir}/files/src/core/index.ts`,
      ],
    },
    {
      name: 'testing default works (dotFiles)',
      glb: `${fixtureDir}/dotFiles/*`,
      expected: dotFilesList,
    },
    {
      glb: `${fixtureDir}/files/src/*`,
      /**
       * NOTE: Order follow the traversal order. Top down.
       * NOTE: And it follow the Local compare => case sensitive  Alphabetic
       * NOTE: [better performance for fast-glob]
       * NOTE: case sensitive means Capital letters go first alphabetically
       * NOTE: then next not capital one
       * MORE Performing that way. default of fast-glob
       */
      expected: [
        `${fixtureDir}/files/src/Lollipop.ts`,
        `${fixtureDir}/files/src/index.ts`,
        `${fixtureDir}/files/src/someFile.ts`,
      ],
    },
  ]);

  runTests('String[] param', [
    {
      glb: [`${fixtureDir}/**/*/index.ts`],
      expected: [
        `${fixtureDir}/files/src/index.ts`,
        `${fixtureDir}/files/src/core/index.ts`,
      ],
    },
    {
      glb: [`${fixtureDir}/dotFiles/*`],
      expected: dotFilesList,
    },
    {
      glb: [`${fixtureDir}/files/src/*`],
      expected: [
        `${fixtureDir}/files/src/Lollipop.ts`,
        `${fixtureDir}/files/src/index.ts`,
        `${fixtureDir}/files/src/someFile.ts`,
      ],
    },
    {
      glb: [
        `${fixtureDir}/files/src/*index.ts`,
        `${fixtureDir}/files/src/core/*index.ts`,
      ],
      expected: [
        `${fixtureDir}/files/src/index.ts`,
        `${fixtureDir}/files/src/core/index.ts`,
      ],
    },
    {
      glb: [`${fixtureDir}/dotFiles/*`, `${fixtureDir}/files/src/*`],
      expected: [
        ...dotFilesList,
        `${fixtureDir}/files/src/Lollipop.ts`,
        `${fixtureDir}/files/src/index.ts`,
        `${fixtureDir}/files/src/someFile.ts`,
      ],
    },
  ]);

  runTests('Object param', [
    {
      name: 'test object have default while options not provided',
      glb: {
        pattern: `${fixtureDir}/dotFiles/**/*`,
      },
      expected: dotFilesList,
    },
    {
      name: 'test object have default while options object is provided (testing against default dot: true)',
      glb: {
        pattern: [`${fixtureDir}/dotFiles/**/*`, `${fixtureDir}/symlinks/*`],
        options: {
          ignore: [`${fixtureDir}/dotFiles/.npmignore`],
        },
      },
      expected: [
        ...dotFilesList.filter(
          (f) => f !== `${fixtureDir}/dotFiles/.npmignore`,
        ),
        /**
         * NOTE: symlinks wouldn't be resolved to there mapped path.
         * NOTE: They get followed but the returned path is the one of the symlink file
         */
        `${fixtureDir}/symlinks/lollipop.ts`,
        `${fixtureDir}/symlinks/myAliases`,
      ],
    },
    {
      glb: {
        pattern: `${fixtureDir}/files/src/**/*.ts`,
        options: {
          ignore: [`${fixtureDir}/**/index.ts`],
        },
      },
      /**
       * NOTE: THE RESOLUTION go with files first. Then folders next. At the same level.
       */
      expected: [
        `${fixtureDir}/files/src/Lollipop.ts`,
        `${fixtureDir}/files/src/someFile.ts`,
        `${fixtureDir}/files/src/core/lib.ts`,
        `${fixtureDir}/files/src/utils/logger.ts`,
      ],
    },
    {
      name: 'Default options are overridden correctly',
      glb: {
        pattern: [`${fixtureDir}/dotFiles/*`, `${fixtureDir}/symlinks/*`],
        options: {
          dot: false,
        },
      },
      /**
       * NOTE: Symlinks files are treated as normal files. Not what they resolve to.
       * NOTE: SO If a symlink resolve to a dotFile. And we are using `dot: false`.
       * NOTE: That wouldn't make the file not get selected. The symlink file if is not a dotFile.
       * NOTE: would work fine. It's existence is verified. And would be matched just ok
       */
      expected: [
        `${fixtureDir}/symlinks/lollipop.ts`,
        `${fixtureDir}/symlinks/myAliases`,
      ],
    },
    {
      glb: {
        pattern: `${fixtureDir}/files/src/*`,
      },
      expected: [
        `${fixtureDir}/files/src/Lollipop.ts`,
        `${fixtureDir}/files/src/index.ts`,
        `${fixtureDir}/files/src/someFile.ts`,
      ],
    },
  ]);

  runTests('Function param', [
    {
      name: 'test fglb.sync is passed and with default',
      glb: (fglbSync) => fglbSync(`${fixtureDir}/dotFiles/*`),
      expected: dotFilesList,
    },
    {
      name: 'function works with whatever you return',
      glb: () => ['/holla'],
      expected: ['/holla'],
    },
    {
      glb: (fglbSync) =>
        fglbSync([`${fixtureDir}/dotFiles/**/*`, `${fixtureDir}/symlinks/*`], {
          ignore: [`${fixtureDir}/dotFiles/.npmignore`],
        }),
      expected: [
        ...dotFilesList.filter(
          (f) => f !== `${fixtureDir}/dotFiles/.npmignore`,
        ),
        `${fixtureDir}/symlinks/lollipop.ts`,
        `${fixtureDir}/symlinks/myAliases`,
      ],
    },
  ]);

  test('Wrong param type', () => {
    try {
      globResolve(54 as any);
      fail('wrong type');
    } catch (err) {
      expect((err as any).message).toContain(
        'Wrong glb parameter, possible types are string|array|obje',
      );
    }
  });
});
