import { LOGGER } from '@Utils/Logger';
import { RestartHandler } from '../RestartHandler';

export function handleInterrupts(restartHandler: RestartHandler): void {
  let isExiting = false;

  function handleExit(signal?: string | number | null) {
    if (isExiting) return;

    isExiting = true;

    if (signal) {
      LOGGER.log(signal.toString().bgRed);
    }

    LOGGER.log('Exit interrupt. See you awesomely next time.');

    setTimeout(() => {
      restartHandler.killAllAliveProcesses();
    }, 50);
  }

  // CTRL+C
  process.on('SIGINT', handleExit);
  // Keyboard quit
  process.on('SIGQUIT', handleExit);
}
