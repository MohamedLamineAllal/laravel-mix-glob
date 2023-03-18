import { Api as MixApi } from 'laravel-mix';
import type { EGlobType, Glob } from '@Glob';
import { globResolve } from '@Glob/globResolve';

interface IProcessArgsResult {
  files: string[];
}

export function processArgsGlobCall(
  glob: Glob<EGlobType.args>,
  originalMethod: (...args: any[]) => MixApi,
): IProcessArgsResult {
  if (!glob.options?.map) {
    throw new Error(
      'map option of the Glob<EGlobType.args> object is required to map glob files to args',
    );
  }

  const files = globResolve(glob.value);

  if (files.length === 0) {
    throw new Error('No matched files for the args Glob');
  }

  files.forEach((file) => {
    const args = glob.options!.map(file);
    if (!Array.isArray(args)) {
      throw new Error(
        'glob.options.map() should return an array that represent args.',
      );
    }
    originalMethod(...args);
  });
  return {
    files,
  };
}
