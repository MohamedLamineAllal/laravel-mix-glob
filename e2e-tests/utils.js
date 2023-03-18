/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable no-async-promise-executor */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable consistent-return */

const rimraf = require('rimraf');
const { exec } = require('node:child_process');
const fs = require('node:fs');
const fse = require('fs-extra');
const path = require('path');

global.fail = function fail(message) {
  throw new Error(message);
};

function getOutFile(srcFile, srcDir, outDir) {
  return path.resolve(outDir, path.relative(srcDir, srcFile));
}

function stringify(el) {
  return JSON.stringify(el, null, 4);
}

async function readFile(file, failMsg = 'Failed reading file.') {
  try {
    return fs.promises.readFile(file, {
      encoding: 'utf8',
    });
  } catch (err) {
    console.log(err);
    global.fail(`${failMsg}\nFiles:\n${file}\nError:\n${stringify(err)}`);
  }
}

async function readFilesContents(files, failMsg = 'Failed reading file.') {
  try {
    return await Promise.all(
      files.map((file) =>
        fs.promises.readFile(file, {
          encoding: 'utf8',
        }),
      ),
    );
  } catch (err) {
    console.log(err);
    global.fail(
      `${failMsg}\nFiles:\n${stringify(files)}\nError:\n${stringify(err)}`,
    );
  }
}

async function writeFile(file, content, failMsg = 'Failed to write file.') {
  try {
    return fs.promises.writeFile(file, content, {
      encoding: 'utf8',
    });
  } catch (err) {
    console.log(err);
    global.fail(`${failMsg}\nFiles:\n${file}\nError:\n${stringify(err)}`);
  }
}

async function rename(
  srcFile,
  destFile,
  failMsg = 'Failed to rename or move file.',
) {
  try {
    await fs.promises.rename(srcFile, destFile);
  } catch (err) {
    console.log(err);

    global.fail(
      `${failMsg}\nSrc File:\n${srcFile}\nDest File:\n${destFile}\nError:\n${stringify(
        err,
      )}`,
    );
  }
}

async function copy(src, dest, failMsg = 'Failed copying.') {
  try {
    fse.copy(src, dest, { recursive: true, overwrite: true });
  } catch (err) {
    console.log(err);
    global.fail(
      `${failMsg}\nSrc:\n${src}\nDest:\n${dest}\nError:\n${stringify(err)}`,
    );
  }
}

async function createDir(dirPath, failMsg = 'Failed to create directory.') {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
  } catch (err) {
    console.log(err);
    global.fail(
      `${failMsg}\nDir:\n${dirPath}\nDest:\nError:\n${stringify(err)}`,
    );
  }
}

async function checkFileExist(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch (err) {
    return false;
  }
}

async function updateFilesContents(
  files,
  filesContents,
  failMsg = 'Failed reading file.',
) {
  try {
    return await Promise.all(
      files.map((file, index) =>
        fs.promises.writeFile(file, filesContents[index], {
          encoding: 'utf8',
        }),
      ),
    );
  } catch (err) {
    console.log(err);
    global.fail(
      `${failMsg}\nFiles:\n${stringify(files)}\nError:\n${stringify(err)}`,
    );
  }
}

