/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-constant-condition */
import { spawn } from 'cross-spawn';
import uniq from 'lodash.uniq';
import { Glob } from '@Glob';
import { LOGGER } from '@Utils/Logger';
import { blockingSleep, isChildProcess, killProcess } from '@Utils/helpers';
import { TRestartReason } from './types';
import { WatchingHandler } from '../WatchingHandler';
import { Cache } from '../Cache';

export class RestartHandler {
  public isRestarting = false;

  public masterProcessId?: number;

  public parentProcessId?: number;

  private _watchingHandler!: WatchingHandler;

  private _cacheHandler: Cache;

  private _isKillingAll = false;

  constructor() {
    this._cacheHandler = new Cache();
    this.masterProcessId = Number(process.env.MIX_GLOB_MASTER_PROCESS_ID);
    this.parentProcessId = Number(process.env.MIX_GLOB_PARENT_PROCESS_ID);
    this._checkAndKillParentProcess();

    if (isChildProcess()) {
      LOGGER.debug(
        `Adding new child current process (${process.pid}) to cache.`,
      );
      this._cacheHandler.addChildPids([process.pid]).save();
    } else {
      this._cacheHandler.cleanOrphans();
    }
  }

  private _checkAndKillParentProcess() {
    LOGGER.debug('Checking to Kill parent process:');
    LOGGER.debug(
      this.parentProcessId
        ? `Parent pid found (${this.parentProcessId})`
        : 'No parent',
    );
    LOGGER.debug(`pid: ${process.env.MIX_GLOB_PARENT_PROCESS_ID}`);

    /**
     * Condition: There is parent but is not the master process
     * NOTE: Master process wouldn't be killed through the whole life time
     */
    if (this.parentProcessId && this.parentProcessId !== this.masterProcessId) {
      const isKilled = killProcess(this.parentProcessId);

      this._cacheHandler.removeChildPids([this.parentProcessId]).save();
      LOGGER.debug('After remove: ', this._cacheHandler.values);

      if (isKilled) {
        LOGGER.debug(
          `Kill: Parent process (pid: ${this.parentProcessId}) is killed.`,
        );
      }
    } else {
      LOGGER.debug('Parent is Master. No killing.');
    }
  }

  public setWatchingHandler(watchingHandler: WatchingHandler): this {
    this._watchingHandler = watchingHandler;
    return this;
  }

  public restartMix(reason: TRestartReason, pth: string, glob: Glob): void {
    if (!this._watchingHandler) {
      throw new Error(
        'Watching handler need to be set first using .setWatchingHandler() method',
      );
    }
    LOGGER.log(`WATCH: ${reason}`.bgYellow);
    LOGGER.log(pth);

    let pthLogMsg = '';

    switch (reason) {
      case 'add':
        pthLogMsg = 'File added :';
        break;
      case 'unlink':
        pthLogMsg = 'File removed :';
        break;
      case 'unlinkDir':
        pthLogMsg = 'Directory removed :';
        break;
      default:
    }

    if (!this.isRestarting) {
      this.isRestarting = true;

      try {
        LOGGER.log(pthLogMsg.bgBlue);
        LOGGER.log(pth.yellow);
        LOGGER.log('Matching glob: '.bgBlue);
        LOGGER.log(glob.value);
        LOGGER.debug(this._watchingHandler.watchedGlobs);
        LOGGER.log('restart...'.cyan);

        let commandArgs = ['mix', 'watch'];

        if (this._watchingHandler.watchType! === 'hot') {
          commandArgs.push('--hot');
        }

        commandArgs = uniq([...commandArgs, '--', ...process.argv.slice(2)]);

        LOGGER.debug('Command args:', commandArgs);

        let env: Record<string, string> = {
          ...process.env,
          MIX_GLOB_IS_CHILD: 'true',
          MIX_GLOB_PARENT_PROCESS_ID: process.pid.toString(),
        };

        if (!isChildProcess()) {
          env = {
            ...env,
            MIX_GLOB_MASTER_PROCESS_ID: process.pid.toString(),
            /**
             * NOTE: Unique identifier for a session (master process + all child processes exec)
             * NOTE: Ex: It is used to keep loading the same cache for the same session,
             * NOTE: through the successive child processes
             */
            GLOB_MIX_SESSION_ID: this._cacheHandler.sessionId,
          };
        }

        const childProcess = spawn('npx', commandArgs, {
          detached: true,
          stdio: 'inherit',
          cwd: process.cwd(),
          env,
        });

        childProcess.on('error', (err) => {
          LOGGER.debug('childProcess.on(error)');
          LOGGER.err(err);
          setTimeout(() => {
            this.killAllAliveProcesses();
          }, 500);
        });

        childProcess.unref();

        if (!isChildProcess()) {
          /**
           * Blocking the master process
           */

          LOGGER.debug(
            '////////////////////////////////////////////////////////////////'
              .bgYellow,
          );

          while (true) {
            LOGGER.debug('BLOCKING MASTER! sleep 999999999!');
            try {
              blockingSleep(999999999);
            } catch (err) {
              LOGGER.debug(
                '////////////////////////////////////////////////////////////////'
                  .bgBlue,
              );
              LOGGER.debug(
                'pids alone',
                this._cacheHandler.flatCache.getKey('childPids'),
              );
              LOGGER.debug('before syncing: ', this._cacheHandler.values);

              this._cacheHandler.syncWithCache();
              LOGGER.debug('After syncing: ', this._cacheHandler.values);
              LOGGER.debug('Exiting process MASTER process.');
              LOGGER.debug('Exiting process. See you next time!');

              this.killAllAliveProcesses();

              return;
            }
          }
        }

        LOGGER.debug(
          '////////////////////////////////////////////////////////////////'
            .bgBlue,
        );

        LOGGER.debug(`Parent pid ==== ${process.pid}`);
        LOGGER.debug('To be killed by new Child replacement.');
      } catch (err) {
        LOGGER.err(err);
      }
    }
  }

  /**
   * End this session and kill all it's alive processes
   */
  public killAllAliveProcesses(): void {
    if (this._isKillingAll) return;
    this._isKillingAll = true;

    /**
     * killing child processes
     * current process is skipped if included
     */
    LOGGER.debug('killAllAliveProcesses > /////////////////////'.bgRed);

    this._cacheHandler.syncWithCache();
    LOGGER.debug('Child pids: ', this._cacheHandler.values.childPids);

    this._cacheHandler.values.childPids.forEach((pid) => {
      LOGGER.debug(`pid: ${pid}`);
      LOGGER.debug(`current process id: ${process.pid}`);
      if (pid !== process.pid) {
        LOGGER.debug('Different > kill');
        killProcess(pid);
      }
    });

    /**
     * Kill master
     */
    LOGGER.debug('Check master process:');
    LOGGER.debug(`Master pid: ${this.masterProcessId}`);
    LOGGER.debug(`Current process id: ${process.pid}`);

    if (this.masterProcessId && this.masterProcessId !== process.pid) {
      LOGGER.debug('Different > kill');
      killProcess(this.masterProcessId);
    }

    /**
     * destroy the session cache document
     */
    LOGGER.debug('Destroying cache document. And updating meta cache.');
    const { sessionId } = this._cacheHandler;
    this._cacheHandler.metaCache.removeSessionsByIds([sessionId]).save();
    this._cacheHandler.destroy();

    /**
     * Exit current process
     */
    LOGGER.debug('Exiting current process.');
    setTimeout(() => {
      process.exit(0);
    }, 100);
  }
}
