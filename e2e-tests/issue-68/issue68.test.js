/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable no-async-promise-executor */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable consistent-return */

/**
 * Issue 68 (https://github.com/MohamedLamineAllal/laravel-mix-glob/issues/68)
 * Empty folders throwing errors and blocking. Instead of not blocking.
 *
 * Correct behavior:
 * - No errors should be thrown when globs don't match anything. A warning only should go in place
 */

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
  }
});

const outDist = path.resolve(`${__dirname}/__fixtures__/dist/`);

test('mix command run correctly', () => {
  expect(execOutput && execOutput.state).toBeTruthy();
});

test('No `No matched files error`', () => {
  expect(JSON.stringify(execOutput.data.cause).toLowerCase()).not.toContain(
    'Error: No matched files'.toLowerCase(),
  );
});

test('mix command run successfully with no error', () => {
  expect(execOutput.state).toBe('success');
});

test('another task core.js compiled correctly', async () => {
  const outPath = path.resolve(outDist, './anotherTask/core.js');
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
        `Task blocked by globs no matching (output not found)!\n${JSON.stringify(
          err,
          null,
          4,
        )}`,
      );
    }
    fail(
      `Task blocked by globs no matching (File reading failed)!\n${JSON.stringify(
        err,
        null,
        4,
      )}`,
    );
  }
});

// test('Warning message for glob no matching', () => {

// });
