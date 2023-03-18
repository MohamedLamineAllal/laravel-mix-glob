const mix = require('laravel-mix');

/**
 * Loading extensions
 */
require('laravel-mix-swc');
const { glb } = require('../../../dist/index'); // laravel-mix-glob

/**
 * arg
 */

mix.swc(
  glb.arg('./src/swcExtenssionWithArg/arg/**/*.ts'),
  'dist/swcExtenssionWithArg/arg',
  {
    jsc: {
      parser: {
        syntax: 'ecmascript',
        jsx: false,
      },
    },
  },
);

/**
 * srcOut
 */

mix.swc(
  glb.src('./src/swcExtenssionWithArg/srcOut/**/*.ts'),
  glb.out({ baseMap: './src', outMap: './dist' }),
  {
    test: '.*.ts$',
    jsc: {
      parser: {
        syntax: 'typescript',
      },
    },
  },
);
