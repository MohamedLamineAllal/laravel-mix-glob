import type { Options } from 'fast-glob';

export type TGlobPattern = string | string[];

export interface IGlobObj {
  pattern: TGlobPattern;
  options?: Omit<Options, 'objectMode'>;
}

export type TFastGlobSyncFunc = (
  source: string | string[],
  options?: Options,
) => string[];

export type TGlobFunc = (_fglbSync: TFastGlobSyncFunc) => string[];

export type TGlobResolveGlobParam = TGlobPattern | IGlobObj | TGlobFunc;
