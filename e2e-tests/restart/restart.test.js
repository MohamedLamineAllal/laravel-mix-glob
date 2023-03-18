/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable no-async-promise-executor */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable consistent-return */

const fs = require('node:fs');
const path = require('node:path');
const fse = require('fs-extra');
const fastGlob = require('fast-glob');
const { Snapman } = require('snapman');
const flatCache = require('flat-cache');
const { newServiceTemplate } = require('./templates');
const {
  runMixCommand,
  checkOutFiles,
  rimraf: forceRemove,
  stringify,
  getOutFile,
  readFile,
  readFilesContents,
  writeFile,
  updateFilesContents,
  getEventSnapOrFail,
  rename,
  removeFile,
  copy,
  createDir,
  removeDir,
} = require('../utils');
const { MetaCache } = require('../../dist/WatchingManager/Cache/MetaCache');

let execOutput;

jest.setTimeout(60e3);

function r(...args) {
  return path.resolve.call(path, ...args);
}

const rootDir = r(__dirname, './__fixtures__');
const testSpaceDir = r(rootDir, './test_space');
const tSrcDir = r(`${testSpaceDir}/src/`);
const tOutDir = r(`${testSpaceDir}/dist/`);
const copyDir = r(`${rootDir}/toCopy/`);
const sm = new Snapman();

/**
 * Experiment helpers
 */
async function prepareTestSpace() {
  console.log('Removing src in test_space. To start fresh');

  try {
    await forceRemove(testSpaceDir);
  } catch (err) {
    fail(`Problem rimraf-ing test_space/src folder${stringify(err)}`);
    return;
  }

  console.log(
    'Copying files to test_space. So we can start the test process ...',
  );

  try {
    await fs.promises.mkdir(testSpaceDir);
  } catch (err) {
    fail(
      `Problem rimraf-ing test_space/src folder\n${JSON.stringify(
        err,
        null,
        4,
      )}`,
    );
    return;
  }

  /**
   * copying files from root to test_space
   */
  try {
    await Promise.all(
      ['./package.json'].map((file) =>
        fs.promises.copyFile(r(rootDir, file), r(testSpaceDir, file)),
      ),
    );
  } catch (err) {
    fail(`Problem copying file to test_space\n${stringify(err)}`);
    return;
  }

  /**
   * Copying webpack.mix.js
   */
  try {
    let content = await readFile(r(rootDir, 'webpack.mix.js'));
    content = content.replace('../../../dist/index', '../../../../dist/index');
    await writeFile(r(testSpaceDir, 'webpack.mix.js'), content);
  } catch (err) {
    fail(`Problem copying file to test_space\n${stringify(err)}`);
    return;
  }

  /**
   * Copying src dir to test_space
   */

  try {
    await fse.copy(r(rootDir, './src'), r(testSpaceDir, './src'));
  } catch (err) {
    fail(
      `Problem copying ./src from root to testing_space\n${JSON.stringify(
        err,
        null,
        4,
      )}`,
    );
  }
}

async function listenToRestart(childProcess, location, timeout = 30e3) {
  let stderrDataCallback;
  let stdoutDataCallback;

  const removeListeners = () => {
    childProcess.stdout.removeListener('data', stdoutDataCallback);
    childProcess.stderr.removeListener('data', stderrDataCallback);
  };

  try {
    return await new Promise((resolve, reject) => {
      let isResolved = false;

      stdoutDataCallback = (data) => {
        const isCompiledSuccessfully = 'webpack compiled successfully'
          .split(' ')
          .every((word) => data.includes(word));

        if (isCompiledSuccessfully) {
          isResolved = true;
          removeListeners();
          resolve(data);
        }
      };
      childProcess.stdout.on('data', stdoutDataCallback);

      stderrDataCallback = (data) => {
        console.log('stderr:');
        console.log(data);
        // reject(data);
        // setTimeout(() => {
        //   process.exit();
        // }, 50);
      };
      childProcess.stderr.on('data', stderrDataCallback);

      setTimeout(() => {
        if (!isResolved) {
          removeListeners();
          reject({ message: `Timeout at ${location}.` });
        }
      }, timeout);
    });
  } catch (err) {
    console.log(err);
    removeListeners();
    fail(`Error data after restart.\n${stringify(err)}`);
  }
}

/**
 * Listen method to be used with delete based operation
 * (delete, rename)
 * Note: mix without globs does restart when file is removed
 * Note rename is remove + add
 * Error message after delete
 * ERROR in /dist/services/new.service
 * Module not found: Error: Can't resolve
 */
async function listenToRestartAfterDeleteOrRename(
  childProcess,
  location,
  timeout = 30e3,
) {
  // return listenToRestart(childProcess, timeout);
  try {
    const data = await listenToRestart(childProcess, location, timeout);
    if (data.includes('Module not found:')) {
      return await listenToRestart(childProcess, location, timeout);
    }
    return data;
  } catch (err) {
    return listenToRestart(childProcess, location, timeout);
  }
}

const appSrcFile = r(tSrcDir, './app.js');
const appOutFile = r(tOutDir, './app.js');
const getServicesFiles = () => fastGlob(r(tSrcDir, './services/*.js'));
const getServicesEngineFiles = () =>
  fastGlob(r(tSrcDir, './services/engine/**/*.js'));

/**
 * Experiments
 */

// create and update, update, rename, update

