import { IGlobObj } from './globResolve/types';
import { IOptions, TGlobOptions, TGlobValue } from './types';

export enum EGlobType {
  src = 1,
  array = 2,
  arg = 3,
  args = 4,
}

export class Glob<T extends EGlobType = EGlobType> {
  public value: TGlobValue;

  public options: TGlobOptions<T> | undefined;

  public type: T;

  constructor(options: IOptions<T>) {
    this.value = options.glb;
    this.type = options.type;
    this.options = options.options;
  }

  public isGlobValueAnObject(this: Glob): this is Glob & { value: IGlobObj } {
    return typeof this.value === 'object' && !Array.isArray(this.value);
  }
}
