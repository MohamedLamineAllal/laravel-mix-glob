import { OutConfig } from '@Glob';
import path from 'path';
import { mapSrcFile } from './index';

interface ITestObject {
  name?: string;
  mixFuncName: string;
  srcFile: string;
  outConfig: OutConfig;
  expected: string;
}

function runTests(category: string, tests: ITestObject[]): void {
  tests.forEach((tst, index) => {
    const { srcFile, outConfig, mixFuncName, expected } = tst;
    test(
      tst.name
        ? `${category}: ${tst.name}`
        : `${category}: test of index ${index}`,
      () => {
        expect(mapSrcFile(srcFile, mixFuncName, outConfig)).toBe(expected);
      },
    );
  });
}

/**
 * base system without specifier
 * base system with specifier
 *
 * No base system
 */

describe('Wrong base', () => {
  function run(
    srcFile: string,
    mixFuncName: string,
    outConfig: OutConfig,
  ): void {
    try {
      mapSrcFile(srcFile, mixFuncName, outConfig);
      fail(
        'Should have failed. Because the base is not a base for the provided file',
      );
    } catch (err) {
      expect((err as Error).message).toContain(
        'base is not a base for the file src!',
      );
    }
  }

  test('for string', () => {
    const srcFile = 'src/some/main.js';
    const outConfig = new OutConfig({
      outMap: 'public/js',
      baseMap: 'src/wrongBase',
    });
    run(srcFile, 'js', outConfig);
  });

  test('for output file', () => {
    const srcFile = 'src/some/main.js';
    const outConfig = new OutConfig({
      outMap: 'public/js',
      baseMap: () => 'src/wrongBase',
    });
    run(srcFile, 'js', outConfig);
  });
});

describe('Base system without specifier', () => {
  runTests('string options', [
    {
      mixFuncName: 'js',
      srcFile: 'src/base/main.js',
      outConfig: new OutConfig({
        outMap: 'public/js',
        baseMap: 'src/base',
      }),
      expected: 'public/js/main.js',
    },
    {
      mixFuncName: 'js',
      srcFile: 'src/base/main.js',
      outConfig: new OutConfig({
        outMap: 'public/js',
        baseMap: 'src/base/',
      }),
      expected: 'public/js/main.js',
    },
    {
      mixFuncName: 'js',
      srcFile: 'src/base/main.js',
      outConfig: new OutConfig({
        outMap: 'public/js/',
        baseMap: 'src/base',
      }),
      expected: 'public/js/main.js',
    },
  ]);

  runTests('function map options', [
    {
      mixFuncName: 'js',
      srcFile: 'src/base/main.js',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.js')) {
            return 'public';
          }
          return 'public/js';
        },
        baseMap: 'src/base',
      }),
      expected: 'public/main.js',
    },
    {
      mixFuncName: 'js',
      srcFile: 'src/base/home.js',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.js')) {
            return 'public';
          }
          return 'public/js';
        },
        baseMap: 'src/base',
      }),
      expected: 'public/js/home.js',
    },
    {
      mixFuncName: 'js',
      srcFile: 'src/base/main.js',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.js')) {
            return 'public';
          }
          return 'public/js';
        },
        baseMap: () => 'src/base',
      }),
      expected: 'public/main.js',
    },
  ]);
});

describe('Base system with specifier', () => {
  runTests('string options', [
    {
      mixFuncName: 'js',
      srcFile: 'src/base/main.compile.js',
      outConfig: new OutConfig({
        outMap: 'public/js',
        baseMap: 'src/base',
        specifier: 'compile',
      }),
      expected: 'public/js/main.js',
    },
    // testing when file have no specifier (not practical)
    {
      mixFuncName: 'js',
      srcFile: 'src/base/main.js',
      outConfig: new OutConfig({
        outMap: 'public/js',
        baseMap: 'src/base/',
        specifier: 'compile',
      }),
      expected: 'public/js/main.js',
    },
  ]);

  runTests('function map options', [
    {
      mixFuncName: 'js',
      srcFile: 'src/base1/main.compile.js',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.compile.js')) {
            return 'public';
          }
          return 'public/js';
        },
        baseMap: 'src/base1',
        specifier: (src) => {
          if (src.includes('src/base2')) {
            return 'mix';
          }
          // default
          return 'compile';
        },
      }),
      expected: 'public/main.js',
    },
    {
      mixFuncName: 'js',
      srcFile: 'src/base2/main.compile.js',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.compile.js')) {
            return 'public';
          }
          return 'public/js';
        },
        baseMap: 'src/base2',
        specifier: (src) => {
          if (src.includes('src/base2')) {
            return 'mix';
          }
          // default
          return 'compile';
        },
      }),
      expected: 'public/main.compile.js',
    },
    {
      mixFuncName: 'js',
      srcFile: 'src/base2/main.mix.js',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.js')) {
            return 'public';
          }
          return 'public/js';
        },
        baseMap: 'src/base2',
        specifier: (src) => {
          if (src.includes('src/base2')) {
            return 'mix';
          }
          // default
          return 'compile';
        },
      }),
      expected: 'public/js/main.js',
    },
    {
      mixFuncName: 'js',
      srcFile: 'src/base/home.compile.js',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.js')) {
            return 'public';
          }
          return 'public/js';
        },
        baseMap: 'src/base',
        specifier: (src) => {
          if (src.includes('src/base2')) {
            return 'mix';
          }
          // default
          return 'compile';
        },
      }),
      expected: 'public/js/home.js',
    },
  ]);
});