async function runRestartOneAfterAnotherExperiment() {
  /**
   * Update ./app.js (no glob matched)
   * //////////////////////////////////
   */
  async function appJsUpdate() {
    /** reading content */
    const content = await readFile(
      appSrcFile,
      'Failed reading test_space/src/app.js.',
    );

    /** changing content */
    const updateContent = content.replace(/RESTART_V1/g, 'RESTART_V2');
    await writeFile(
      appSrcFile,
      updateContent,
      'Failed to update test_space/src/app.js.',
    );

    /**
     * Listening to stdout (console)
     */
    await listenToRestart(execOutput.data.childProcess, 'appJsUpdate');

    /**
     * webpack compiled
     * No rejection
     *
     * Check the output file
     * */

    const outContent = await readFile(appOutFile, 'Fail to read dist/app.js.');
    sm.snap('appJs:recompiled', { content, updateContent, outContent });
  }

  /**
   * Update ./services/*.js files
   * //////////////////////////////////
   */
  async function updateServicesFirstLevelFiles() {
    const srcFiles = await getServicesFiles();

    /** reading files content */
    const filesContents = await readFilesContents(
      srcFiles,
      'Failed reading services file.',
    );

    /** changing files content */
    const updateSrcFilesContents = filesContents.map((fileContent) =>
      fileContent.replace(/RESTART_V1/g, 'RESTART_V2'),
    );
    await updateFilesContents(
      srcFiles,
      updateSrcFilesContents,
      'Failed to update test_space/services/*.js.',
    );

    /**
     * Listening to stdout (console)
     */
    await listenToRestart(
      execOutput.data.childProcess,
      'updateServicesFirstLevelFiles',
    );

    /**
     * webpack compiled
     * No rejection
     *
     * Check the output files
     * */

    /** reading out files content */
    const outFilesContents = await readFilesContents(
      srcFiles.map((file) => getOutFile(file, tSrcDir, tOutDir)),
      'Failed reading out services file',
    );
    sm.snap('services:l1:recompiled', {
      srcFiles,
      filesContents,
      updateFilesContents: updateSrcFilesContents,
      outFilesContents,
    });
  }

  /**
   * Update ./services/engine/**\/*.js files
   * //////////////////////////////////
   */
  async function updateServicesEngineFiles() {
    const srcFiles = await getServicesEngineFiles();

    /** reading files content */
    const filesContents = await readFilesContents(
      srcFiles,
      'Failed reading services engine file.',
    );

    /** changing files content */
    const updateSrcFilesContents = filesContents.map((fileContent) =>
      fileContent.replace(/RESTART_V1/g, 'RESTART_V2'),
    );
    await updateFilesContents(
      srcFiles,
      updateSrcFilesContents,
      'Failed to update test_space/services/engine/**/*.js.',
    );

    /**
     * Listening to stdout (console)
     */
    await listenToRestart(
      execOutput.data.childProcess,
      'updateServicesEngineFiles',
    );

    /**
     * webpack compiled
     * No rejection
     *
     * Check the output files
     * */

    /** reading out files content */
    const outFilesContents = await readFilesContents(
      srcFiles.map((file) => getOutFile(file, tSrcDir, tOutDir)),
      'Failed reading out services engine file',
    );
    sm.snap('services:engine:recompiled', {
      srcFiles,
      filesContents,
      updateFilesContents: updateSrcFilesContents,
      outFilesContents,
    });
  }

  // ________________________________________________________________/)))))
  // Real experiences that allow us to test the restart through the watcher
  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\)))))

  /**
   * Create then update
   * (That test the restart functionality related to the watcher)
   * //////////////////////////////////
   */

  const newServiceSrcFile = r(tSrcDir, './services/new.service.js');
  const newServiceOutFile = r(tOutDir, './services/new.service.js');

  async function createFileThenUpdateToTestGlobs() {
    await writeFile(newServiceSrcFile, newServiceTemplate);

    await listenToRestart(
      execOutput.data.childProcess,
      'createFileThenUpdateToTestGlobs',
    );

    const newServiceAfterRestartOutContent = await readFile(
      newServiceOutFile,
      'Failed reading test_space/dist/services/new.service.js.',
    );

    sm.snap('services:l1:create:new.service:restart', {
      srcFile: newServiceSrcFile,
      srcContent: newServiceTemplate,
      outFile: newServiceOutFile,
      outContent: newServiceAfterRestartOutContent,
    });

    // Update the file again after restarting after file creation

    const newServiceUpdatedContent = newServiceTemplate.replace(
      'RESTART_NEW_SERVICE_V1',
      'RESTART_NEW_SERVICE_V2',
    );

    await writeFile(newServiceSrcFile, newServiceUpdatedContent);

    await listenToRestart(
      execOutput.data.childProcess,
      'createFileThenUpdateToTestGlobs-2',
    );

    const newServiceAfterSecondRestartOutContent = await readFile(
      newServiceOutFile,
      'Failed reading test_space/dist/services/new.service.js.',
    );

    sm.snap('services:l1:create:new.service:update:restart', {
      srcFile: newServiceSrcFile,
      srcContent: newServiceUpdatedContent,
      outFile: newServiceOutFile,
      outContent: newServiceAfterSecondRestartOutContent,
    });
  }

  /**
   * Rename then update
   * //////////////////////////////////
   * (This is expected to run after the creation of new.service.js)
   * will rename the new.service.js to renamed.service.js
   */

  const renamedSrcFile = r(tSrcDir, './services/rename.service.js');
  const renamedOutFile = r(tOutDir, './services/rename.service.js');

  async function renameThenUpdate() {
    await rename(newServiceSrcFile, renamedSrcFile);

    await listenToRestartAfterDeleteOrRename(
      execOutput.data.childProcess,
      'renameThenUpdate',
    );

    const renamedOutContent = await readFile(
      renamedOutFile,
      'Failed reading test_space/dist/services/renamed.service.js.',
    );

    sm.snap('services:l1:rename:renamed.service:restart', {
      srcFile: newServiceSrcFile,
      renamedSrcFile,
      renamedOutFile,
      renamedOutContent,
    });

    // Update the renamed file to check that now the rebuild work smooth
    const updatedContent = renamedOutContent.replace(
      'RESTART_NEW_SERVICE_V2',
      'RESTART_RENAMED_SERVICE_V1',
    );

    await writeFile(renamedSrcFile, updatedContent);

    await listenToRestart(execOutput.data.childProcess, 'renameThenUpdate-2');

    const renamedOutUpdatedContent = await readFile(
      renamedOutFile,
      'Failed reading test_space/dist/services/renamed.service.js.',
    );

    sm.snap('services:l1:rename:renamed.service:update:restart', {
      renamedSrcFile,
      renamedOutFile,
      renamedUpdatedContent: updatedContent,
      renamedOutUpdatedContent,
    });
  }

  /**
   * Delete file
   * //////////////////////////////////
   */

  async function deleteFileAndCheckRestart() {
    await removeFile(renamedSrcFile);

    await listenToRestartAfterDeleteOrRename(
      execOutput.data.childProcess,
      'deleteFileAndCheckRestart',
    );

    sm.snap('services:l1:delete:renamed.service:restart', {
      removedFile: renamedSrcFile,
    });
  }

  /**
   * Copying a file to be matched by a glob then update
   * //////////////////////////////////
   */
  async function copyFileAndUpdate() {
    const toCopyFile = r(copyDir, 'copyFile.js');
    const srcFileDest = r(tSrcDir, 'services/copyFile.service.js');
    const outFile = r(tOutDir, 'services/copyFile.service.js');

    await copy(toCopyFile, srcFileDest);

    await listenToRestart(execOutput.data.childProcess, 'copyFileAndUpdate');

    const copiedSrcFileContent = await readFile(
      srcFileDest,
      'Failed reading test_space/src/services/copyFile.service.js.',
    );

    sm.snap('services:l1:copy:copyFile.service:restart', {
      toCopyFile,
      srcFileDest,
      copiedSrcFileContent,
    });

    // Update the the copied file to check that now the rebuild work smooth
    const updatedContent = copiedSrcFileContent.replace(
      'COPY_FILE_V1',
      'COPY_FILE_V2',
    );

    await writeFile(srcFileDest, updatedContent);

    await listenToRestart(execOutput.data.childProcess, 'copyFileAndUpdate-2');

    const copyFileOutContent = await readFile(
      srcFileDest,
      'Failed reading test_space/dist/services/copyFile.service.js.',
    );

    sm.snap('services:l1:copy:copyFile.service:update:restart', {
      srcFile: srcFileDest,
      outFile,
      srcContent: copiedSrcFileContent,
      outContent: copyFileOutContent,
    });
  }
  /**
   * Moving a file to be matched by a glob then update
   * //////////////////////////////////
   */
  async function moveFileAndUpdate() {
    const toMoveFile = r(tSrcDir, 'toMove/moveFile.js');
    const srcFileDest = r(tSrcDir, 'services/moveFile.service.js');
    const outFile = r(tOutDir, 'services/moveFile.service.js');

    await rename(toMoveFile, srcFileDest);

    await listenToRestart(execOutput.data.childProcess, 'moveFileAndUpdate');

    const movedSrcFileContent = await readFile(
      srcFileDest,
      'Failed reading test_space/src/services/moveFile.service.js.',
    );

    const outFileContent = await readFile(
      outFile,
      'Failed reading test_space/src/services/moveFile.service.js.',
    );

    sm.snap('services:l1:move:moveFile.service:restart', {
      toMoveFile,
      srcFileDest,
      outFile,
      movedSrcFileContent,
      outFileContent,
    });

    // Update the the copied file to check that now the rebuild work smooth
    const updatedContent = movedSrcFileContent.replace(
      'MOVE_FILE_V1',
      'MOVE_FILE_V2',
    );

    await writeFile(srcFileDest, updatedContent);

    await listenToRestart(execOutput.data.childProcess, 'moveFileAndUpdate-2');

    const moveFileOutContent = await readFile(
      srcFileDest,
      'Failed reading test_space/dist/services/moveFile.service.js.',
    );

    sm.snap('services:l1:move:moveFile.service:update:restart', {
      srcFile: srcFileDest,
      outFile,
      srcContent: movedSrcFileContent,
      outContent: moveFileOutContent,
    });
  }

  /**
   * Creating a directory
   * //////////////////////////////////
   *
   */
  const toCreateDirPath = r(tSrcDir, 'services/engine/createdDir');
  const createdDirOutPath = r(tOutDir, 'services/engine/createdDir');
  const subDir = r(toCreateDirPath, 'subDir');
  const subOutDir = r(createdDirOutPath, 'subDir');

  async function createDirectoryAndUpdate() {
    const srcFile = r(toCreateDirPath, 'some.js');
    const outFile = r(createdDirOutPath, 'some.js');
    const subSrcFile = r(subDir, 'some.js');
    const subOutFile = r(subOutDir, 'some.js');

    // create dir and a file within it
    await createDir(toCreateDirPath);
    await writeFile(srcFile, newServiceTemplate);

    await listenToRestart(
      execOutput.data.childProcess,
      'createDirectoryAndUpdate',
    );

    const outFileContent = await readFile(
      outFile,
      'Failed reading test_space/dist/services/engine/createdDir/some.js.',
    );

    sm.snap('services:engine:createDir:some.js:restart', {
      createdDir: toCreateDirPath,
      createdOutDir: createdDirOutPath,
      srcFile,
      outFile,
      outFileContent,
    });

    // updating src file to check for smooth rebuild after
    // Update the the copied file to check that now the rebuild work smooth
    const srcFileUpdatedContent = newServiceTemplate.replace(
      'RESTART_NEW_SERVICE_V1',
      'RESTART_NEW_SERVICE_V2',
    );

    await writeFile(srcFile, srcFileUpdatedContent);

    await listenToRestart(
      execOutput.data.childProcess,
      'createDirectoryAndUpdate-2',
    );

    const updatedOutFileContent = await readFile(
      outFile,
      'Failed reading test_space/dist/services/engine/createdDir/some.js.',
    );

    sm.snap('services:engine:createDir:some.js:update:restart', {
      createdDir: toCreateDirPath,
      createdOutDir: createdDirOutPath,
      srcFile,
      outFile,
      srcFileContent: newServiceTemplate,
      outFileContent,
      srcFileUpdatedContent,
      updatedOutFileContent,
    });

    // ________________________________________ sub dir

    // create sub dir and create a file
    await createDir(subDir);
    await writeFile(subSrcFile, newServiceTemplate);

    await listenToRestart(
      execOutput.data.childProcess,
      'createDirectoryAndUpdate-3',
    );

    const subOutFileContent = await readFile(
      subOutFile,
      'Failed reading test_space/dist/services/engine/createdDir/subDir/some.js.',
    );

    sm.snap('services:engine:createDir:sub:some.js:restart', {
      createdDir: toCreateDirPath,
      createdOutDir: createdDirOutPath,
      subDir,
      subOutDir,
      subSrcFile,
      subOutFile,
      subOutFileContent,
    });

    // updating src file to check for smooth rebuild after
    // Update the the copied file to check that now the rebuild work smooth
    await writeFile(subSrcFile, srcFileUpdatedContent);

    await listenToRestart(
      execOutput.data.childProcess,
      'createDirectoryAndUpdate-4',
    );

    const subOutFileUpdatedContent = await readFile(
      subOutFile,
      'Failed reading test_space/dist/services/engine/createdDir/subDir/some.js.',
    );

    sm.snap('services:engine:createDir:sub:some.js:update:restart', {
      createdDir: toCreateDirPath,
      createdOutDir: createdDirOutPath,
      subDir,
      subOutDir,
      subSrcFile,
      subOutFile,
      subOutFileContent,
      subOutFileUpdatedContent,
    });
  }

  /**
   * Rename a directory
   * //////////////////////////////////
   */
  const renamedCreatedSrcDir = r(tSrcDir, 'services/engine/renamedCreatedDir');
  const renamedCreatedOutDir = r(tOutDir, 'services/engine/renamedCreatedDir');

  const renamedSubCreatedSrcDir = r(renamedCreatedSrcDir, 'subDir');
  const renamedSubCreatedOutDir = r(renamedCreatedOutDir, 'subDir');

  async function renameDirectoryAndUpdate() {
    const _renamedSrcFile = r(renamedCreatedSrcDir, 'some.js');
    const _renamedOutFile = r(renamedCreatedOutDir, 'some.js');
    const _renamedSubSrcFile = r(renamedSubCreatedSrcDir, 'some.js');
    const _renamedSubOutFile = r(renamedSubCreatedOutDir, 'some.js');

    // create dir and a file within it
    await rename(toCreateDirPath, renamedCreatedSrcDir);

    await listenToRestartAfterDeleteOrRename(
      execOutput.data.childProcess,
      'renameDirectoryAndUpdate',
    );

    const renamedOutFileContent = await readFile(
      _renamedOutFile,
      'Failed reading test_space/dist/services/engine/renamedCreatedDir/some.js.',
    );

    sm.snap('services:engine:rename:createdDir:restart', {
      createdDir: toCreateDirPath,
      createdOutDir: createdDirOutPath,
      renamedCreatedSrcDir,
      renamedCreatedOutDir,
      renamedSrcFile: _renamedSrcFile,
      renamedOutFile: _renamedOutFile,
      renamedOutFileContent,
    });

    // updating src file to check for smooth rebuild after
    // Update the the copied file to check that now the rebuild work smooth
    const renamedSrcFileUpdatedContent = newServiceTemplate.replace(
      'RESTART_NEW_SERVICE_V1',
      'RESTART_NEW_SERVICE_V3',
    );

    await writeFile(_renamedSrcFile, renamedSrcFileUpdatedContent);

    await listenToRestart(
      execOutput.data.childProcess,
      'renameDirectoryAndUpdate-2',
    );

    const renamedUpdatedOutFileContent = await readFile(
      _renamedOutFile,
      'Failed reading test_space/dist/services/engine/createdDir/some.js.',
    );

    sm.snap('services:engine:rename:createdDir:update:restart', {
      createdDir: toCreateDirPath,
      createdOutDir: createdDirOutPath,
      renamedSrcFile,
      renamedOutFile: _renamedOutFile,
      srcFileContent: newServiceTemplate,
      outFileContent: renamedOutFileContent,
      renamedSrcFileUpdatedContent,
      renamedUpdatedOutFileContent,
    });

    // ________________________________________ sub dir

    // update rename sub dir some.js
    await writeFile(_renamedSubSrcFile, renamedSrcFileUpdatedContent);

    await listenToRestart(
      execOutput.data.childProcess,
      'renameDirectoryAndUpdate-3',
    );

    const renamedSubOutUpdatedContent = await readFile(
      _renamedSubOutFile,
      'Failed reading test_space/dist/services/engine/renamedCreatedDir/subDir/some.js.',
    );

    sm.snap('services:engine:rename:createDir:sub:update:restart', {
      createdDir: toCreateDirPath,
      createdOutDir: createdDirOutPath,
      subDir,
      subOutDir,
      subSrcFile: _renamedSubSrcFile,
      subOutFile: _renamedSubOutFile,
      subSrcFileUpdatedContent: renamedSrcFileUpdatedContent,
      renamedSubOutUpdatedContent,
    });
  }

  /**
   * Remove a directory
   * //////////////////////////////////
   */
  async function removeDirectoryAndUpdateSomeFile() {
    await removeDir(renamedCreatedSrcDir);

    await listenToRestart(
      execOutput.data.childProcess,
      'removeDirectoryAndUpdateSomeFile',
    );

    sm.snap('services:engine:removeDir:restart', {
      removedDir: renamedCreatedSrcDir,
    });

    // Update some file after the restart
    const srcFileToUpdate = r(tSrcDir, 'services/engine/core.js');
    const updateOutFile = r(tOutDir, 'services/engine/core.js');

    const srcFileContent = await readFile(srcFileToUpdate);
    const updateContent = srcFileContent.replace(
      /RESTART_V\d:services\/engine\/core\.js/,
      'RESTART_V5:services/engine/core.js',
    );

    await writeFile(srcFileToUpdate, updateContent);

    await listenToRestart(
      execOutput.data.childProcess,
      'removeDirectoryAndUpdateSomeFile-2',
    );

    const updateOutFileContent = await readFile(updateOutFile);

    sm.snap('services:engine:removeDir:update:restart', {
      removedDir: renamedCreatedSrcDir,
      updatedSrcFile: srcFileToUpdate,
      updateOutFile,
      updatedSrcFileContent: updateContent,
      updateOutFileContent,
    });
  }

  /**
   * Copy a directory
   * //////////////////////////////////
   */
  async function copyDirectoryAndUpdate() {
    const copySrcDestDir = r(tSrcDir, 'services/engine/copyDir');
    const copyOutDir = r(tOutDir, 'services/engine/copyDir');
    const copiedSrcFile = r(copySrcDestDir, 'copy.js');
    const copiedOutFile = r(copyOutDir, 'copy.js');
    const toCopyCopyDir = r(copyDir, 'copyDir');

    await copy(toCopyCopyDir, copySrcDestDir);

    await listenToRestart(
      execOutput.data.childProcess,
      'copyDirectoryAndUpdate',
    );

    const copiedSrcFileContent = await readFile(copiedSrcFile);
    const copiedOutFileContent = await readFile(copiedOutFile);

    sm.snap('services:engine:copyDir:restart', {
      copyDir,
      copySrcDestDir,
      copyOutDir,
      copiedSrcFile,
      copiedOutFile,
      copiedSrcFileContent,
      copiedOutFileContent,
    });

    // Updating the copied file to check for smooth rebuild
    const updatedContent = copiedSrcFileContent.replace(
      'COPY_FILE_V1',
      'COPY_FILE_V2',
    );

    await writeFile(copiedSrcFile, updatedContent);

    await listenToRestart(
      execOutput.data.childProcess,
      'copyDirectoryAndUpdate-2',
    );

    const copiedOutFileUpdatedContent = await readFile(copiedOutFile);

    sm.snap('services:engine:copyDir:update:restart', {
      copyDir,
      copySrcDestDir,
      copyOutDir,
      copiedSrcFile,
      copiedOutFile,
      copiedSrcFileUpdatedContent: updatedContent,
      copiedOutFileUpdatedContent,
    });
  }

  /**
   * Move a directory
   * //////////////////////////////////
   */

  async function moveDirectoryAndUpdate() {
    const toMoveSrcDir = r(tSrcDir, 'toMove/moveDir');
    const moveSrcDestDir = r(tSrcDir, 'services/engine/moveDir');
    const moveOutDir = r(tOutDir, 'services/engine/moveDir');
    const movedSrcFile = r(moveSrcDestDir, 'move.js');
    const moveOutFile = r(moveOutDir, 'move.js');

    await rename(toMoveSrcDir, moveSrcDestDir);

    await listenToRestartAfterDeleteOrRename(
      execOutput.data.childProcess,
      'moveDirectoryAndUpdate',
    );

    const movedSrcFileContent = await readFile(movedSrcFile);
    const moveOutFileContent = await readFile(moveOutFile);

    sm.snap('services:engine:moveDir:restart', {
      toMoveSrcDir,
      moveSrcDestDir,
      moveOutDir,
      moveOutFile,
      movedSrcFileContent,
      moveOutFileContent,
    });

    // Updating the moved file to check for smooth rebuild
    const updatedContent = movedSrcFileContent.replace(
      'MOVE_FILE_V1',
      'MOVE_FILE_V2',
    );

    await writeFile(movedSrcFile, updatedContent);

    await listenToRestart(
      execOutput.data.childProcess,
      'moveDirectoryAndUpdate-2',
    );

    const moveOutFileUpdatedContent = await readFile(moveOutFile);

    sm.snap('services:engine:moveDir:update:restart', {
      toMoveSrcDir,
      moveSrcDestDir,
      moveOutDir,
      moveOutFile,
      movedSrcFileUpdatedContent: updatedContent,
      moveOutFileUpdatedContent,
    });
  }

  // r1: run experiment
  await appJsUpdate();
  await updateServicesFirstLevelFiles();
  await updateServicesEngineFiles();

  // real important experiences and things to test
  await createFileThenUpdateToTestGlobs();
  await renameThenUpdate();
  await deleteFileAndCheckRestart();
  await copyFileAndUpdate();
  await moveFileAndUpdate();
  await createDirectoryAndUpdate();
  await renameDirectoryAndUpdate();
  await removeDirectoryAndUpdateSomeFile();
  await copyDirectoryAndUpdate();
  await moveDirectoryAndUpdate();
  // r2:
}

