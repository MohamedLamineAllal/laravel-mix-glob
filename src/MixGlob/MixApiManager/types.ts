import { Glob } from '@Glob';
import { OutConfig } from '@Glob/OutConfig';
import type { Api as MixApi } from 'laravel-mix';
import { EGlobType } from '@Glob/Glob';
import type { MixGlob } from '..';

export interface IOptions {
  mixGlob: MixGlob;
}

export type TExtendedApi = TMappedExtendedApi & IExtraMethods;

interface IExtraMethods {
  mixGlobSettings: (settings: any) => MixApi;
}

export type TMappedExtendedApi = {
  [prop in keyof MixApi]:
    | (MixApi[prop] extends (...args: infer Args) => ReturnType<MixApi[prop]>
        ? Args[0] extends string | string[]
          ? Args extends [infer Arg0, ...infer RestArgs]
            ? (
                src: Arg0 | Glob,
                ...args: TMapMixApiFuncsArgs<RestArgs>
              ) => ReturnType<MixApi[prop]>
            : MixApi[prop]
          : (
              ...args: [...TMapMixApiFuncsArgs<Args>]
            ) => ReturnType<MixApi[prop]>
        : MixApi[prop])
    | ((argsGlob: Glob<EGlobType.args>) => MixApi);
};

type TMapMixApiFuncsArgs<T extends [...any[]]> = {
  [index in keyof T]: T[index] extends string | string[]
    ? Glob | T[index] | OutConfig
    : Glob | T[index];
};
