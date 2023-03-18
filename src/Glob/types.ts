import type { EGlobType } from './Glob';
import { IGlobObj, TGlobPattern } from './globResolve/types';

export type TGlobValue = TGlobPattern | IGlobObj;

/**
 * Glob constructor options type
 */
export type IOptions<T extends EGlobType = EGlobType> = {
  glb: TGlobValue;
  type: T;
  options?: TGlobOptions<T>;
} & TOptionalOptions<T>;

/**
 * Conditionally handling if options must be provided or is optional
 */
type TOptionalOptions<T extends EGlobType> = T extends
  | EGlobType.arg
  | EGlobType.args
  ? {
      options: TGlobOptions<T>;
    }
  : {
      options?: undefined;
    };

/**
 * Type of options property of a Glob instance.
 * That is conditionally mapped in regard to what EGlobType it is.
 */
export type TGlobOptions<T extends EGlobType = EGlobType> =
  T extends EGlobType.arg
    ? IArgOptions
    : T extends EGlobType.args
    ? IArgsOptions
    : undefined;

/**
 * Arg options object type
 */
export interface IArgOptions {
  mapMode?: boolean;
  map?: TFileMapCallback;
}

export type TMapArgsCallback = (file: string) => any[];

export interface IArgsOptions {
  map: TMapArgsCallback;
}

export type TFileMapCallback<TOut = any> = (
  file: string,
  mixFuncName: string,
) => TOut;