// async function runRestartAllAtOnceExperiment() {
//   const [servicesSrcFiles, engineSrcFiles] = await Promise.all([
//     getServicesFiles(),
//     getServicesEngineFiles(),
//   ]);
//   /**
//    * Read files all at once
//    */
//   const [appSrcContent, servicesSrcFilesContents, engineSrcFilesContents] =
//     await Promise.all([
//       readFile(appSrcFile, 'AllAtOnce: Failed to read ./app.js file'),
//       readFilesContents(
//         servicesSrcFiles,
//         'AllAtOnce: Failed to read ./services/*.js file',
//       ),
//       readFilesContents(
//         engineSrcFiles,
//         'AllAtOnce: Failed to read ./services/engine/**/*.js file',
//       ),
//     ]);

//   /**
//    * Update files all at once
//    */
//   const updateAppContent = appSrcContent.replace(/RESTART_V2/g, 'RESTART_V3');
//   const updateServicesContents = servicesSrcFilesContents.map((content) =>
//     content.replace(/RESTART_V2/g, 'RESTART_V3'),
//   );
//   const updateEngineContents = engineSrcFilesContents.map((content) =>
//     content.replace(/RESTART_V2/g, 'RESTART_V3'),
//   );
//   await Promise.all([
//     writeFile(
//       appSrcFile,
//       updateAppContent,
//       'Failed to update test_space/src/app.js.',
//     ),
//     updateFilesContents(
//       servicesSrcFiles,
//       updateServicesContents,
//       'Failed to update services file',
//     ),
//     updateFilesContents(
//       engineSrcFiles,
//       updateEngineContents,
//       'Failed to update services file',
//     ),
//   ]);

