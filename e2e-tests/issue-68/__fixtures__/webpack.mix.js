const mix = require('laravel-mix');
const path = require('path');
const { glb } = require('../../../dist/index');

/**
 * //////////////////////////////////////////////////////////////////
 * Testing empty
 * //////////////////////////////////////////////////////////////////
 */

/**
 * ////////// args ///////////
 */

/**
 * ::: using glb.replaceExtension() and glb.removeSpecifier() and path.resolve(), path.relative()
 */

/**
 * With specifier
 */
// relative path
mix.js(
  glb.args('./src/empty/**/*.c.js', (src) => {
    let out = path.resolve(
      path.resolve(__dirname, './dist'),
      path.relative(path.resolve(__dirname, './src'), src),
    );
    out = glb.replaceExtension(out, '.js');
    out = glb.removeSpecifier(out, 'c');
    return [src, out];
  }),
);
/**
 * Without specifier
 */
mix.js(
  glb.args('./src/empty/**/*.js', (src) => {
    let out = path.resolve(
      path.resolve(__dirname, './dist'),
      path.relative(path.resolve(__dirname, './src'), src),
    );
    out = glb.replaceExtension(out, '.js');
    return [src, out];
  }),
);

/**
 * ::: using glb.mapOutput()
 */

/**
 * With specifier
 */
mix.js(
  glb.args('./src/empty/**/*.c.js', (src) => {
    const out = glb.mapOutput({
      src,
      outConfig: glb.out({
        baseMap: './src',
        outMap: './dist',
        extensionMap: '.js',
        specifier: 'c',
      }),
    });
    return [src, out];
  }),
);

/**
 * without specifier
 */
mix.js(
  glb.args('./src/empty/**/*.js', (src) => {
    const out = glb.mapOutput({
      src,
      outConfig: glb.out({
        baseMap: './src',
        outMap: './dist',
        extensionMap: '.js',
      }),
    });
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
mix.js(
  glb.src('./src/empty/**/*.c.js'),
  glb.out({
    outMap: './dist',
    baseMap: './src',
    specifier: 'c',
  }),
);

/**
 * without specifier
 */
mix.js(
  glb.src('./src/empty/**/*.js'),
  glb.out({
    outMap: './dist',
    baseMap: './src',
  }),
);

/**
 * ////////// react (No args call) ////////////////
 */

// with specifier
mix
  .js(
    glb.src('./src/empty/**/*.c.jsx'),
    glb.out({
      outMap: './dist',
      baseMap: './src',
      specifier: 'c',
    }),
  )
  .react();

// without specifier
mix.js(
  glb.src('./src/empty/**/*.jsx'),
  glb.out({
    outMap: './dist',
    baseMap: './src',
  }),
);
// NOTE: in PURPOSE i didn't add a .react().
// NOTE: Because that's something that you would do only one time.
// NOTE: Multiple times would just override the old call options.
// NOTE: Any such kind type of element would just add a general not file specific entry
// NOTE: to webpackConfig.

/**
 *  //////////// arg /////////////////
 */

mix.js(glb.arg('./src/empty/**/*.js'), 'dist/empty');

/**
 * //////////////////////////////////////////////////////////////////
 * Another task (not empty folder)
 * //////////////////////////////////////////////////////////////////
 */
mix.js(
  glb.src('./src/anotherTask/**/*.c.js'),
  glb.out({
    outMap: './dist',
    baseMap: './src',
    specifier: 'c',
  }),
);
