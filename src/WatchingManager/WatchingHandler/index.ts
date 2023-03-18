import chokidar from 'chokidar';
import { Glob } from '@Glob';
import { TGlobPattern } from '@Glob/globResolve/types';
import { LOGGER } from '@Utils/Logger';
import { RestartHandler } from '../RestartHandler';
import { IInitShouldWatchReturn } from './types';

export class WatchingHandler {
  public shouldWatch!: boolean;

  public watchType?: 'watch' | 'hot';

  public watchers: any[] = [];

  public watchedFiles: string[] = [];

  public watchedGlobs: Glob[] = [];

  private _restartHandler!: RestartHandler;

  public init(): IInitShouldWatchReturn {
    LOGGER.debug('Init should watch');
    this._initShouldWatch();
    LOGGER.debug(`shouldWatch: ${this.shouldWatch ? 'true' : 'false'}`);

    if (this.shouldWatch) {
      LOGGER.debug('init RestartHandler.');
      this._restartHandler = new RestartHandler();
      this._restartHandler.setWatchingHandler(this);
      return {
        restartHandler: this._restartHandler,
      };
    }

    return { restartHandler: undefined };
  }

  private _initShouldWatch(): boolean {
    this.shouldWatch = process.argv.some((arg) => arg.includes('watch'));
    if (this.shouldWatch) {
      this.watchType = 'watch';
    }

    if (!this.shouldWatch) {
      this.shouldWatch = process.argv.some((arg) => arg.includes('hot'));

      if (this.shouldWatch) {
        this.watchType = 'hot';
      }
    }
    return this.shouldWatch;
  }

  public watchForGlobs(globs: Glob[]): this {
    globs.forEach((glob) => {
      if (!this.watchedGlobs.includes(glob)) {
        this.watchedGlobs.push(glob);

        let watcher: chokidar.FSWatcher;

        if (glob.isGlobValueAnObject()) {
          watcher = chokidar.watch(glob.value.pattern, {
            persistent: true,
            usePolling: true,
            ignoreInitial: true,
            followSymlinks: glob.value.options?.followSymbolicLinks !== false,
            ignored: glob.value.options?.ignore,
          });
        } else {
          watcher = chokidar.watch(glob.value as TGlobPattern, {
            persistent: true,
            usePolling: true,
            ignoreInitial: true,
            followSymlinks: true,
          });
        }

        this.watchers.push(
          watcher
            .on('add', (pth) => {
              this._restartHandler.restartMix('add', pth, glob);
            })
            .on('unlink', (pth) => {
              this._restartHandler.restartMix('unlink', pth, glob);
            })
            .on('unlinkDir', (pth) => {
              LOGGER.debug('UNLINK DIR CHOKIDAR -------------');
              LOGGER.debug(pth);
              this._restartHandler.restartMix('unlinkDir', pth, glob);
            }),
        );
      }
    });
    return this;
  }

  public addWatchedFiles(files: string[]): this {
    files.forEach((file) => {
      if (!this.watchedFiles.includes(file)) {
        this.watchedFiles.push(file);
      }
    });
    return this;
  }
}