describe('No base system direct mapping', () => {
  runTests('Direct map', [
    {
      mixFuncName: 'js',
      srcFile: 'src/some/main.js',
      outConfig: new OutConfig({
        outMap: (src) => src.replace('src/', 'public/js/'),
      }),
      expected: 'public/js/some/main.js',
    },
    {
      mixFuncName: 'js',
      srcFile: 'src/some/main.js',
      outConfig: new OutConfig({
        outMap: () => 'public/js/some/main.js',
      }),
      expected: 'public/js/some/main.js',
    },
  ]);
  runTests('Direct map with specifier', [
    {
      name: 'Specifier given for an out map function (expected to have no effect)',
      mixFuncName: 'js',
      srcFile: 'src/some/main.c.js',
      outConfig: new OutConfig({
        outMap: (src) => src.replace('src/', 'public/js/'),
        specifier: 'c',
      }),
      expected: 'public/js/some/main.c.js',
    },
    {
      name: 'Specifier with out as a string',
      mixFuncName: 'js',
      srcFile: 'src/some/main.c.js',
      outConfig: new OutConfig({
        outMap: 'public/js/',
        specifier: 'c',
      }),
      expected: 'public/js/main.js',
    },
  ]);
});

describe('Test Extensions resolving', () => {
  runTests('extension resolving in base system', [
    {
      mixFuncName: 'js',
      srcFile: 'src/base/main.js',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.js')) {
            return 'public';
          }
          return 'public/js';
        },
        baseMap: 'src/base',
      }),
      expected: 'public/main.js',
    },
    {
      mixFuncName: 'sass',
      srcFile: 'src/base/main.js.scss',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.js')) {
            return 'public';
          }
          return 'public/css';
        },
        baseMap: 'src/base',
      }),
      expected: 'public/main.js.css',
    },
    {
      mixFuncName: 'sass',
      srcFile: 'src/base/some.js.scss',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.js')) {
            return 'public';
          }
          return 'public/css';
        },
        baseMap: 'src/base',
      }),
      expected: 'public/css/some.js.css',
    },
    {
      mixFuncName: 'sass',
      srcFile: 'src/base/some.scss',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.js')) {
            return 'public';
          }
          return 'public/css';
        },
        baseMap: 'src/base',
      }),
      expected: 'public/css/some.css',
    },
    {
      name: 'With specifier',
      mixFuncName: 'sass',
      srcFile: 'src/base/some.c.scss',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.js')) {
            return 'public';
          }
          return 'public/css';
        },
        baseMap: 'src/base',
        specifier: 'c',
      }),
      expected: 'public/css/some.css',
    },
  ]);

  runTests('extension resolving in out only mode', [
    {
      name: 'outMap not a string but rather a function mapping (expecting no effect)',
      mixFuncName: 'js',
      srcFile: 'src/base/main.js',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.js')) {
            return 'public/main.css';
          }
          return path.resolve(`public/js/${src.replace('src/base/', '')}`);
        },
      }),
      expected: 'public/main.css',
    },
    {
      name: 'outMap a string (out dir) [take effect]',
      mixFuncName: 'js',
      srcFile: 'src/base/main.js',
      outConfig: new OutConfig({
        outMap: 'js/',
      }),
      expected: 'js/main.js',
    },
    {
      name: 'outMap a string (out dir) 2 [take effect]',
      mixFuncName: 'sass',
      srcFile: 'src/base/styles.scss',
      outConfig: new OutConfig({
        outMap: 'css/',
      }),
      expected: 'css/styles.css',
    },
    {
      name: 'outMap a string (out dir) and with specifier 1 [take effect]',
      mixFuncName: 'sass',
      srcFile: 'src/base/styles.c.scss',
      outConfig: new OutConfig({
        outMap: 'css/',
        specifier: 'c',
      }),
      expected: 'css/styles.css',
    },
  ]);

  runTests('mix custom plugins functions (not original)', [
    {
      name: 'swc - js 1',
      mixFuncName: 'swc',
      srcFile: 'src/base/swc.js',
      outConfig: new OutConfig({
        outMap: (src) => {
          if (src.includes('main.js')) {
            return 'public/main.css';
          }
          return path.join(`public/js/${src.replace('src/base/', '')}`);
        },
      }),
      expected: 'public/js/swc.js',
    },
    /**
     * Js based extension swc
     */
    ...['.js', '.cjs', '.mjs', '.jsx', '.ts', '.cts', '.mts', '.tsx'].map(
      (extension) => ({
        name: `swc - ${extension}`,
        mixFuncName: 'swc',
        srcFile: `src/base/main${extension}`,
        outConfig: new OutConfig({
          outMap: 'js/',
        }),
        expected: 'js/main.js',
      }),
    ),
    /**
     * Imaginary css based extension
     */
    ...['.scss', '.sass', '.styl', '.css', '.less', '.stylus'].map(
      (extension) => ({
        name: `cssExt - ${extension}`,
        mixFuncName: 'cssExt',
        srcFile: `src/base/styles.c${extension}`,
        outConfig: new OutConfig({
          outMap: 'css/',
          specifier: 'c',
        }),
        expected: 'css/styles.css',
      }),
    ),
  ]);
});