function _rimraf(...args) {
  return new Promise((resolve, reject) => {
    rimraf(...args, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

async function removeDir(dir, failMsg = 'Failed to remove directory.') {
  try {
    return await _rimraf(dir);
  } catch (err) {
    console.log(err);
    global.fail(
      `${failMsg}\nFile to remove:\n${dir}\nError:\n${stringify(err)}`,
    );
  }
}

async function removeFile(filePath, failMsg = 'Failed to remove file.') {
  try {
    return await fs.promises.rm(filePath);
  } catch (err) {
    console.log(err);
    global.fail(
      `${failMsg}\nFile to remove:\n${filePath}\nError:\n${stringify(err)}`,
    );
  }
}

/**
 * Run mix command
 * @param {
 *    rootDir: string,
 *    outDir: string
 * } config
 *
 * rootDir: root path (better absolute)
 * outDir: out directory relative to root dir
 *
 * NOTE: outDir is expected to be relative to the rootDir
 *
 * Return Exec result
 * @returns {
 *   Promise<{
 *       state: 'compiled',
 *       stdout: stdoutBuffer,
 *       stderr: stderrBuffer,
 *   }>
 * } execResult
 */
function runMixCommand({ rootDir, outDir, shouldWatch }) {
  return new Promise(async (resolve, reject) => {
    try {
      await _rimraf(path.resolve(rootDir, outDir));
    } catch (err) {
      reject({
        message: 'Rimraf dist failed!',
        err,
      });
      return;
    }

    let stdoutBuffer = '';
    let stderrBuffer = '';

    const watchArgStr = shouldWatch ? ' watch' : '';

    let childProcess;

    let onStdout;
    const onStderr = (data) => {
      stderrBuffer += data;
    };

    const clearStdListeners = () => {
      if (childProcess.stdout) {
        childProcess.stdout.removeListener('data', onStdout);
      }
      if (childProcess.stderr) {
        childProcess.stderr.removeListener('data', onStderr);
      }
    };

    onStdout = (data) => {
      stdoutBuffer += data;
      console.log(data);
      if (data.includes('webpack compiled')) {
        childProcess.kill(0);
        clearStdListeners();
        resolve({
          state: 'compiled',
          stdout: stdoutBuffer,
          stderr: stderrBuffer,
          childProcess,
        });
      }
    };

    childProcess = exec(
      `npx mix${watchArgStr}`,
      {
        encoding: 'utf8',
        cwd: rootDir,
        env: {
          ...process.env,
          NODE_ENV: 'development',
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          clearStdListeners();
          return reject(
            new Error(err.message, {
              cause: {
                err,
                stdout,
                stderr,
              },
            }),
          );
        }
        clearStdListeners();
        resolve({
          stdout,
          stderr,
          childProcess,
        });
      },
    );

    childProcess.stdout.setEncoding('utf8');
    childProcess.stderr.setEncoding('utf8');
    childProcess.stdout.on('data', onStdout);

    childProcess.stdout.on('data', onStderr);
  });
}

function checkOutFiles({
  srcFiles,
  srcDir,
  outDir,
  expectedOutMapping = ({ defaultOut }) => defaultOut,
  readFileIfExist,
}) {
  const filesObjsPromises = [];
  srcFiles.forEach((file) => {
    const relativePath = path.relative(srcDir, file);
    const defaultOut = path.resolve(`${outDir}/${relativePath}`);
    const expectedDistPath = expectedOutMapping({
      file,
      relativePath,
      outDir,
      defaultOut,
    });

    filesObjsPromises.push(
      fs.promises
        .access(expectedDistPath)
        .then(async (access) => ({
          file,
          expectedDistPath,
          access,
          distFileContent: readFileIfExist
            ? await fs.promises.readFile(expectedDistPath, {
                encoding: 'utf8',
              })
            : undefined,
        }))
        .catch((err) =>
          Promise.reject({
            file,
            expectedDistPath,
            err,
          }),
        ),
    );
  });
  return filesObjsPromises;
}

function getEventSnapOrFail(sm, eventName) {
  const snap = sm.getSnap(eventName);

  if (!snap) {
    return global.fail(`No event source of type ${eventName} was found`);
  }

  return snap;
}

function getAllSnapsOrFail(sm, eventName) {
  const snaps = sm.getSnaps(eventName);

  if (snaps.length === 0) {
    return global.fail(`No events source of type ${eventName} was found`);
  }

  return snaps;
}

module.exports = {
  getOutFile,
  stringify,
  readFile,
  readFilesContents,
  writeFile,
  rename,
  copy,
  createDir,
  checkFileExist,
  updateFilesContents,
  checkOutFiles,
  runMixCommand,
  rimraf: _rimraf,
  removeDir,
  removeFile,
  getEventSnapOrFail,
  getAllSnapsOrFail,
};
