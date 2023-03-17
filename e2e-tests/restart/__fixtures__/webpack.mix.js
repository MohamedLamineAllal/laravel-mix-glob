const mix = require('laravel-mix');
const path = require('path');
const { glb } = require('../../../dist/index');

/**
 * ///////// no globs ////////
 */
mix.js('./src/app.js', './dist/app.js');

/**
 * ////////// args ///////////
 */

mix.js(
  glb.args('./src/services/engine/**/*.js', (src) => {
    let out = path.resolve(
      path.resolve(__dirname, './dist'),
      path.relative(path.resolve(__dirname, './src'), src),
    );
    out = glb.replaceExtension(out, '.js');
    return [src, out];
  }),
);

/**
 * ////////// src out arg ///////////
 */

/**
 * src out
 * ----------
 */

mix.js(
  glb.src('./src/services/*.js'),
  glb.out({
    outMap: './dist',
    baseMap: './src',
  }),
);
