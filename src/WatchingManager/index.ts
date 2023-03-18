import 'colors';
import { LOGGER } from '@Utils/Logger';
import { handleInterrupts } from './InterruptsHandler';
import { WatchingHandler } from './WatchingHandler';
import { RestartHandler } from './RestartHandler';

export class WatchingManager {
  public watchingHandler!: WatchingHandler;

  public restartHandler!: RestartHandler;

  /**
   * All actions that need to run in init related to the watching should go here.
   */
  public init() {
    LOGGER.debug('Initializing watching manager');
    this.watchingHandler = new WatchingHandler();
    const { restartHandler } = this.watchingHandler.init();

    if (restartHandler) {
      /**
       * mean: should watch
       */
      this.restartHandler = restartHandler;

      if (process.stdout) {
        /**
         * Handle interrupts and the exit when user quit the process
         * Killing all subprocesses listed in the .values.pidsList
         */
        handleInterrupts(this.restartHandler);
      }
    }
  }
}
