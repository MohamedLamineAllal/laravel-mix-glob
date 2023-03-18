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

let execOutput;

jest.setTimeout(30e3);

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

function runTest(glbType) {
  describe('with specifier', () => {
    const outPath = path.resolve(`${outDist}/styles/${glbType}/specifier/`);
    const srcPath = path.resolve(`${srcDir}/styles/${glbType}/specifier/`);

    test('that no specifier el is left', async () => {
      const withSpecifierFiles = await fastGlob(`${outPath}/**/*.c.css`);
      expect(withSpecifierFiles.length).toBe(0);
    });

    test('that all specifier files are compiled and mapped correctly', async () => {
      const srcSpecifierFiles = await fastGlob(`${srcPath}/**/*.c.scss`);

      expect(srcSpecifierFiles.length).toBeGreaterThan(0);

      try {
        const filesObjs = await Promise.all(
          checkOutFiles({
            srcFiles: srcSpecifierFiles,
            srcDir: srcPath,
            outDir: outPath,
            readFileIfExist: true,
            expectedOutMapping: ({ defaultOut }) =>
              glb.removeSpecifier(
                glb.replaceExtension(defaultOut, '.css'),
                'c',
              ),
          }),
        );

        filesObjs.forEach((fileObj) => {
          expect(fileObj.distFileContent.length > 0).toBeTruthy();
          expect(fileObj.distFileContent).toContain('Compiled from sass');
        });
      } catch (err) {
        console.log(err);
        fail(
          `One of the file is not accessible. ${JSON.stringify(err, null, 4)}`,
        );
      }
    });
  });
  describe('without specifier', () => {
    const outPath = path.resolve(`${outDist}/styles/${glbType}/noSpecifier/`);
    const srcPath = path.resolve(`${srcDir}/styles/${glbType}/noSpecifier/`);

    test('that specifier els are left', async () => {
      const withSpecifierFiles = await fastGlob(`${srcPath}/**/*.c.scss`);
      expect(withSpecifierFiles.length).toBeGreaterThan(0);

      try {
        await Promise.all(
          checkOutFiles({
            srcFiles: withSpecifierFiles,
            srcDir: srcPath,
            outDir: outPath,
            readFileIfExist: false,
            expectedOutMapping: ({ defaultOut }) =>
              glb.replaceExtension(defaultOut, '.css'),
          }),
        );
      } catch (err) {
        console.log(err);
        fail(
          `One of the file is not accessible. ${JSON.stringify(err, null, 4)}`,
        );
      }
    });

    test('that all files are compiled and mapped correctly', async () => {
      const srcFiles = await fastGlob(`${srcPath}/**/*.scss`);
      expect(srcFiles.length).toBeGreaterThan(0);

      try {
        const filesObjs = await Promise.all(
          checkOutFiles({
            srcFiles,
            srcDir: srcPath,
            outDir: outPath,
            readFileIfExist: true,
            expectedOutMapping: ({ defaultOut }) =>
              glb.replaceExtension(defaultOut, '.css'),
          }),
        );
        filesObjs.forEach((fileObj) => {
          expect(fileObj.distFileContent.length > 0).toBeTruthy();
          expect(fileObj.distFileContent).toContain('Compiled from sass');
        });
      } catch (err) {
        console.log(err);
        fail(
          `One of the file is not accessible. ${JSON.stringify(err, null, 4)}`,
        );
      }
    });
  });
}

test('mix command run correctly', () => {
  expect(execOutput && execOutput.state).toBeTruthy();
});

describe('No globs [normal calls with glob objects]', () => {
  test('no globs working correctly', async () => {
    const outPath = path.resolve(outDist, './styles/noGlobs/style.css');
    let fileContent;
    try {
      fileContent = await fs.promises.readFile(outPath, {
        encoding: 'utf8',
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

    expect(fileContent.length > 0).toBeTruthy();
    expect(fileContent).toContain('Compiled from sass');
  });
});

describe('Using Args', () => {
  runTest('doneWithArgs');
});

describe('Using Src Out', () => {
  runTest('doneWithSrcOut');
});

describe('glb.arg', () => {
  test('glb.arg works with no problem alone (no cartesian product)', async () => {
    const outPath = path.resolve(`${outDist}/styles/arg`);
    const srcPath = path.resolve(`${srcDir}/styles/arg`);

    const srcSpecifierFiles = await fastGlob(`${srcPath}/**/*.scss`);
    expect(srcSpecifierFiles.length).toBeGreaterThan(0);

    try {
      const filesObjs = await Promise.all(
        checkOutFiles({
          srcFiles: srcSpecifierFiles,
          srcDir: srcPath,
          outDir: outPath,
          readFileIfExist: true,
          expectedOutMapping: ({ defaultOut }) =>
            glb.replaceExtension(defaultOut, '.css'),
        }),
      );

      filesObjs.forEach((fileObj) => {
        expect(fileObj.distFileContent.length > 0).toBeTruthy();
        expect(fileObj.distFileContent).toContain('Compiled from sass');
      });
    } catch (err) {
      console.log(err);
      fail(
        `One of the file is not accessible. ${JSON.stringify(err, null, 4)}`,
      );
    }
  });
});
