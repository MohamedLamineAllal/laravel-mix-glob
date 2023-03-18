import debug from 'debug';
import { isChildProcess } from '@Utils/helpers';

const id = `${isChildProcess() ? 'child' : 'master'}:${process.pid}`;

const LOGGER =
  process.env.NO_LOG || process.env.SILENT_LOG
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

type LoggerType = typeof LOGGER;

function settingUpLogging() {
  // Debug mode
  if (process.env.DEBUG) {
    const debugStr = process.env.DEBUG.toLowerCase().trim();
    if (debugStr === '1' || debugStr === 'true') {
      debug.enable('MixGlob:*');
      // debug.enable('MixGlob, MixGlob:Error, MixGlob:debug');
    }
  } else {
    // No debug mode
    debug.enable('MixGlob, MixGlob:Error');
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