//   /**
//    * Listening to stdout (console)
//    */
//   await listenToRestart(execOutput.data.childProcess);

//   /**
//    * Reading output files after restart
//    */
//   const [appOutContent, servicesOutFilesContents, engineOutFilesContents] =
//     await Promise.all([
//       readFile(appOutFile, 'AllAtOnce: Failed to read ./app.js file'),
//       readFilesContents(
//         servicesSrcFiles.map((file) => getOutFile(file, tSrcDir, tOutDir)),
//         'AllAtOnce: Failed to read out ./services/*.js file',
//       ),
//       readFilesContents(
//         engineSrcFiles.map((file) => getOutFile(file, tSrcDir, tOutDir)),
//         'AllAtOnce: Failed to read out ./services/engine/**/*.js file',
//       ),
//     ]);

//   sm.snap('allAtOnce:recompiled', {
//     src: {
//       app: appSrcFile,
//       services: servicesSrcFiles,
//       engine: engineSrcFiles,
//     },
//     content: {
//       app: appSrcContent,
//       services: servicesSrcFilesContents,
//       engine: engineSrcFilesContents,
//     },
//     updateContent: {
//       app: updateAppContent,
//       services: updateServicesContents,
//       engine: updateEngineContents,
//     },
//     outContent: {
//       app: appOutContent,
//       services: servicesOutFilesContents,
//       engine: engineOutFilesContents,
//     },
//   });

