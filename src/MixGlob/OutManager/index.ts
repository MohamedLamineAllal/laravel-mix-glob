import path from 'path';
import { OutConfig } from '@Glob';
import { removeSpecifier, replaceExtension } from '@Helpers';
import { resolveExtension } from './extensionMapping';

/**
 * The function map file to file directly, or using the base system
 * if base provided then out is expected to be a directory. And the base system is used.
 * And the specifier if provided would be used.
 *
 * If you want to map file to file directly. Then provide only the outFile option.
 * Make sure you map to a valid file path.
 *
 * If out directory is provided and no base.
 * Then the src files are mapped toward the out directory directly.
 * And the specifier is used too as well.
 *
 * @param srcFile source file
 * @param outConfig OutMapping configuration
 * @returns mapped file
 */
export function mapSrcFile(
  srcFile: string,
  mixFuncName: string,
  outConfig: OutConfig,
): string {
  let out: string;
  if (typeof outConfig.outMap === 'function') {
    out = outConfig.outMap(srcFile, mixFuncName);
  } else {
    out = outConfig.outMap;
  }

  let base: string | undefined;
  if (typeof outConfig.baseMap === 'function') {
    base = outConfig.baseMap(srcFile, mixFuncName);
  } else {
    base = outConfig.baseMap;
  }

  let specifier: string | undefined;
  if (typeof outConfig.specifier === 'function') {
    specifier = outConfig.specifier(srcFile, mixFuncName);
  } else {
    specifier = outConfig.specifier;
  }

  let extension: string | undefined;
  if (typeof outConfig.extensionMap === 'function') {
    extension = outConfig.extensionMap(srcFile, mixFuncName);
  } else {
    extension =
      outConfig.extensionMap || resolveExtension(srcFile, mixFuncName);
  }

  /**
   * base and out directories
   */
  if (base) {
    let srcPathRelativeToBase = path.relative(base, srcFile);

    if (srcPathRelativeToBase.substring(0, 2) === '..') {
      throw new Error(
        'base is not a base for the file src!\n' +
          `  base: ${base}\n` +
          `  srcFile: ${srcFile}\n` +
          'Make sure the base is valid for the file.\n' +
          "You can use map function for base to map it according to the file types that you expect! Otherwise see what's wrong\n",
      );
    }

    // Clean specifier
    if (specifier) {
      srcPathRelativeToBase = removeSpecifier(srcPathRelativeToBase, specifier);
    }

    // replace extension
    if (extension) {
      srcPathRelativeToBase = replaceExtension(
        srcPathRelativeToBase,
        extension,
      );
    }

    // Map directly to output
    return path.join(out, srcPathRelativeToBase);
  }

  /**
   * No base
   */

  /**
   * out is a directory
   */
  if (!base && typeof outConfig.outMap === 'string') {
    let srcFileBaseName = path.basename(srcFile);
    // Clean specifier
    if (specifier) {
      srcFileBaseName = removeSpecifier(srcFileBaseName, specifier);
    }
    // replace extension
    if (extension) {
      srcFileBaseName = replaceExtension(srcFileBaseName, extension);
    }

    return path.join(out, srcFileBaseName);
  }

  return out;
}
