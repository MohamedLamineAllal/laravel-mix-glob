## What's new in v2

- Full re-write using typescript and modularity (cleaner code).
- A whole new more natural and flexible design that bring `less coupling` and an `it would works with all scenario and new things`. Robust against change or working with other extensions.
- Less confusing system.
- Restart and watching system re-done and improved for better efficiency.
- Better support for restart with fast-glob `object` format. A remapping  to chokidar was implemented.
- Interrupt system improved and fixes.
- Better logging.
- Automated tests: units and end to end.
- Simplified documentation.

Remember to star ⭐✨✨✨ after you give it a try. (=> [let me star ✨✨✨](https://github.com/MohamedLamineAllal/laravel-mix-glob))

## Install

```
npm i laravel-mix-glob --save-dev
```

or

```
npm i laravel-mix-glob@latest --save-dev
```
to update to v2 if you are already on v1.

## Starting example

Javascript and fundamentals

```js
const mix = require('laravel-mix');
const { glb } = require('laravel-mix-glob'); // Make it always the last extension
const path = require('path');

/**
 * ///////// no globs ////////
 */
mix.js('./src/noGlobs/some.js', './dist/noGlobs/some.js');

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
  glb.src('./src/relative/doneWithSrcOut/specifier/**/*.js'), 
  glb.out({
    baseMap: './src',
    outMap: './dist',
    specifier: 'c',
  })
);

/**
 * without specifier
 */
{
  // you can have one config and re-use it
  const glbOut = glb.out({
    baseMap: './src',
    outMap: './dist',
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
 * ////////// react ////////////////
 */

mix
  .js(
    glb.src('./src/reactNoArgs/specifier/**/*.jsx'),
    glb.out({
      baseMap: './src',
      outMap: './dist',
      specifier: 'c',
    }),
  )
  .react();

/**
 *  //////////// arg helper /////////////////
 */

mix.js(glb.arg('./src/arg/**/*.js'), 'dist/arg');


/**
 * ////////// args helper ///////////
 * Dynamically return all args
 * Helpful for conditionally picking up arguments
 */

/**
 * With specifier
 */

mix.js(
  glb.args('./src/relative/doneWithArgs/specifier/**/*.c.js', (src) => {
    let out = path.resolve(
      path.resolve(__dirname, './dist'),
      path.relative(path.resolve(__dirname, './src'), src),
    );
    out = glb.replaceExtension(out, '.js'); // <<<<==== helpers
    out = glb.removeSpecifier(out, 'c'); // <<<<====
    
    return [src, out]; // <<<====== returning args
  })
);


/**
 * Without specifier
 */
mix.js(
  glb.args('./src/relative/doneWithArgs/noSpecifier/**/*.js', (src) => {
    let out = path.resolve(
      path.resolve(__dirname, './dist'),
      path.relative(path.resolve(__dirname, './src'), src),
    );
    out = glb.replaceExtension(out, '.js');
    return [src, out];
  })
);

/**
 * Args with glb.mapOutput()
 */

/**
 * With specifier
 */
mix.js(
  glb.args(
    './src/relative/doneWithArgsAndGlbMapOutput/specifier/**/*.c.js',
    (src) => {
      /**
       * Can conditionally set the args and with the helpers that resolve things for u
       */
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
      /**
       * Can conditionally set the args
       */
      const out = (outMap) => {
        glb.mapOutput({
          src,
          outConfig: glb.out({
            baseMap: './src',
            outMap,
            extensionMap: '.js',
          }),
        });
      };

      if (src.includes('special')) {
        return [src, out('./specialDist')];
      }
      return [src, out('./defaultDist')];
    },
  ),
);
```

Typescript

```js
mix.ts(
  glb.src('./src/relative/doneWithSrcOut/specifier/**/*.c.ts'),
  glb.out({
    baseMap: './src',
    outMap: './dist',
    specifier: 'c',
  })
);

/**
 * ////////// react tsx ////////////////
 */
mix
  .ts(
    glb.src('./src/reactNoArgs/specifier/**/*.c.tsx'),
    glb.out({
      baseMap: './src',
      outMap: './dist',
      specifier: 'c',
    }),
  )
  .react();
```

The above can be reduced to:

```js
mix
  .ts(
    glb.src([
      './src/relative/doneWithSrcOut/specifier/**/*.c.ts',
      './src/reactNoArgs/specifier/**/*.c.tsx', // string[] multiple globs patterns 
    ]),
    glb.out({
      baseMap: './src',
      outMap: './dist',
      specifier: 'c',
    }),
  )
  .react();
```

Styling

```js
// no globs
mix.sass('./src/styles/noGlobs/style.scss', './dist/styles/noGlobs/')
// with src out
    .sass(
        glb.src('./src/styles/doneWithSrcOut/specifier/**/*.c.scss'),
        glb.out({
          baseMap: './src',   
          outMap: './dist',
          specifier: 'c',
        }),
    );

// with args
mix.sass(
  glb.args('./src/styles/doneWithArgs/specifier/**/*.c.scss', (src) => {
    let out = path.resolve(
      path.resolve(__dirname, './dist'),
      path.relative(path.resolve(__dirname, './src'), src),
    );
    // You can make conditional arguments selection ...
    out = glb.replaceExtension(out, '.css');
    out = glb.removeSpecifier(out, 'c');
    return [src, out];
  }),
);

// or equiv with glb.mapOutput()
mix.sass(
  glb.args('./src/styles/doneWithArgs/specifier/**/*.c.scss', (src) => {
    const out = glb.mapOutput({
      src,
      outConfig: glb.out({
        baseMap: './src',
        outMap: './dist',
        extensionMap: '.css',
        specifier: 'c'
      }),
    });
    return [src, out];
  }),
);
```

In place of the bellow with repetition and no dynamic

```js
mix.postCss('src/file.css', 'dist/file.css', [
    require('precss')() // your PostCss plugins
]);
mix.postCss('src/file2.css', 'dist/file2.css', [
    require('precss')() // your PostCss plugins
]);
```

you do:

```js
mix.postCss(
  glb.src('./src/styles/**/*.c.css'),
  glb.out({
    baseMap: './src',
    outMap: './dist',
    specifier: 'c',
  }),
  [
    require('precss')() // your PostCss plugins
  ]
);
```

The argument that is no `glob` type and no `glb.out` type. Would remain the same and through all the possibilities.


And you got the idea. You use globs through such helpers. By using the same old api. And same way of chaining.

> Note: The example above are a quick get started. And to show the fundamental. There is more helpers like `glb.array()`. And more details about each of the helpers and how things works on what to follow. Like for instance the notion of cartesian product. The whole redesign was made to make the system more natural. More flexible. And more elegant.

## How it works

Same functions as before and you use the glob helpers.

You have different helpers. And you go the same as without globs. But now with the new version of the extension, you use the helpers for the arguments to create Glob objects. The extension will automatically detect and handle the calls accordingly. Processing the globs and the cartesian products (The product of the different possibilities in case of more then just one glob argument).

This new design will allow natural flexibility to basically use the glob equivalent to anything u used to do manually before. And with all ease. And that allow the extension to be more independent of laravel-mix updates.

### Glob and out types and normal types

The `glob` type arguments and the `glb.out` type will be treated with resolution. And the normal argument will be treated as is in every possibility after resolution.

In the example bellow:

```js
mix.postCss('src/file.css', 'dist/file.css', [
    require('precss')() // your PostCss plugins
]);
mix.postCss('src/file2.css', 'dist/file2.css', [
    require('precss')() // your PostCss plugins
]);
```

With globs as already shown in section above, we will do:

```js
mix.postCss(
  glb.src('./src/styles/**/*.c.css'), // <<<-- glob type argument (here a src type that works with out type)
  glb.out({  // <<<-- out type argument
    baseMap: './src',
    outMap: './dist',
    specifier: 'c',
  }),
  [  // <<<<< ---- normal argument type
    require('precss')() // your PostCss plugins
  ]
);
```

after the glob is resolved. Let's say:

```js
`./src/styles/file1.c.css`
`./src/styles/file2.c.css`
`./src/styles/another/file1.c.css`
```

We have 3 cases here:

for every one of the file the out is resolved:

making:

```js
[`./src/styles/file1.c.css`, `./dist/styles/file1.css`]
[`./src/styles/file2.c.css`, `./dist/styles/file2.css`]
[`./src/styles/another/file1.c.css`, `./dist/styles/another/file1.css`]
```

And the 3d argument is a normal one. No more resolution. The call will go with the following arguments:

```js
// calls mix.postCss(...args)

// call 1
[
  `./src/styles/file1.c.css`, // glob
  `./dist/styles/file1.css`, // out resolution
  [require('precss')()] // no resolution (pass it as is) through all cases
]

// call 2
[
  `./src/styles/file2.c.css`,
  `./dist/styles/file2.css`,
  [require('precss')()]
]

// call 3
[
  `./src/styles/another/file1.c.css`,
  `./dist/styles/another/file1.css`,
  [require('precss')()]
]
```

### Cartesian product

Let's take the imaginary function with multiple globs args

```js
mix.magic(
  glb.src('./src/some/**/*.js'),
  glb.out({ outMap: './dist', baseMap: './src' }),
  glb.arg('./src/family/**/*.fm')
);
```

There is no such use case in laravel-mix yet (all functions generally use one file). Unless some extension do it. And in case you use other extensions. Make sure to import `laravel-mix-glob` the last.

Now the way the above would work. Is that we will have the two spaces `arg0` and `arg2` short for `glb.src('./src/some/**/*.js')` and `glb.arg('./src/family/**/*.fm')`.

`arg0` the space of all matched elements by the first glob<br>
`arg2` same thing with the second glob

`arg0 X arg2` = `{ (x,y) where x in arg0 and y in arg2 }` the space of all combinations couples.

if for example:

arg0 =
```js
./src/some/main.js
./src/some/another.js
```

arg2 =
```js
./src/family/dark.fm
./src/family/light.fm
./src/family/stigma.fm
```

The cartesian product would be a set of `2 * 3` = `6` elements (set of all compositions).

And in the example above the glob call above would be the equiv of:

```js
mix.magic('./src/some/main.js', `./dist/some/main.js`, './src/family/dark.fm')
.magic('./src/some/main.js', `./dist/some/main.js`, './src/family/light.fm')
.magic('./src/some/main.js', `./dist/some/main.js`, './src/family/stigma.fm')
.magic('./src/some/another.js', `./dist/some/another.js`, './src/family/dark.fm')
.magic('./src/some/another.js', `./dist/some/another.js`, './src/family/light.fm')
.magic('./src/some/another.js', `./dist/some/another.js`, './src/family/stigma.fm')
```

You got the idea. Natural composition.

The relation between `src` and `out` is resolved naturally as well. For each cartesian product element. A one to one mapping with `src` value is done. As `src` anb `out` go together and the value is deduced following the config and resolution.

You can check the details in the specific section about `src and out` in the documentation bellow.

### glb.src() & glb.out() & glb.arg()

They can be used together.

`src` is for running a glob for the source type argument.

`out` is to set the output config for the output type argument and it go in pair with `src` and its required. Unless you set it as string to an out dir (no base resolution). 

The `OutManager`handle base resolution (mapping files in `src` directory to `dist` directory with the same structure). And also extensions mapping. As well as the specifier removing (if used). 

in place of 

```js
mix
  .ts('./src/reactNoArgs/specifier/some.c.tsx', './dist/reactNoArgs/specifier/some.js')
  //             ^^^^_ src arg                                 ^^^^_ out arg
  .ts('./src/reactNoArgs/specifier/another/some2.c.tsx', './dist/reactNoArgs/specifier/another/some2.js')
  .react();
```

With globs

```js
mix
  .ts(
    glb.src('./src/reactNoArgs/specifier/**/*.c.tsx'), // <=== source argument
    glb.out({ // <=== out argument
      outMap: './dist',
      baseMap: './src',
      specifier: 'c',
    }),
  )
  .react();
```

`arg` is for any other argument that you want to run a glob against it. And so if you use more then one glob. The resolution will happen through the **cartesian product**. Meaning simply running all possibilities of the two/or more matched sets by the globs products (as explained in the precedent section).

In case of just two. The globs are run for each one of `src` and `arg`. and then the product of the two sets is iterated (cartesian product).

And `out` doesn't use `glob`. But rather match the different combination. And is used to map each matching product. To a given output. For the output argument.

#### glb.out() and OutManager

Internally when you pass the `glb.out()` param. The `OutManager` would take the config. And handle the output accordingly.

For options we have:

`outMap` (required)
`baseMap` (optional)
`extensionMap` (optional)
`specifier` (optional)

All of the options can be either

`string`

or a function of the following signature:

```ts
type TMapFunc = (
  file: string,
  mixFuncName: string,
) => string
```

That allow a file to file mapping (files matched by the `glb.src()` glob). Again `glb.out()` and `glb.src()` go in pair.

You would like to use the function version if you want to do some conditional setting.

**The `baseMap`**  

Allow you to set the `src` base. So it would map against the outMap `dist` directory keeping the same structure.  

If baseMap is not set. All files will be mapped in a flat manner to the same `dist` directory (`dist` for example only).

Example:

```js
mix
  .ts(
    glb.src('./src/reactNoArgs/specifier/**/*.c.tsx'),
    glb.out({
      baseMap: './src',
      outMap: './dist',
      specifier: 'c',
    }),
  )
  .react();
```

All files will be mapped keeping the same structure as in `src` to `dist`.

```js
mix
  .ts(
    glb.src('./src/reactNoArgs/specifier/**/*.c.tsx'),
    glb.out({
      // baseMap: './src',
      outMap: './dist',
      specifier: 'c',
    }),
  )
  .react();
```

All files will be mapped to the same `dist` directory in a flat manner.


**The `specifier`**

The `specifier` is a feature that help you differentiate files from others. So you can set a specifier in the example above it's `c`. In order to glob match only the files that have the `c` specifier (which can stand for compile). And if you specify the specifier option. The `OutManager` will automatically remove it on the output. `src/some.c.js` => `dist/some.js`.

And so you can have a structure like this:

```js
toCompile1.c.js // import both core.js and another.js
core.js
another.js
folder/toCompile2.c.js // import both util.js and manager.js
folder/util.js
folder/manager.js
```

with using the specifier. You would only compile and bundle `toCompile1.c.js` and `folder/toCompile2.c.js` with all of there imports (webpack bundling). But without the modules that doesn't need to.

Here an illustration in laravel:

![resources](https://github.com/MohamedLamineAllal/laravel-mix-glob/raw/master/imgs/specifier_resources.png)


And the output will be

![output](https://github.com/MohamedLamineAllal/laravel-mix-glob/raw/master/imgs/specifier_output.png)

![output](https://github.com/MohamedLamineAllal/laravel-mix-glob/raw/master/imgs/specifier_output_compilation.png)


**The `extensionMap`**

**If provided as** `string` => that would be the used value.

> However it have to be compatible with webpack support for the specific `mix function`.

Example:

If you go with:

```js
mix.ts('src/index.ts', 'dist/index.ts')
```

The output would be:

```js
`dist/index.ts.js`
```
and not ❌

```js
`dist/index.ts` // ❌
```

**By default if not provided**. The default extension mapping will be used. Which is implemented part of the `OutManager`. And the `OutManager` will automatically resolve the extension correctly.

You can check the defaults and contribute to them on (just in case):

- `src/MixFunctionSettings/index.ts` function based mapping.
- `src/MixGlob/OutManager/extensionMapping.ts` standard file extension mapping.

> For contribution open [PR's](https://github.com/MohamedLamineAllal/laravel-mix-glob/pulls) or [issues](https://github.com/MohamedLamineAllal/laravel-mix-glob/issues) at [laravel-mix-glob repo](https://github.com/MohamedLamineAllal/laravel-mix-glob)

**To extend you have to use the function signature of** `extensionMap` to build a custom extended function.

Check the `glb.resolveExtension()` helper section bellow to see how to extend and build custom extended extension mapper based on the default implemented mapping and resolution. Just in case you fall in that scenario.

> All typical mix functions are supported. But with the different `mix extensions` new things can be introduced. And you have that flexibility check the section about extending and custom. As well remember you can simply just set the value directly as `string`.

Mainly you wouldn't need to use this option:

```js
// no globs
mix.sass('./src/styles/noGlobs/style.scss', './dist/styles/noGlobs/')
// with src out
    .sass(
        glb.src('./src/styles/doneWithSrcOut/specifier/**/*.c.scss'),
        glb.out({
          baseMap: './src',   
          outMap: './dist',
          specifier: 'c',
        }), // Just rely on the default resolution
    );      // ✅ use it when you fall in a scenario that required you. Or to be verbose.
            // Or when webpack support multiple output extensions.
```

> Just rely on the default resolution  
> ✅ use it when you fall in a scenario that required you. Or to be verbose.  
> Or when webpack support multiple output extensions.


### glb.args() helper

Allow you to run a glob and generate for each match the full list of args. It's the most flexible way. That allow conditional mapping.

Note you have the following helpers to use with it:

#### glb.removeSpecifier() & glb.replaceExtension()

`glb.removeSpecifier()` is used to remove the specifier more easily.
And `glb.replaceExtension()` is used to replace the extension more easily as well.

```js
  out = glb.replaceExtension(out, '.js'); // <<<<==== replace the extension easily
  out = glb.removeSpecifier(out, 'c'); // <<<<==== remove the specifier if you want easily. Here it's `c`
```

Full example with `args`:

```js
mix.js(
  glb.args('./src/relative/doneWithArgs/specifier/**/*.c.js', (src) => {
    let out = path.resolve(
      path.resolve(__dirname, './dist'),
      path.relative(path.resolve(__dirname, './src'), src),
    ); // <<<<===== base relative resolution 
    out = glb.replaceExtension(out, '.js'); // <<<<==== helpers
    out = glb.removeSpecifier(out, 'c'); // <<<<====
    
    return [src, out]; // <<<====== returning args
  })
);
```

And you can see for setting the path relatively to the base.

#### glb.mapOutput()

Instead of the above the best and easy way would be to use `glb.mapOutput()`. An alias toward the internal output resolution module.

Set the `baseMap` (src base). Can be `string` or a `function` (per file mapping).

Set the `outMap` (out destination). Can be `string` or a `function` (per file mapping) as well.

Set the `extensionMap` (out extension). Can be `string` or a `function` (per file mapping) as well.

And finally Set the `specifier` if you want to use it and remove it. And it can be a `string` or a `function` (per file mapping) as well.

```js
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
```

With functions

```js
mix.js(
  glb.args(
    './src/relative/doneWithArgsAndGlbMapOutput/specifier/**/*.c.js',
    (src) => {
      const out = glb.mapOutput({
        src,
        outConfig: glb.out({
          baseMap: (src, mixFuncName) => /** can conditionally set the value */ './src',
          outMap: (src, mixFuncName) => /** can conditionally set the value */ './dist',
          extensionMap: (src, mixFuncName) => /** can conditionally set the value */ '.js',
          specifier: (src, mixFuncName) => /** can conditionally set the value */ 'c',
        }),
      });
      return [src, out];
    },
  ),
);
```

If you want to use the extension default mapping following the mix function as well. You can add the `mixFuncName` param as well.

```js
mix.js( // <-----------------same------------------------------------------
  glb.args(                                                             // |
    './src/relative/doneWithArgsAndGlbMapOutput/specifier/**/*.c.js',   // |
    (src) => {                                                          // |
      const out = glb.mapOutput({                                       // |
        src,                                                            // |
        outConfig: glb.out({                                            // |
          baseMap: './src',                                             // |
          outMap: './dist',                                             // |
          // No extension mapping specified => defaulting to default.   // |
          specifier: 'c',                                               // | 
        }),                                                             // |
        mixFuncName: 'js' // <-----------------same------------------------
      });
      return [src, out];
    },
  ),
);
```

### glb.array() (alias: glb.resolve())

Is used to run a glob and return an array of matching. And you can map them. To be used freely wherever u need. As a pure glob matcher. And in places where an array is expected.

It is equivalent to a glob resolver.

```js
function array(glb: TGlobValue): string[]
```

```js
type TGlobValue = TGlobPattern | IGlobObj
type TGlobPattern = string | string[]
export interface IGlobObj {
  pattern: TGlobPattern;
  options?: Omit<Options, 'objectMode'>;
}
/**
 * Options is fast-glob Options object
 * import type { Options } from 'fast-glob';
 */
```

Example:

```js
mix.js(
  glb.args(
    './src/somePlace/**/*.js',
    (src) => {
      const out = (specifier) => 
        glb.mapOutput({
          src,
          outConfig: glb.out({
            baseMap: './src',
            outMap: './dist',
            extensionMap: '.js'
            specifier
          }),
        });

      if (src.test(/.*?\.v\.js/)) {
        return [src, out('v')];
      }

      return [src, out('c')];
    },
  ),
)
.version(glb.array('./src/somePlace/**/*.v.js'));
/**
 * to version only the files with the `v` specifier
 */
```

The `.version()` function can take a `string[]` array of files. U can use `glb.array()` or the alias `glb.resolve()` to match the files. You can use something like the `'v'` specifier to differentiate those files.

### glb.resolveExtension()

The function that resolve the files extension following the mix function mapping if provided (used internally). As per `src/MixFunctionSettings/index.ts`.  
Or fall back to the resolve by the standard file extension mapping as a fallback. As per `src/MixGlob/OutManager/extensionMapping.ts`.

> You can use the relative paths above if you want to contribute any missing default mapping. 

You can use this function if you want to override the default mapping or configuration.

By default:

```js
mix
  .ts(
    glb.src('./src/reactNoArgs/specifier/**/*.c.tsx'),
    glb.out({
      outMap: './dist',
      baseMap: './src',
      specifier: 'c',
    }),
  )
```

You can see no extension mapping is provided. There is a default mapping and the resolution happen automatically. That was set to follow the default mapping `laravel-mix` setup through `webpack`.

> To know: Laravel mix through the different functions the output extension is fixed. For instance `.js()` and `.ts()` will always output `.js`.

If you go with:

```js
mix.ts('src/index.ts', 'dist/index.ts')
```

The output would be:

```js
`dist/index.ts.js`
```
and not ❌

```js
`dist/index.ts` // ❌
```

> That's how mix works through `webpack`. And for this reason there is no point in changing extensions.

So why exposing this internal helper ?

The answer is for flexibility. In case you need to extend the default mapping before you fill a `pr`. For what is not supported yet through `laravel-mix-glob`.

Or if you need it for some scripting or tool you may be making.

```js
const extendedExtensionMap = (src, mixFuncName) => {
  if (['some', 'bom', 'Kabom'].includes(mixFuncName)) {
    return /** your extended costume resolution */
  }
  /** you can do your custom resolution the way you want it. Just make sure it align with how mix work for given functions. Or file types. */
  return glb.resolveExtension(src, mixFuncName); // default last
}

mix
  .ts(
    glb.src('./src/reactNoArgs/specifier/**/*.c.tsx'),
    glb.out({
      outMap: './dist',
      baseMap: './src',
      extensionMap: extendedExtensionMap, // You would start using it through all functions
      specifier: 'c',
    }),
  )
  .react();

mix.kabom(
  glb.src('./src/reactNoArgs/specifier/**/*.c.tsx'),
  glb.out({
    outMap: './dist',
    baseMap: './src',
    extensionMap: extendedExtensionMap, // You would start using it through all functions
    specifier: 'c',
  }),
)
```

> Again check `src/MixFunctionSettings/index.ts` and `src/MixGlob/OutManager/extensionMapping.ts` to know better.

Know that you can use it as:

```js
glb.resolveExtension(src);
```

Without `mixFuncName` argument (optional). And it would only resolve by standard file extension mapping only.  As per `src/MixGlob/OutManager/extensionMapping.ts`.

> Generally however rarely you would need to use this helper. This is just a note to let you know that it does exist. And you have this flexibility just in case.

### glb.EXTENSION_FILE_MAPPING & glb.MIX_DEFAULT_FUNCTIONS_SETTINGS & glb.SRC_OUT_FUNCTIONS

Those constant used in the above `glb.resolveExtension()` function, are exposed to you as well. Just in case you need them for whatever flexibility.

> Again check `src/MixFunctionSettings/index.ts` and `src/MixGlob/OutManager/extensionMapping.ts` to know better.

`glb.EXTENSION_FILE_MAPPING` for standard file extension mapping resolution.

`glb.MIX_DEFAULT_FUNCTIONS_SETTINGS` configuration for mix functions. It includes the extension mapping per function configuration (at this moment. It's the only set configuration).

`glb.SRC_OUT_FUNCTIONS` the list of functions that expect src and out.

> Note: If you find yourself in a situation where the default settings up to know doesn't cover your case. Please extends the resolution yourself as shown by the precedent section. And please open a PR to add the correct mapping so that it would be available by default in the next versions.

## Using globs with other extensions

All you need to do is to import `laravel-mix-glob` last.

```js
const mix = require('laravel-mix');

/**
 * Loading extensions
 */
require('laravel-mix-swc');
// then laravel-mix-glob
const { glb } = require('laravel-mix-glob');

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
 * Works perfectly with other extension just the same way.
 * It's all about making calls.
 */
```

## What about pre-configuration

If you want to pre-configure anything. Like in the v1. The way to go in v2. Is to create the according configuration on top of the file. And re-use it in the calls wherever you need.

Example:

Same `OutConfig` for output base configuration. 

a great way in case you need some flexibility is to set some functions:

```js
const outConfig1 = (specifier = 'c', extensionMap = '') => {
  glb.out({
    outMap: './dist',
    baseMap: './src',
    extensionMap,
    specifier,
  }),
};

mix
  .ts(
    glb.src('./src/reactNoArgs/specifier/**/*.c.tsx'),
    outConfig1()
  )
  .react();

mix
  .js(
    glb.src('./src/**/*.js'),
    outConfig1('')
  )

mix
  .js(
    glb.src('./src/**/*.comp.js'),
    outConfig1('comp')
  )

// or

const outConfig1 = glb.out({
  outMap: './dist',
  baseMap: './src',
  specifier,
})

mix
  .js(
    glb.src('./src/*.c.js'),
    outConfig1
  )
```

You got the idea and about just anything. It's better and more flexible that way. It leave the design more clean and simple.

## Build Restart and watching

As in v1. V2 restart and watching system was enhanced.

If you are new. Know that in watch mode `npx mix watch` or `hot`. When you add new files or remove or rename ...., that are matched by the globs. `laravel-mix-glob` extension will automatically restart the build process.

The way it achieve that is through leveraging `chokidar` for glob file-system watching. And when an even requiring restart is detected. The extension will launch a new process. And kill the old one. Except for the master, the all starting process. Which would be put to sleep.

A re-design that augment efficiency. And in this version. The restart feature support multiple sessions or instances of laravel-mix processes or jobs. And the handling of cleaning the orphans is efficient. As well as the interruption to kill the current process. No more of the old workaround. CTRL + C works perfectly now.

Both watch and hot are supported.

```sh
# watch
npx mix watch
# hot
npx mix hot
```

## Globs
laravel-mix-glob use [fast glob](https://github.com/mrmlnc/fast-glob#readme) internally. For full support for auto restart. You can provide the glob as a string or an array.  
(You can use an object {pattern: \<string\> | \<array\> , options: \<FastGlobOptions\>} or a function that return files (signature: (globResolve) => \<filesList\>) (can be any function, and it take fastGlob resolution function as a parameter, can be used).

The function format is not supported at all by the restart functionality.

Try using `string` or `string[]` all of the time. In case you need some fast-glob options. You can use the `object` format. It's better supported for the restart in `v2`. But it may not support all of the features. In `v2` a mapping to chokidar was implemented as best as possible.

Here an example of using `string[]` to reduce two calls to just one (rather  then repeating twice for `tsx` and `ts` (here it's different folders)).

```js
mix
  .ts(
    glb.src([
      './src/relative/doneWithSrcOut/specifier/**/*.c.ts',
      './src/reactNoArgs/specifier/**/*.c.tsx', // string[] multiple globs patterns 
    ]),
    glb.out({
      baseMap: './src',
      outMap: './dist',
      specifier: 'c',
    }),
  )
  .react();
```

### Globbing patterns
> from globby doc

Just a quick overview.

- `*` matches any number of characters, but not `/`
- `?` matches a single character, but not `/`
- `**` matches any number of characters, including `/`, as long as it's the only thing in a path part
- `{}` allows for a comma-separated list of "or" expressions
- `!` at the beginning of a pattern will negate the match

[Various patterns and expected matches.](https://github.com/sindresorhus/multimatch/blob/master/test/test.js)


## Logging

Logging  was updated in `v2`.

Including for the debugging purpose.

As in the `v1`. The same system with `debug` package remain. The logs within the app have changed. Plus a silent mode was added in response to the [issue 63](https://github.com/MohamedLamineAllal/laravel-mix-glob/issues/63).


## LOGGING AND DEBUGGING

`Laravel-mix-glob` use [**debug**](https://github.com/visionmedia/debug) module for it's logging! With `MixGlob` domaine for log. And `MixGlob:error` domaine for error. And `MixGlob:debug` domaine for debug.

### Debugging logs

To activate debugging logs, you have to set the env var `DEBUG` to `"true"` or `"1"`. And that's the simplest way!

Otherwise you can set `DEBUG` to anything you want! Following **debug** module syntax!

ex: `DEBUG=*`

One may need to do that if he want to see the logs of all packages that are working with **debug** module. However if `DEBUG=1` or `DEBUG=true` were used! Only MixGlob logging will run. And that's the simplest form! You don't even need to know about the **debug** module.

**Where to set the env variable for debugging ?**

You can set the env var either at the script launch. And that would be on **package.json**  `developement` script!

And it's preferable to use `cross-env`.

Example:

```js
"scripts": {
    "dev": "npm run development",
    "development": "cross-env DEBUG=1 mix",
    "watch": "cross-env DEBUG_SHOW_HIDDEN=true DEBUG=true mix watch",
    "hot": "mix watch --hot",
    "prod": "npm run production",
    "production": "mix DEBUG=MixGlob:Error --production"
},
```

```sh
npm i -D cross-env
```

> Only for example. Generally you don't need to do anything. But that does show how you can do it.

Or because it's just debugging! One can simply add this in `webpack.mix.js` before requiring **laravel-mix-glob**

```js
process.env.DEBUG=true; // 1 works too
const MixGlob = require('laravel-mix-glob');
```

### Logging tweaking

There is some tweaks for the logging format! Those logging tweaks are described by this from **debug** doc ([here](https://github.com/visionmedia/debug#environment-variables)):

| Name      | Purpose                                         |
|-----------|-------------------------------------------------|
| `DEBUG_HIDE_DATE` | Hide date from debug output (non-TTY).  |
| `DEBUG_COLORS`| Whether or not to use colors in the debug output. |
| `DEBUG_DEPTH` | Object inspection depth.                    |
| `DEBUG_SHOW_HIDDEN` | Shows hidden properties on inspected objects. |

Better aliases are available:

| Name      | Purpose                                         |
|-----------|-------------------------------------------------|
| `LOG_HIDE_DATE` | Hide date from debug output (non-TTY).  |
| `LOG_COLORS`| Whether or not to use colors in the debug output. |
| `LOG_DEPTH` | Object inspection depth.                    |
| `LOG_SHOW_HIDDEN` | Shows hidden properties on inspected objects. |


### Silent mode (no logging)

If you want to go for silent logging at the level of this extension. You can do it through the following env variables:

```js
NO_LOG
SILENT_LOG
```

```sh
"watch": "cross-env SILENT_LOG=true npx mix watch"
```
