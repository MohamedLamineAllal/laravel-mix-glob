import {
  MIX_DEFAULT_FUNCTIONS_SETTINGS,
  TMixFuncSettings,
} from '@MixFunctionSettings';
import path from 'path';

export const EXTENSION_FILE_MAPPING = [
  /**
   * Javascript and typescript
   */
  {
    resolution: /\.[jt]sx?$|\.[cm]?[jt]s$/,
    extension: '.js',
  },
  /**
   * styles and css
   */
  {
    resolution: /\.s?css$|\.(le|sa)ss$|\.styl(us)?$/,
    extension: '.css',
  },
];

/**
 * Resolve file extension following the mapping in src/MixGlob/OutManager/extensionMapping.ts
 * that is a per extension standard mapping.
 * @param {string} file file path
 * @returns {string} file extension after resolution. Can remain the same or be resolved
 * following the mapping in `src/MixGlob/OutManager/extensionMapping.ts`
 */
export function resolveFileExtension(file: string): string {
  const fileExtension: string = path.extname(file.trim());

  for (let i = 0; i < EXTENSION_FILE_MAPPING.length; i += 1) {
    const mapObj = EXTENSION_FILE_MAPPING[i];
    if (mapObj.resolution.test(fileExtension)) {
      return mapObj.extension;
    }
  }

  return fileExtension;
}

/**
 * The function that resolve the files extension following the mix function mapping if provided.
 * As per `src/MixFunctionSettings/index.ts`
 * Or fall back to the resolve by the standard file extension mapping as a fallback.
 * As per `src/MixGlob/OutManager/extensionMapping.ts`
 * @param {string} srcFile the file to resolve it's extension
 * @param {string} mixFuncName the mix call function name
 * @returns
 */
export function resolveExtension(srcFile: string, mixFuncName = ''): string {
  return (
    MIX_DEFAULT_FUNCTIONS_SETTINGS[mixFuncName as keyof TMixFuncSettings]
      ?.outputMapping.ext || resolveFileExtension(srcFile)
  );
}
