import mix from 'laravel-mix';
import { MixGlob } from '@MixGlob';
import { MixGlobPlugin } from '@MixGlobPlugin';

mix.extend('MixGlob', MixGlobPlugin as any);

export * as glb from '@Helpers';
export { MixGlob };
