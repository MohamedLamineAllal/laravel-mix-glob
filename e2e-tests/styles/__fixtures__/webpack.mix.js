const mix = require('laravel-mix');
const path = require('path');
const { glb } = require('../../../dist/index');

/**
 * ///////// no globs ////////
 */
mix.sass('./src/styles/noGlobs/style.scss', './dist/styles/noGlobs/');

/**
 * ////////// args ///////////
 */

/**
 * With specifier
 */
mix.sass(
  glb.args('./src/styles/doneWithArgs/specifier/**/*.c.scss', (src) => {
    let out = path.resolve(
      path.resolve(__dirname, './dist'),
      path.relative(path.resolve(__dirname, './src'), src),
    );
    out = glb.replaceExtension(out, '.css');
    out = glb.removeSpecifier(out, 'c');
    return [src, out];
  }),
);

/**
 * Without specifier
 */
mix.sass(
  glb.args('./src/styles/doneWithArgs/noSpecifier/**/*.scss', (src) => {
    let out = path.resolve(
      path.resolve(__dirname, './dist'),
      path.relative(path.resolve(__dirname, './src'), src),
    );
    out = glb.replaceExtension(out, '.css');
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

/**
 * with specifier
 */
mix.sass(
  glb.src('./src/styles/doneWithSrcOut/specifier/**/*.c.scss'),
  glb.out({
    outMap: './dist',
    baseMap: './src',
    specifier: 'c',
  }),
);

/**
 * without specifier
 */
mix.sass(
  glb.src('./src/styles/doneWithSrcOut/noSpecifier/**/*.scss'),
  glb.out({
    outMap: './dist',
    baseMap: './src',
  }),
);

/**
 *  //////////// arg /////////////////
 */

mix.sass(glb.arg('./src/styles/arg/**/*.scss'), 'dist/styles/arg');