//   // ________________________________________________________________/‾‾‾‾))))))
//   // TODO: Remove one Dir, rename another, create one file, remove one file all at once
//   // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\____))))))
// }

/**
 * Experiments runner
 */

async function runExperiments() {
  await prepareTestSpace();

  /**
   * Running mix command and first compilation
   */
  try {
    console.log('Gonna run the command in watch mode');

    const successOut = await runMixCommand({
      rootDir: testSpaceDir,
      outDir: './dist',
      shouldWatch: true,
    });
    execOutput = {
      state: 'success',
      data: successOut,
    };
    sm.snap('runMixCommand:success', execOutput);

    console.log('command run with success', successOut);
  } catch (err) {
    execOutput = {
      state: 'error',
      data: err,
    };
    console.log('Command run failed');
    console.log(execOutput.data.cause);
    fail(`Command run failed!\n${stringify(err)}`);
  }

  /**
   * Gathering first compilation output
   */

  try {
    const srcFiles = await fastGlob(r(tSrcDir, './**/*.js'), {
      ignore: [r(tSrcDir, './toMove/**/*')],
    });
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++', srcFiles);
    const filesObjs = await Promise.all(
      checkOutFiles({
        srcFiles,
        srcDir: tSrcDir,
        outDir: tOutDir,
        readFileIfExist: true,
      }),
    );

    sm.snap('firstCompile:outputCheck', filesObjs);
  } catch (err) {
    console.log(err);
    fail(`One of the file is not accessible.\n${stringify(err)}`);
  }

  await runRestartOneAfterAnotherExperiment();
  // await runRestartAllAtOnceExperiment();
}

