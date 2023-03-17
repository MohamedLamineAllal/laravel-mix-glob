/* eslint-disable no-empty */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const { runMixCommand } = require('../utils');

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

describe('Extending extensions', () => {
  describe('swc extension', () => {
    test('glob on swc with glb.arg', async () => {
      const expectedOut = path.resolve(
        outDist,
        './swcExtenssionWithArg/arg/app.js',
      );

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
    test('glob on swc with glb.src glb.out', async () => {
      const expectedOut = path.resolve(
        outDist,
        './swcExtenssionWithArg/srcOut/app.js',
      );

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
});
