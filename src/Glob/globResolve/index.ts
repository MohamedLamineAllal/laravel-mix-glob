import fglb, { Options } from 'fast-glob';
import { TGlobResolveGlobParam, IGlobObj, TGlobFunc } from './types';

const defaultOptions: Partial<Options> = {
  dot: true,
  followSymbolicLinks: true,
  objectMode: false,
};

export function globResolve(glb: TGlobResolveGlobParam | TGlobFunc): string[] {
  if (Array.isArray(glb) || typeof glb === 'string') {
    return fglb.sync(glb, defaultOptions);
  }

  if (typeof glb === 'object') {
    return fglb.sync(glb.pattern, { ...defaultOptions, ...glb.options });
  }

  if (typeof glb === 'function') {
    return glb(
      (src: IGlobObj['pattern'], options?: IGlobObj['options']) =>
        fglb.sync(src, { ...defaultOptions, ...options }) as string[],
    );
  }

  throw new Error(
    'Wrong glb parameter, possible types are string|array|object ({pattern, options})|function {return <promise> -> resolve paths}',
  );
}
