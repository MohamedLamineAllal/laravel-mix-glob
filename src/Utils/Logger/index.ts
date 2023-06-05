/* eslint-disable no-console */
import debug from 'debug';
import { isChildProcess, isJest } from '@Utils/helpers';

const id = `${isChildProcess() ? 'child' : 'master'}:${process.pid}`;

function buildLogger() {
  if (isJest()) {
    return {
      log: console.log.bind(console),
      err: console.error.bind(console),
      debug: console.debug.bind(console),
    };
  }

  return process.env.NO_LOG || process.env.SILENT_LOG
    ? {
        log: () => {},
        err: () => {},
        debug: () => {},
      }
    : {
        log: debug(`MixGlob:${id}`),
        err: debug(`MixGlob:Error:${id}`),
        debug: debug(`MixGlob:debug:${id}`),
      };
}

const LOGGER = buildLogger();

type LoggerType = typeof LOGGER;

function settingUpLogging() {
  if (isJest()) return;

  // Debug mode
  if (process.env.DEBUG) {
    const debugStr = process.env.DEBUG.toLowerCase().trim();
    if (debugStr === '1' || debugStr === 'true') {
      debug.enable('MixGlob:*');
      // debug.enable('MixGlob, MixGlob:Error, MixGlob:debug');
      console.log('Debug ALLLLLLL is enabled !!!!');
    }
  } else {
    // No debug mode
    debug.enable(`MixGlob:${id}, MixGlob:Error`);
    console.log('Debug is enabled !!!!');
  }

  // Handling Logging tweaking flags
  const debugTweakingEnvFlags = [
    'DEBUG_HIDE_DATE',
    'DEBUG_COLORS',
    'DEBUG_DEPTH',
    'DEBUG_SHOW_HIDDEN',
  ];

  /**
   *  Flags:
   *     'LOG_HIDE_DATE',
   *     'LOG_COLORS',
   *     'LOG_DEPTH',
   *     'LOG_SHOW_HIDDEN'
   *  will apply the same as the DEBUG_ equivalent
   */
  debugTweakingEnvFlags.forEach((debugTweakFlag) => {
    const logTweakFlagEquiv = debugTweakFlag.replace('DEBUG', 'LOG');
    if (process.env[logTweakFlagEquiv]) {
      process.env[debugTweakFlag] = process.env[logTweakFlagEquiv];
    }
  });
}

export { LOGGER, settingUpLogging };
export type { LoggerType };
