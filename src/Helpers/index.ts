export * from '@Glob/Helpers';

export {
  resolveExtension,
  EXTENSION_FILE_MAPPING,
} from '@MixGlob/OutManager/extensionMapping';

export {
  MIX_DEFAULT_FUNCTIONS_SETTINGS,
  SRC_OUT_FUNCTIONS,
} from '@MixFunctionSettings';

/**
 * Remove specifier from a path file
 * @param srcFile path to remove the specifier from
 * @param specifier
 * @returns resolved path
 */
export function removeSpecifier(srcFile: string, specifier: string): string {
  return srcFile.replace(
    new RegExp(`\\.${specifier}\\.(?!.*${specifier}\\.)`, 'g'),
    '.',
  );
}

/**
 * replace src file extension with another one
 * @param srcFile path to replace extension in
 * @param newExtension extension to replace with
 * @returns resolved file with replaced extension
 */
export function replaceExtension(
  srcFile: string,
  newExtension: string,
): string {
  return srcFile.replace(/\.[^.]+$/, newExtension);
}
