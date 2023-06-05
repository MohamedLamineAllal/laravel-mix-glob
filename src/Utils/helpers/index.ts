import { LOGGER } from '@Utils/Logger';
import { execSync } from 'child_process';
import os from 'os';

export function isEnterChar(character: string): boolean {
  return ['\n', '\r'].some((c) => character.includes(c));
}

export function isChildProcess() {
  return process.env.MIX_GLOB_IS_CHILD === 'true';
}

export function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Blocking sleep to block a process
 */
export function blockingSleep(time = 999999999) {
  const command =
    os.platform() === 'win32' ? `timeout /t ${time}` : `sleep ${time}`;

  if (time === -1) {
    /**
     * blocking indefinitely until CTRL-C or termination signal
     */
    while (true) {
      execSync(command, {
        stdio: 'ignore',
      });
    }
    return;
  }

  execSync(command, {
    stdio: 'ignore',
  });
}

/**
 * Process killing function that doesn't fail
 * And include debugging statements
 * @return true if kill successfully. false otherwise
 */
export function killProcess(
  pid: number,
  signal: string | number | undefined = 'SIGTERM',
): boolean {
  try {
    LOGGER.debug(`Trying to kill process (pid: ${pid})`);
    process.kill(pid, signal);
    LOGGER.debug('Process killed successfully');
    return true;
  } catch (err: any) {
    LOGGER.debug('Error killing process', err.message);
    return false;
  }
}

export function runMacroTask<T>(callback: () => Promise<T> | T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    setTimeout(async () => {
      try {
        resolve(await callback());
      } catch (err) {
        reject(err);
      }
    }, 0);
  });
}

export function descSortFn(a: number, b: number): number {
  return b - a;
}

export function ascSortFn(a: number, b: number): number {
  return descSortFn(b, a);
}

export function stringify<T>(el: T): string {
  return JSON.stringify(el, null, 4);
}

export function isJest() {
  return process.env.JEST_WORKER_ID !== undefined;
}
