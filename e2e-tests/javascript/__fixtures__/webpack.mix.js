const mix = require('laravel-mix');
const path = require('path');
const { glb } = require('../../../dist/index');

/**
 * ///////// no globs ////////
 */
mix.js('./src/noGlobs/some.js', './dist/noGlobs/some.js');

/**
 * ////////// args ///////////
 */

/**
 * ::: using glb.replaceExtension() and glb.removeSpecifier() and path.resolve(), path.relative()
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
  mix.js(
    glb.args('./src/relative/doneWithArgs/specifier/**/*.c.js', argsMapper),
  );

  // absolute path
  mix.js(
    glb.args(
      path.resolve(
        __dirname,
        './src/absolute/doneWithArgs/specifier/**/*.c.js',
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
  mix.js(
    glb.args('./src/relative/doneWithArgs/noSpecifier/**/*.js', argsMapper),
  );

  // absolute path
  mix.js(
    glb.args(
      path.resolve(
        __dirname,
        './src/absolute/doneWithArgs/noSpecifier/**/*.js',
      ),
      argsMapper,
    ),
  );
}
/**
 * ::: using glb.mapOutput()
 */

/**
 * With specifier
 */
mix.js(
  glb.args(
    './src/relative/doneWithArgsAndGlbMapOutput/specifier/**/*.c.js',
    (src) => {
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
    },
  ),
);

/**
 * without specifier
 */
mix.js(
  glb.args(
    './src/relative/doneWithArgsAndGlbMapOutput/noSpecifier/**/*.js',
    (src) => {
      const out = glb.mapOutput({
        src,
        outConfig: glb.out({
          baseMap: './src',
          outMap: './dist',
          extensionMap: '.js',
        }),
      });
      return [src, out];
    },
  ),
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
{
  const glbOut = glb.out({
    outMap: './dist',
    baseMap: './src',
    specifier: 'c',
  });

  // relative path
  mix.js(glb.src('./src/relative/doneWithSrcOut/specifier/**/*.c.js'), glbOut);

  // absolute path
  mix.js(
    glb.src(
      path.resolve(
        __dirname,
        './src/absolute/doneWithSrcOut/specifier/**/*.c.js',
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
  mix.js(glb.src('./src/relative/doneWithSrcOut/noSpecifier/**/*.js'), glbOut);

  // absolute path
  mix.js(
    glb.src(
      path.resolve(
        __dirname,
        './src/absolute/doneWithSrcOut/noSpecifier/**/*.js',
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
  .js(
    glb.src('./src/reactNoArgs/specifier/**/*.c.jsx'),
    glb.out({
      outMap: './dist',
      baseMap: './src',
      specifier: 'c',
    }),
  )
  .react();

// without specifier
mix.js(
  glb.src('./src/reactNoArgs/noSpecifier/**/*.jsx'),
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

mix.js(glb.arg('./src/arg/**/*.js'), 'dist/arg');
