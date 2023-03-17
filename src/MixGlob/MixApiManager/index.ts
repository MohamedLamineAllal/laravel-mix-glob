import { Api as OriginalMixApi } from 'laravel-mix';
import type { MixGlob } from '..';
import { IOptions, TExtendedApi, TMappedExtendedApi } from './types';

export class MixApiManager {
  private _mixGlob: MixGlob;

  private _extendedApi?: TExtendedApi;

  constructor(options: IOptions) {
    this._mixGlob = options.mixGlob;
  }

  /**
   * A method that construct the extended api and return it
   * The extended api. Support and keep the same api.
   * With extra support to the Glob and OutConfig objects. That allow the glob processing.
   * If those objects are not passed then it will works just if MixGlob extension isn't applied
   * @returns TExtendedApi
   */
  getExtendedApi(): TExtendedApi {
    if (this._extendedApi) {
      return this._extendedApi;
    }
    const extendedApi = {} as TExtendedApi;

    const extend = <TPropKey extends keyof OriginalMixApi>(
      propKey: TPropKey,
    ) => {
      if (typeof this._mixGlob.mix[propKey] === 'function') {
        extendedApi[propKey] = <any>((
          ...args: Parameters<TMappedExtendedApi[TPropKey]>
        ) => {
          this._mixGlob.processCall(propKey, args);
          return this._mixGlob.mix;
        });
      } else {
        extendedApi[propKey] = this._mixGlob.mix[propKey] as any;
      }
    };

    // extending no prototype properties and functions
    Object.getOwnPropertyNames(this._mixGlob.mix).forEach((propKey) => {
      extend(propKey as keyof OriginalMixApi);
    });

    // extending prototype properties and functions
    Object.getOwnPropertyNames(
      Object.getPrototypeOf(this._mixGlob.mix),
    ).forEach((propKey) => {
      extend(propKey as keyof OriginalMixApi);
    });

    // adding the settings method
    extendedApi.mixGlobSettings = () => this._mixGlob.mix;

    this._extendedApi = extendedApi;

    return extendedApi;
  }
}
