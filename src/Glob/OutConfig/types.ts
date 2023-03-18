import { TFileMapCallback } from '@Glob/types';

export type TOutMap<TOut = any> = string | TFileMapCallback<TOut>;

export interface IFileNoBaseMappingOptions {
  outMap: TOutMap<string>;
  specifier?: TOutMap<string>;
  extensionMap?: TOutMap<string>;
}

export interface IBaseMappingOptions extends IFileNoBaseMappingOptions {
  baseMap: TOutMap<string>;
}

export type TOptions = IFileNoBaseMappingOptions | IBaseMappingOptions;
