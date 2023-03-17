const mix = require('laravel-mix');
const path = require('path');
const { glb } = require('../../../dist/index');

/**
 * ///////// no globs ////////
 */
mix.ts('./src/noGlobs/some.ts', './dist/noGlobs/some.js');

/**
 * ////////// args ///////////
 */

/**
 * With specifier
 */
{
  const argsMapper = (src) => {
    let out = path.resolve(
      path.resolve(__dirname, './dist'),
      path.relative(path.resolve(__dirname, './src'), src),
    );
    out = glb.replaceExtension(out, '.js');
    out = glb.removeSpecifier(out, 'c');
    return [src, out];
  };

  // relative path
  mix.ts(
    glb.args('./src/relative/doneWithArgs/specifier/**/*.c.ts', argsMapper),
  );

  // absolute path
  mix.ts(
    glb.args(
      path.resolve(
        __dirname,
        './src/absolute/doneWithArgs/specifier/**/*.c.ts',
      ),
      argsMapper,
    ),
  );
}

/**
 * Without specifier
 */
{
  const argsMapper = (src) => {
    let out = path.resolve(
      path.resolve(__dirname, './dist'),
      path.relative(path.resolve(__dirname, './src'), src),
    );
    out = glb.replaceExtension(out, '.js');
    return [src, out];
  };

  // relative path
  mix.ts(
    glb.args('./src/relative/doneWithArgs/noSpecifier/**/*.ts', argsMapper),
  );

  // absolute path
  mix.ts(
    glb.args(
      path.resolve(
        __dirname,
        './src/absolute/doneWithArgs/noSpecifier/**/*.ts',
      ),
      argsMapper,
    ),
  );
}

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
{
  const glbOut = glb.out({
    outMap: './dist',
    baseMap: './src',
    specifier: 'c',
  });

  // relative path
  mix.ts(glb.src('./src/relative/doneWithSrcOut/specifier/**/*.c.ts'), glbOut);

  // absolute path
  mix.ts(
    glb.src(
      path.resolve(
        __dirname,
        './src/absolute/doneWithSrcOut/specifier/**/*.c.ts',
      ),
    ),
    glbOut,
  );
}

/**
 * without specifier
 */
{
  const glbOut = glb.out({
    outMap: './dist',
    baseMap: './src',
  });

  // relative path
  mix.ts(glb.src('./src/relative/doneWithSrcOut/noSpecifier/**/*.ts'), glbOut);

  // absolute path
  mix.ts(
    glb.src(
      path.resolve(
        __dirname,
        './src/absolute/doneWithSrcOut/noSpecifier/**/*.ts',
      ),
    ),
    glbOut,
  );
}

/**
 * ////////// react (No args call) ////////////////
 */

// with specifier
mix
  .ts(
    glb.src('./src/reactNoArgs/specifier/**/*.c.tsx'),
    glb.out({
      outMap: './dist',
      baseMap: './src',
      specifier: 'c',
    }),
  )
  .react();

// without specifier
mix
  .ts(
    glb.src('./src/reactNoArgs/noSpecifier/**/*.tsx'),
    glb.out({
      outMap: './dist',
      baseMap: './src',
    }),
  )
  .react();
// NOTE: in PURPOSE i didn't add a .react().
// NOTE: Because that's something that you would do only one time.
// NOTE: Multiple times would just override the old call options.
// NOTE: Any such kind type of element would just add a general not file specific entry
// NOTE: to webpackConfig.

/**
 *  //////////// arg /////////////////
 */

mix.ts(glb.arg('./src/arg/**/*.ts'), 'dist/arg');
