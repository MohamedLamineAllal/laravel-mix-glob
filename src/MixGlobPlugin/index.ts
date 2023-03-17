import mix from 'laravel-mix';
import { Component } from 'laravel-mix/src/components/Component';
import { MixGlob } from '@MixGlob';

export const mixGlob = new MixGlob({ mix });

export class MixGlobPlugin extends Component {
  public mix() {
    return mixGlob.mixApiManager.getExtendedApi() as any;
  }
}
