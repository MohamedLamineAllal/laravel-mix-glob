import { resolveFileExtension } from './extensionMapping';

interface ITestObj {
  name?: string;
  file: string;
  expected: string;
}

function runTests(category: string, tests: ITestObj[]): void {
  tests.forEach((tst, index) => {
    test(
      tst.name
        ? `${category}: ${tst.name}`
        : `${category}: test of index ${index}`,
      () => {
        const result = resolveFileExtension(tst.file);
        expect(result).toEqual(tst.expected);
      },
    );
  });
}
describe('js mapping', () => {
  const jsExtensions = [
    '.js',
    '.cjs',
    '.mjs',
    '.jsx',
    '.ts',
    '.cts',
    '.mts',
    '.tsx',
  ];

  runTests(
    'js',
    jsExtensions
      .map((extension) =>
        [
          `./some/base/app${extension}`,
          `./some/base/app.some.${extension}`,
        ].map((file, index) => ({
          name: `${extension} extension - test ${index + 1}`,
          file,
          expected: '.js',
        })),
      )
      .flat(),
  );
});

describe('css mapping', () => {
  const cssExtensions = ['.css', '.scss', '.sass', '.less', '.styl', '.stylus'];

  runTests(
    'css',
    cssExtensions
      .map((extension) =>
        [
          `./some/base/style${extension}`,
          `./some/base/style.some.${extension}`,
        ].map((file, index) => ({
          name: `${extension} extension - test ${index + 1}`,
          file,
          expected: '.css',
        })),
      )
      .flat(),
  );
});