beforeAll(async () => {
  await runExperiments();
});

afterAll(() => {
  process.kill(execOutput.data.childProcess.pid);
  const metaCache = new MetaCache();
  if (metaCache.values.sessions.length > 0) {
    metaCache.values.sessions.forEach((session) => {
      const toCleanCache = flatCache.load(session.id);
      // kill any orphan processes
      const childPids = toCleanCache.getKey('childPids') || [];
      if (childPids.length > 0) {
        childPids.forEach((pid) => {
          process.kill(pid);
        });
      }
      toCleanCache.destroy();
      metaCache.removeSessionsByIds([session.id]).save();
    });
  }
});

test('experiments events are happening in expected order', () => {
  const expected = [
    'runMixCommand:success',
    'firstCompile:outputCheck',
    'appJs:recompiled',
    'services:l1:recompiled',
    'services:engine:recompiled',
    'services:l1:create:new.service:restart',
    'services:l1:create:new.service:update:restart',
    'services:l1:rename:renamed.service:restart',
    'services:l1:rename:renamed.service:update:restart',
    'services:l1:delete:renamed.service:restart',
    'services:l1:copy:copyFile.service:restart',
    'services:l1:copy:copyFile.service:update:restart',
    'services:l1:move:moveFile.service:restart',
    'services:l1:move:moveFile.service:update:restart',
    'services:engine:createDir:some.js:restart',
    'services:engine:createDir:some.js:update:restart',
    'services:engine:createDir:sub:some.js:restart',
    'services:engine:createDir:sub:some.js:update:restart',
    'services:engine:rename:createdDir:restart',
    'services:engine:rename:createdDir:update:restart',
    'services:engine:rename:createDir:sub:update:restart',
    'services:engine:removeDir:restart',
    'services:engine:removeDir:update:restart',
    'services:engine:copyDir:restart',
    'services:engine:copyDir:update:restart',
    'services:engine:moveDir:restart',
    'services:engine:moveDir:update:restart',
    //     'allAtOnce:recompiled',
  ];

  expect(sm.getSnapsCount()).toBe(expected.length);
  expected.forEach((expectedEvent, index) => {
    expect(sm.getSnapAtIndex(index).id()).toBe(expectedEvent);
  });
});

