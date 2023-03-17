import { IGlobObj, TGlobPattern } from '@Glob/globResolve/types';
import { IArgOptions, TGlobValue, TMapArgsCallback } from '@Glob/types';
import { mapSrcFile } from '@MixGlob/OutManager';
import { EGlobType, Glob } from '../Glob';
import { globResolve } from '../globResolve';
import { OutConfig } from '../OutConfig';
import type { TOptions as IOutOptions } from '../OutConfig/types';
import { IMapOutputParams } from './types';

/**
 * A helper to create a src glob that get used to define source files that get iterated.
 * A glob that handle src input.
 * src and out go in pair
 * @param glb the glob string or array of glob strings or globResolve object,
 * or fastGlob.sync function,
 * to match files against them
 * @returns {Glob<EGlobType.src>} Glob object representing source (of type Glob<EGlobType.src>)
 */
export function src(glb: TGlobValue): Glob<EGlobType.src> {
  return new Glob({
    glb,
    type: EGlobType.src,
  });
}

/**
 * A helper to create a out glob that get used to define the output properties
 * for the files of the src glob.
 * Out glob go always in pair with the src glob.
 * @param outOptions {IOutOptions} options to determine the output handling
 * map: string or a function. If string that it will be an output base.
 * If a function then it gonna be a mapper for each file. The mapping function is
 * expected to set for each file it's output file path.
 * @returns {OutConfig} OutConfig instance that get passed in mix functions params.
 * To make the special handling.
 */
export function out(outOptions: IOutOptions): OutConfig {
  return new OutConfig(outOptions);
}

/**
 * A helper similar to src. Except that is not src type. And so not paired with out OutConfig.
 * To be used for any arg that is not source and variation need to be created for each glob match.
 * Meaning: if we use glb.src for one arg. And glb.arg for a second.
 * And that we have 6 matches for each one of the two glob run.
 * Both list of files will be recursively looped. Making an output of 36 variations.
 * example: mix.imaginaryMethodFromImaginaryPlugin(glb.src(...), glb.out(...), glb.arg(...))
 * @param glb the glob string or array of glob strings or
 * globResolve object { pattern, options }, or globResolve function,
 * to match files against them
 * @param options multiMode,
 * @returns {Glob<EGlobType.arg>} Glob object of type arg.
 */
export function arg(
  glb: TGlobValue,
  options: IArgOptions = {},
): Glob<EGlobType.arg> {
  return new Glob({
    glb,
    type: EGlobType.arg,
    options,
  });
}

/**
 * Run one glob match processing, and generate the args all at once using the callback
 * usage: mix.ts(...glb.args('*.ts', (file) => [file, `outDir/${path.baseName(file)}`, {...}]))
 * In multiMode:
 *
 * @param glb
 * @returns
 */
export function args(glb: TGlobValue, argsMapper: TMapArgsCallback): Glob {
  return new Glob({
    glb,
    type: EGlobType.args,
    options: {
      map: argsMapper,
    },
  });
}

/**
 * A helper to match files using a globResolve obj { pattern, options } and return the array
 * of the matched files to be used with mix functions params that take an array of files
 * short: take glb => string[]
 * @param glb a glb string or array of glob strings or globResolve object, or globResolve function,
 * in order to match file against and convert the matched one to an array.
 * A pure helper that is to be used with methods and params that takes an array of files
 * @returns {string[]} the matched files paths as an array
 */
export function array(glb: TGlobValue): string[] {
  return globResolve(glb);
}

/**
 * Alias of glb.array().
 * A helper to match files using a globResolve obj { pattern, options } and return the array
 * of the matched files to be used with mix functions params that take an array of files
 * short: take glb => string[]
 * @param glb a glb string or array of glob strings or globResolve object, or globResolve function,
 * @param glb a glb string or array of glob strings or globResolve object, or globResolve function,
 * @returns {string[]} the matched files paths as an array
 */
export function resolve(glb: TGlobValue): string[] {
  return globResolve(glb);
}

/**
 * Extract glob patterns out of a Glob object
 * @param {Glob} glob Glob object representing a Glob
 * @returns {string[]} glob patterns as a string array
 */
export function getGlobPatterns(glob: Glob): string[] {
  let pattern: TGlobPattern | undefined;

  if (typeof glob.value === 'object' && !Array.isArray(glob.value)) {
    if (!(glob.value as IGlobObj)?.pattern) {
      throw new Error('.pattern prop need to be defined');
    }
    pattern = (glob.value as IGlobObj).pattern;
  }

  if (!pattern) {
    pattern = glob.value as TGlobPattern;
  }

  if (Array.isArray(pattern)) {
    return pattern;
  }
  return [pattern];
}

/**
 * A helper function that allow us to use the `glb.out()` and `OutputManager` resolution algorithm.
 * To remap source to output dir and handling extensions ...
 * Can be used with `glb.args()`, in place of using `path.relative()` with `path.resolve()` and
 * also `glb.replaceExtension()` and `glb.removeSpecifier()`
 *
 * @param {IMapOutputParams} mapParams
 * { src: string, outConfig: OutConfig, mixFuncName: string}
 *
 * src: is the src file
 *
 * outConfig: is the OutConfig configuration that you can create with glb.out()
 * ex:
 * glb.out({
 *   outMap: './dist',
 *   baseMap: './src',
 *   specifier: 'c',
 *   extensionMap: '.js'
 * })
 *
 * @returns {string} src mapping output that represent the output file path.
 */
export function mapOutput({
  src: srcFile,
  outConfig,
  mixFuncName = '',
}: IMapOutputParams): string {
  return mapSrcFile(srcFile, mixFuncName, outConfig);
}
