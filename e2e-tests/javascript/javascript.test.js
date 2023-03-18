/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable no-async-promise-executor */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable consistent-return */

const fs = require('node:fs');
const path = require('path');
const fastGlob = require('fast-glob');
const { runMixCommand, checkOutFiles } = require('../utils');
const { glb } = require('../../dist/index');

jest.setTimeout(30e3);

let execOutput;

beforeAll(async () => {
  try {
    console.log('Gonna run the command');
    const rootDir = path.resolve(__dirname, './__fixtures__');
    const successOut = await runMixCommand({
      rootDir,
      outDir: './dist',
    });
    execOutput = {
      state: 'success',
      data: successOut,
    };
    console.log('command run with success', successOut);
  } catch (err) {
    execOutput = {
      state: 'error',
      data: err,
    };
    console.log('Command run failed');
    console.log(execOutput.data.cause);
    fail(`Command run failed!\n${JSON.stringify(err, null, 4)}`);
  }
});

const outDist = path.resolve(`${__dirname}/__fixtures__/dist/`);
const srcDir = path.resolve(`${__dirname}/__fixtures__/src/`);

function runTest(pathType, glbType) {
  describe(`${pathType} path`, () => {
    describe('with specifier', () => {
      const outPath = path.resolve(
        `${outDist}/${pathType}/${glbType}/specifier/`,
      );
      const srcPath = path.resolve(
        `${srcDir}/${pathType}/${glbType}/specifier/`,
      );

      test('that no specifier el is left', async () => {
        const withSpecifierFiles = await fastGlob(`${outPath}/**/*.c.js`);
        expect(withSpecifierFiles.length).toBe(0);
      });

      test('that all specifier files are compiled and mapped correctly', async () => {
        const srcSpecifierFiles = await fastGlob(`${srcPath}/**/*.c.js`);
        expect(srcSpecifierFiles.length).toBeGreaterThan(0);

        try {
          const filesObjs = await Promise.all(
            checkOutFiles({
              srcFiles: srcSpecifierFiles,
              srcDir: srcPath,
              outDir: outPath,
              readFileIfExist: true,
              expectedOutMapping: ({ defaultOut }) =>
                glb.removeSpecifier(defaultOut, 'c'),
            }),
          );

          filesObjs.forEach((fileObj) => {
            expect(fileObj.distFileContent.length > 0).toBeTruthy();
            expect(fileObj.distFileContent).toContain('webpackBootstrap');
          });
        } catch (err) {
          console.log(err);
          fail(
            `One of the file is not accessible. ${JSON.stringify(
              err,
              null,
              4,
            )}`,
          );
        }
      });
    });
    describe('without specifier', () => {
      const outPath = path.resolve(
        `${outDist}/${pathType}/${glbType}/noSpecifier/`,
      );
      const srcPath = path.resolve(
        `${srcDir}/${pathType}/${glbType}/noSpecifier/`,
      );

      test('that specifier els are left', async () => {
        const withSpecifierFiles = await fastGlob(`${srcPath}/**/*.c.js`);
        expect(withSpecifierFiles.length).toBeGreaterThan(0);

        try {
          await Promise.all(
            checkOutFiles({
              srcFiles: withSpecifierFiles,
              srcDir: srcPath,
              outDir: outPath,
              readFileIfExist: false,
              expectedOutMapping: ({ defaultOut }) => defaultOut,
            }),
          );
        } catch (err) {
          console.log(err);
          fail(
            `One of the file is not accessible. ${JSON.stringify(
              err,
              null,
              4,
            )}`,
          );
        }
      });

      test('that all files are compiled and mapped correctly', async () => {
        const srcFiles = await fastGlob(`${srcPath}/**/*.js`);
        expect(srcFiles.length).toBeGreaterThan(0);

        try {
          const filesObjs = await Promise.all(
            checkOutFiles({
              srcFiles,
              srcDir: srcPath,
              outDir: outPath,
              readFileIfExist: true,
              expectedOutMapping: ({ defaultOut }) => defaultOut,
            }),
          );
          filesObjs.forEach((fileObj) => {
            expect(fileObj.distFileContent.length > 0).toBeTruthy();
            expect(fileObj.distFileContent).toContain('webpackBootstrap');
          });
        } catch (err) {
          console.log(err);
          fail(
            `One of the file is not accessible. ${JSON.stringify(
              err,
              null,
              4,
            )}`,
          );
        }
      });
    });
  });
}

test('mix command run correctly', () => {
  expect(execOutput && execOutput.state).toBeTruthy();
});

describe('No globs [normal calls with glob objects]', () => {
  test('no globs working correctly', async () => {
    const outPath = path.resolve(outDist, './noGlobs/some.js');
    try {
      const fileContent = await fs.promises.readFile(outPath, {
        encoding: 'utf8',
      });
      expect(fileContent.length > 0).toBeTruthy();
      expect(fileContent).toContain('webpackBootstrap');
    } catch (err) {
      console.log(err);
      if (err.code === 'ENOENT') {
        return fail(
          `One of the file is not found\n${JSON.stringify(err, null, 4)}`,
        );
      }
      fail(`File reading failed!\n${JSON.stringify(err, null, 4)}`);
    }
  });
});

describe('Using Args', () => {
  runTest('relative', 'doneWithArgs');
  runTest('absolute', 'doneWithArgs');
});

describe('Using Args with glbMapOutput()', () => {
  runTest('relative', 'doneWithArgsAndGlbMapOutput');
});

describe('Using Src Out', () => {
  runTest('relative', 'doneWithSrcOut');
  runTest('absolute', 'doneWithSrcOut');
});

describe('React, no argument call', () => {
  test('jsx is compiling right', async () => {
    const readPromises = [];
    [('specifier', 'noSpecifier')].forEach(async (specifierCase) => {
      const expectedOut = path.resolve(
        outDist,
        `./reactNoArgs/${specifierCase}/component.js`,
      );
      readPromises.push(
        fs.promises.readFile(expectedOut, {
          encoding: 'utf8',
        }),
      );
    });

    try {
      (await Promise.all(readPromises)).forEach((fileContent) => {
        expect(fileContent.length > 0).toBeTruthy();
        expect(fileContent).toContain('webpackBootstrap');
      });
    } catch (err) {
      console.log(err);
      if (err.code === 'ENOENT') {
        return fail(
          `One of the file is not found\n${JSON.stringify(err, null, 4)}`,
        );
      }
      fail(`File reading failed!\n${JSON.stringify(err, null, 4)}`);
    }
  });
});

describe('glb.arg', () => {
  test('glb.arg works with no problem alone (no cartesian product)', async () => {
    const expectedOut = path.resolve(outDist, './arg/app.js');

    try {
      const fileContent = await fs.promises.readFile(expectedOut, {
        encoding: 'utf8',
      });

      console.log(fileContent);

      expect(fileContent.length > 0).toBeTruthy();
      expect(fileContent).toContain('webpackBootstrap');
    } catch (err) {
      console.log(err);
      if (err.code === 'ENOENT') {
        return fail(
          `One of the file is not found\n${JSON.stringify(err, null, 4)}`,
        );
      }
      fail(`File reading failed!\n${JSON.stringify(err, null, 4)}`);
    }
  });
});