describe('Testing first compile', () => {
  test('first compile work well', () => {
    const snap = sm.getSnap('firstCompile:outputCheck');

    if (!snap) {
      fail('firstCompile:outputCheck event is missing from the events source!');
    }

    const filesObjs = snap.val();

    filesObjs.forEach((fileObj) => {
      expect(fileObj.distFileContent.length > 0).toBeTruthy();
      expect(fileObj.distFileContent).toContain('webpackBootstrap');
    });
  });
});

describe('Testing restart', () => {
  describe('One after another experiment', () => {
    test('no glob selected file', () => {
      const snap = getEventSnapOrFail(sm, 'appJs:recompiled');

      const { content, outContent } = snap.val();

      expect(content).toContain('RESTART_V1:app.js');
      expect(outContent).toContain('RESTART_V2:app.js');
      expect(outContent.indexOf('RESTART_V1:app.js') === -1).toBeTruthy();
    });

    test('services/*.js files', () => {
      const snap = getEventSnapOrFail(sm, 'services:l1:recompiled');

      const { srcFiles, filesContents, outFilesContents } = snap.val();

      function getId(file) {
        return `services/${path.basename(file)}`;
      }

      filesContents.forEach((content, index) => {
        expect(content).toContain(`RESTART_V1:${getId(srcFiles[index])}`);
      });
      outFilesContents.forEach((outContent, index) => {
        const id = getId(srcFiles[index]);
        expect(outContent).toContain(`RESTART_V2:${id}`);
        expect(outContent.indexOf(`RESTART_V1:${id}`) === -1).toBeTruthy();
      });
    });

    test('services/engine/**/*.js files', () => {
      const snap = getEventSnapOrFail(sm, 'services:engine:recompiled');

      const { srcFiles, filesContents, outFilesContents } = snap.val();

      function getId(file) {
        return path.relative(tSrcDir, file);
      }

      filesContents.forEach((content, index) => {
        expect(content).toContain(`RESTART_V1:${getId(srcFiles[index])}`);
      });
      outFilesContents.forEach((outContent, index) => {
        const id = getId(srcFiles[index]);
        expect(outContent).toContain(`RESTART_V2:${id}`);
        expect(outContent.indexOf(`RESTART_V1:${id}`) === -1).toBeTruthy();
      });
    });

    test('creating files and restart and then updating them', () => {
      {
        const { outContent } = getEventSnapOrFail(
          sm,
          'services:l1:create:new.service:restart',
        ).val();

        console.log();

        expect(outContent).toContain('RESTART_NEW_SERVICE_V1');
      }
      {
        const { outContent } = getEventSnapOrFail(
          sm,
          'services:l1:create:new.service:update:restart',
        ).val();

        expect(outContent).toContain('RESTART_NEW_SERVICE_V2');
      }
    });

    test('renaming files and restart and then updating them', () => {
      {
        const { renamedOutContent } = getEventSnapOrFail(
          sm,
          'services:l1:rename:renamed.service:restart',
        ).val();

        expect(renamedOutContent).toContain('RESTART_NEW_SERVICE_V2');
      }
      {
        const { renamedOutUpdatedContent } = getEventSnapOrFail(
          sm,
          'services:l1:rename:renamed.service:update:restart',
        ).val();

        expect(renamedOutUpdatedContent).toContain(
          'RESTART_RENAMED_SERVICE_V1',
        );
      }
    });

    test('removing files and restart', () => {
      const { removedFile } = getEventSnapOrFail(
        sm,
        'services:l1:delete:renamed.service:restart',
      ).val();

      expect(removedFile).toContain(r(tSrcDir, './services/rename.service.js'));
    });

    test('copy files and restart and then updating them', () => {
      {
        const { copiedSrcFileContent } = getEventSnapOrFail(
          sm,
          'services:l1:copy:copyFile.service:restart',
        ).val();

        expect(copiedSrcFileContent).toContain('COPY_FILE_V1');
      }
      {
        const { outContent } = getEventSnapOrFail(
          sm,
          'services:l1:copy:copyFile.service:update:restart',
        ).val();

        expect(outContent).toContain('COPY_FILE_V2');
      }
    });

    test('move files and restart and then updating them', () => {
      {
        const { outFileContent } = getEventSnapOrFail(
          sm,
          'services:l1:move:moveFile.service:restart',
        ).val();

        expect(outFileContent).toContain('MOVE_FILE_V1');
      }
      {
        const { outContent } = getEventSnapOrFail(
          sm,
          'services:l1:move:moveFile.service:update:restart',
        ).val();

        expect(outContent).toContain('MOVE_FILE_V2');
      }
    });

    test('Create directories and file and restart and then updating the files', () => {
      // Creating dir and file within it
      {
        const { outFileContent } = getEventSnapOrFail(
          sm,
          'services:engine:createDir:some.js:restart',
        ).val();

        expect(outFileContent).toContain('hello RESTART_NEW_SERVICE_V1');
      }
      {
        const { updatedOutFileContent } = getEventSnapOrFail(
          sm,
          'services:engine:createDir:some.js:update:restart',
        ).val();

        expect(updatedOutFileContent).toContain('hello RESTART_NEW_SERVICE_V2');
      }
      // creating sub dir and files within it
      {
        const { subOutFileContent } = getEventSnapOrFail(
          sm,
          'services:engine:createDir:sub:some.js:restart',
        ).val();

        expect(subOutFileContent).toContain('hello RESTART_NEW_SERVICE_V1');
      }
      {
        const { subOutFileUpdatedContent } = getEventSnapOrFail(
          sm,
          'services:engine:createDir:sub:some.js:update:restart',
        ).val();

        expect(subOutFileUpdatedContent).toContain(
          'hello RESTART_NEW_SERVICE_V2',
        );
      }
    });

    test('Rename directories and restart and then updating the files', () => {
      // Creating dir and file within it
      {
        const { renamedOutFileContent } = getEventSnapOrFail(
          sm,
          'services:engine:rename:createdDir:restart',
        ).val();

        expect(renamedOutFileContent).toContain('hello RESTART_NEW_SERVICE_V2');
      }
      {
        const { renamedUpdatedOutFileContent } = getEventSnapOrFail(
          sm,
          'services:engine:rename:createdDir:update:restart',
        ).val();

        expect(renamedUpdatedOutFileContent).toContain(
          'hello RESTART_NEW_SERVICE_V3',
        );
      }
      // creating sub dir and files within it
      {
        const { renamedSubOutUpdatedContent } = getEventSnapOrFail(
          sm,
          'services:engine:rename:createDir:sub:update:restart',
        ).val();

        expect(renamedSubOutUpdatedContent).toContain(
          'hello RESTART_NEW_SERVICE_V3',
        );
      }
    });

    test('Remove directories and restart and then updating the files', () => {
      // Creating dir and file within it
      {
        const { removedDir: rmvDir } = getEventSnapOrFail(
          sm,
          'services:engine:removeDir:restart',
        ).val();

        expect(rmvDir).toBe(r(tSrcDir, 'services/engine/renamedCreatedDir'));
      }
      {
        const { updateOutFileContent } = getEventSnapOrFail(
          sm,
          'services:engine:removeDir:update:restart',
        ).val();

        expect(updateOutFileContent).toContain(
          'RESTART_V5:services/engine/core.js',
        );
      }
    });

    test('Copy directories and restart and then updating the files', () => {
      // Creating dir and file within it
      {
        const { copiedOutFileContent } = getEventSnapOrFail(
          sm,
          'services:engine:copyDir:restart',
        ).val();

        expect(copiedOutFileContent).toContain('COPY_FILE_V1');
      }
      {
        const { copiedOutFileUpdatedContent } = getEventSnapOrFail(
          sm,
          'services:engine:copyDir:update:restart',
        ).val();

        expect(copiedOutFileUpdatedContent).toContain('COPY_FILE_V2');
      }
    });

    test('Move directories and restart and then updating the files', () => {
      // Creating dir and file within it
      {
        const { moveOutFileContent } = getEventSnapOrFail(
          sm,
          'services:engine:moveDir:restart',
        ).val();

        expect(moveOutFileContent).toContain('MOVE_FILE_V1');
      }
      {
        const { moveOutFileUpdatedContent } = getEventSnapOrFail(
          sm,
          'services:engine:moveDir:update:restart',
        ).val();

        expect(moveOutFileUpdatedContent).toContain('MOVE_FILE_V2');
      }
    });
  });

  // describe('All at once experiment', () => {
  //   test('no glob selected file', () => {
  //     const { content, outContent } = getEventSnapOrFail(
  //       sm,
  //       'allAtOnce:recompiled',
  //     ).val();
  //     expect(content.app).toContain('RESTART_V2:app.js');
  //     expect(outContent.app).toContain('RESTART_V3:app.js');
  //     expect(outContent.app.indexOf('RESTART_V2:app.js') === -1).toBeTruthy();
  //   });

  //   test('services/*.js files', () => {
  //     const { src, content, outContent } = getEventSnapOrFail(
  //       sm,
  //       'allAtOnce:recompiled',
  //     ).val();

  //     function getId(file) {
  //       return `services/${path.basename(file)}`;
  //     }

  //     content.services.forEach((fileContent, index) => {
  //       expect(fileContent).toContain(
  //         `RESTART_V2:${getId(src.services[index])}`,
  //       );
  //     });
  //     outContent.services.forEach((outFileContent, index) => {
  //       const id = getId(src.services[index]);
  //       expect(outFileContent).toContain(`RESTART_V3:${id}`);
  //       expect(outFileContent.indexOf(`RESTART_V2:${id}`) === -1).toBeTruthy();
  //     });
  //   });

  //   test('services/engine/**/*.js files', () => {
  //     const { src, content, outContent } = getEventSnapOrFail(
  //       sm,
  //       'allAtOnce:recompiled',
  //     ).val();

  //     function getId(file) {
  //       return path.relative(tSrcDir, file);
  //     }

  //     content.engine.forEach((fileContent, index) => {
  //       expect(fileContent).toContain(`RESTART_V2:${getId(src.engine[index])}`);
  //     });
  //     outContent.engine.forEach((outFileContent, index) => {
  //       const id = getId(src.engine[index]);
  //       expect(outFileContent).toContain(`RESTART_V3:${id}`);
  //       expect(outFileContent.indexOf(`RESTART_V2:${id}`) === -1).toBeTruthy();
  //     });
  //   });

  //   /**
  //    * Tests not finished. And not that important. Not counting to finish them
  //    */import { MetaCache } from '../../src/WatchingManager/Cache/MetaCache';

  // });
});
