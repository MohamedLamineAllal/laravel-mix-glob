# laravel-mix-glob
A wrapper above laravel-mix that add support for globs.


> ::::::NOTE::::::
> UPDATED! new version (See the doc for what's new)
>
> laravel-mix-glob is newly published, it is however already practical. It's in beta now.  (Filling issuing about any bug or problem. Or even just to Know better. All welcomed. And appreicated.)
>
> Know that it is more well tested on Linux then Windows. If you find any problem let me know. (I'm ready to work on any issues and problems. And any contribution is appreciated.)
>
> Don't forget to star the project. :heartbeat: :heart:
> ::::::::::::::::


## Install
```
npm i laravel-mix-glob --save-dev
```

## Import
```js
const mix = require('laravel-mix'); // you need the laravel mix instance
const MixGlob = require('laravel-mix-glob');
```

## How to use
Initiate an instance:
```js
const mixGlob = MixGlob({mix}); // mix is required
```
or with options
```js
const mixGlob = MixGlob({
    mix, // mix required
    mapping: { // optional
        // will explain that later
    },
    // more options maybe added in future version (fill issues if you need anything, or a PR if you like)
});
```

Access the methods as with mix:
(same method in mix, are exposed for mixGlob.)
```js
mixGlob.sass('resources/sass/**/*.compile.scss', 'public/css', null, {
    base: 'resources/sass/',
    // compileSpecifier: { 
    //     disabled: true // there is no compile specifier (disabled), and so it will not be removed from the extension (by default disabled = false, and the default specifier = 'compile', and it get removed from the path)
    //      ,
    //      specifier: 'cmp'
    // }
    // mapping: {   // this take precedency over any other mapping // useless feature as laravel-mix doesn't support output in different formats. (until i find a workaround)
    //     ext: {
    //         'scss': 'css' // multiple files separatly
    //     },
        // or
        // ext: 'css', // all to the same
        //   
    // }
}).js(['resources/js/**/*.compile.{js,jsm}', '!resources/js/secondPattern/**/*'], 'public/js/', null, {
    base: 'resources/js/'
}) // multiple globs pattern as an array. Also with exclusion support (!)
.js('resources/js/secondPattern/**/*.compile.{js,jsm}', 'public/js', null, {
    base: 'resources/js/secondPattern'
})
.ts(['resources/js/ts/**/*.compile.ts', 'resources/js/tsx/**/*.compile.tsx'], 'public/js', null, {
    base: {
        ts: 'resources/js/ts/', // per file extension  mapping
        tsx: 'resources/js/tsx/**/*.compile.tsx'
    }
})
.mix('sass')('resources/sass/summernote.scss', '../resources/views/system/admin/dashboard/partials/_summernote_css.blade.php'); // laravel-mix instance
```

Notice that you can chain them.

Also the api expose the laravel-mix instance as shown at the end.
or just use mix instance.

For blobs you can use arrays. And exclusion (with !).


Launch webpack with 

```
npm run watch
```
for developement.

```
npm run dev
```
if you only want to build

```
npm run hot
```
and 
```
npm run prod
```

All work.

With `watch`, `watch-pol` and `hot` auto restart is laveraged at file add rename or remove.  

## Globs
laravel-mix-glob use [globby](https://github.com/sindresorhus/globby) internally. For full support for auto restart. You can provide the glob as a string or an array. (You can use an object {pattern: <string> | <array> , options: <globbyOptions>} or a function that return files (signature: (globby) => <filesList>) (can be any function, and it take globby as a parameter, can be used). However with those two format you can't count on the auto restart. As chokidar will not be able to match. And it is not that much of an interesting thing. Cause there is a way to support them fully. (Also the two last format are not well tested with `watch` and `hot`))


### Globbing patterns
> from globby doc

Just a quick overview.

- `*` matches any number of characters, but not `/`
- `?` matches a single character, but not `/`
- `**` matches any number of characters, including `/`, as long as it's the only thing in a path part
- `{}` allows for a comma-separated list of "or" expressions
- `!` at the beginning of a pattern will negate the match

[Various patterns and expected matches.](https://github.com/sindresorhus/multimatch/blob/master/test/test.js)

## Mapping

## The mapping and why:
laravel-mix-glob internally need to map the extensions to provide the specifier feature.
Having a flexibility on the mapping can be interesting. Sadely laravel-mix doesn't support outputing to other format then default. (most of the extension mapping api is quiet useless for now).
Other type of mapping are expected to be added. As mapping files and the base. (more of a luxary thing, then a requirement).

Here is the default extensions mapping per laravel-mix functions:

```js
{
    sass: 'css'// for this function by default if no per extension mapping is provided, the output extension will be css
    stylus: 'css',
    less: 'css',
    js:  'js',
    react: 'js',
    ts: 'js',
    preact: 'js'
}
```

### Why
- Reason one is that you may need to change the default mapping. // issue: useless as laravel-mix don't support outputing in different formats 
- Reason two is If i'm not providing a certain mapping. (You still can)

### NOTE
A full mapping system is implemented and functional. However because laravel-mix doesn't support output to other format. As for example output js files, into jsm extension (whatever the extension). Or tsx to jsx. The mapping is quiet useless, except for some cases that i will mention bellow. Or when i get a workaround [LET ME KNOW IF YOU HAVE ANY IDEAS! Fill an issue].

### NOTE
Remember that you can always use laravel-mix itself. See laravel-mix and laravel-mix-glob section bellow. 

### Mapping ways and precedency
There is three way to provide the mapping. An option in construction (byFunc or byExt). And within functions calls (byExt).
For **precedency**. the in function mapping is used. If not provided the byExt in constructor mapping. Otherwise byFunc in extension. Otherwise the default is used.
You can see examples in the examples section bellow.


## Methods parameters:
Laravel mix above functions have the following signature `(input, output, mixOptions)`.  MixGlob change that to `(glob, outputDir, mixOptions, mixGlobOptions)`.

Notice that mixOptions are the same as with mix. 

### mixGlobOptions
------------------
|      Option      |  type  |                 default                 |                                                                                                           Role                                                                                                          |
|:----------------:|:------:|:---------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       base       | <string>|<object (per Ext)>|<function ((file, ext, mm) => <string (base)>)> |                                         |                                                          Precise the base directory, so the transforamtion are correctly done,   and the output well generated                                                          |
| compileSpecifier | object | {disabled: false, specifier: 'compile'} | The specifier allow us to specify a string that will be removed from the compiled file. The goal is to have a way to differentiate the files that need to be compiled (main bundles).   And to use a specifier for that |
|    mapping    | object ({ext: <object>|<string>}) |                                   |                 Provide mapping for a specific extensions of matched files.     ex: scss => css, sass => css.     If a string is provided, then all the files whatever there extension are mapped to it.                |

#### More details about the options
The `base` option is very important to specify the base folder. Generally `resources/js`, `resoures/sass` ...etc It's goal is to be able to extract what to put on the output dir. 
- It can be a string. 
- Or an Object of the format ({<fileExtension>: <string (base)>, ..., default: <string (base)>})
```javascript
    base: {
        ts: 'resources/js/ts/', // per file extension  mapping
        tsx: 'resources/js/tsx/**/*.compile.tsx',
        default: 'if the file doesn\'t match'
    }
```
- Or a function. The signature is `(file, ext, mm) => string<base>`. Which take the file name, and extension, and an instance of micromatch. And is expected to return the base string.
```javascript
function (file, ext, mm) { // mm => micromatch instance
    if (mm.every(file, ['resources/js/specialfolder/**/*.compile.js'])) {
        return 'resources/js/specialfolder/';
    } else if (ext === 'jsm') {
        return path.dirname(file);
    }
    else {
        /**
         * default
         */
        
        return 'resources/js/';
    }
}
```
- Know too that if the base is ommited, then each file will be directly created in the output directory.

Know too that we can precise that at the intance constructor options. `mapping: {base: { byExt: {}, byFunc: {}}}`.
For the precedency. The in function take precedency over in constructor. And within constructor `byExt` take precedency over `byFunc`.
```javascript
new MixGlob({
    mix,
    mapping: {
        base: {
            byExt: {
                tsx: /*string*/,
                //....
            },
            byFunc: {
                sass: /*value can be any of the three format above (string, object, function) */,
                js: ,
                // ....
            }
        }
    }
})
```

The `compileSpecifier` option is another important one, that you need to know. You need to know that the specifier by default is enabled. Defaulting to `'compile'`. It's role is to remove this specifier in the output. And the goal is that we can have such a specifier, that allow us to distinguish the files that need to be compiled (the entry point). Then we need to match them in the glob. As shown in the example above.
The object is defined as bellow
```js
{
    disabled: true, // to precise if it should be defined or not. (default: false)
    specifier: 'cmpl' // precise your specifier
}
```
And so we can have files like this (in resources)

![resources](https://github.com/MohamedLamineAllal/laravel-mix-glob/raw/master/imgs/specifier_resources.png)


And the output will be

![output](https://github.com/MohamedLamineAllal/laravel-mix-glob/raw/master/imgs/specifier_output.png)

![output](https://github.com/MohamedLamineAllal/laravel-mix-glob/raw/master/imgs/specifier_output_compilation.png)


## Adding files and Restart
MixGlob laverage chokidar for files watch. If you add or remove a file that the glob match (while it's running). Webpack will be completly restarted for you. The old process is killed and a new one start.

## How mix glob work
laravel-mix-glob first inherit all the functions form laravel mix. It laverage globs to match files. Then it will loop through the matched files. And execute the laravel-mix functions file by file. So it wrap upon laravel-mix. Automate using the globs all the file by file functions call, that you should do otherwise. In plus to that. It have files watchers. That watch using the same globs. If a file that match a glob is added. Webpack will automaticly be restarted so it take the new file in. This apply for every used function. And too there is the base directory option and the specifier which all were explained.  

## Watching and process quiting
You need to know that after you add a file and webpack get restarted. Quiting the process will require a little manoeuvre. Either by you closing the console. And killing the process manually. Or you can click ENTER (May be several times), you will then get a message to tell you to type the character `c` several times. This will quit the process correctly (as there is more then one involved). And then CONTROL-C. 

## MixGlob and laravel-mix

MixGlob is just a convenience that add support for globs. It's ment to be used along laravel-mix. All the functions of laravel-mix are exported to MixGlob. But only the one on the default mapping above are supposed to work. For the rest it's not tested yet. And some work is to be done. it's jsut for beta for now. If you get any errors. Use the laravel-mix instance and the usual flow. Also that apply for the functions that doesn't need globs.

## examples

### Globs

#### one string pattern
```javascript
mixGlob.sass('resources/sass/**/*.compile.scss', 'public/css', { outputStyle: 'expanded' }, {
    base: 'resources/sass/',
})
.ts(
    'resources/js/ts/**/*.compile.{ts,tsx}',  // all files endign with compile.ts or compile.tsx ({pattern1, pattern2}  -> ',' = 'or')
    'public/js', 
    null, 
    { 
        base: 'resources/js/ts' // add mapping of the base by extension
    }
);


```
#### array pattern
```javascript
mixGlob.ts(['resources/js/ts/**/*.compile.ts', 'resources/js/ts/**/*.compile.tsx'], 'public/js', null, {
    base: 'resources/js/ts' // add mapping of the base by extension
});
```
#### exclusion
In the example bellow we will select a directory then exclude a complete subdirectory. And then in a second function call we will select part of that same directory (which is handy). 
```javascript
mixGlob.js(['resources/js/**/*.compile.{js,jsm}', '!resources/js/secondPattern/**/*'], 'public/js/', null, {
    base: 'resources/js/'
}) // multiple globs pattern as an array. Also with exclusion support (!) 
.js('resources/js/secondPattern/**/*.compile.{js,jsm}', 'public/js', null, {
    base: 'resources/js/secondPattern'
})
```

> from globby doc

Just a quick overview.

- `*` matches any number of characters, but not `/`
- `?` matches a single character, but not `/`
- `**` matches any number of characters, including `/`, as long as it's the only thing in a path part
- `{}` allows for a comma-separated list of "or" expressions
- `!` at the beginning of a pattern will negate the match

[Various patterns and expected matches.](https://github.com/sindresorhus/multimatch/blob/master/test/test.js)


### laravel-mix options
```javascript
mixGlob.sass(
    'resources/sass/**/*.compile.scss',  // src
    'public/css', // output
    { outputStyle: 'expanded' }, // laravel-mix options 
    {
        base: 'resources/sass/',  // laravel-mix-glob options
    }
)
.mix.stylus('resources/stylus/**/*.styl', 'public/css', 
    { // laravel-mix options (plugins ....)  just as in the doc
        use: [
            require('rupture')(),
            require('nib')(),
            require('jeet')()
        ],
        import: [
            '~nib/index.styl',
            '~jeet/jeet.styl'
        ]
    },
    {
        base: 'resources/stylus // laravel-mix-glob options
    }
)
.mix('options')({ // quick use of (options)
    processCssUrls: false 
});
```
Check the doc : https://laravel-mix.com/docs/4.0/css-preprocessors.

### use of laravel-mix itself
```javascript
const mix = require('laravel-mix');
// ....
mixGlob.js(['resources/js/**/*.compile.{js,jsm}', '!resources/js/secondPattern/**/*'], 'public/js/', null, {
    base: 'resources/js/'
}) // multiple globs pattern as an array. Also with exclusion support (!) 
.js('resources/js/secondPattern/**/*.compile.{js,jsm}', 'public/js', null, {
    base: 'resources/js/secondPattern'
})
.mix('extract')(); // from laravel-mix-glob (nice when chained)
//      ^      ^ params if there is
//      ^ func name

mix.minify(['this/one.js', 'and/this/one.js']); // using laravel-mix directly
mix.browserSync('my-domain.test');  // remember that whenever laravel-mix-glob fail. You can go the normal way.
```
Again check the doc: https://laravel-mix.com for all laravel mix related info.


### base option
#### no base
```javascript
mixGlob.js('resources/js/secondPattern/**/*.compile.{js,jsm}', 'public/js');
```
#### base as a string
```javascript
mixGlob.js('resources/js/secondPattern/**/*.compile.{js,jsm}', 'public/js', null, {
    base: 'resources/js/secondPattern'
})
```
#### base as an object (matching extensions)
```javascript
mixGlob.js('resources/js/**/*.compile.{js,jsm,ts,tsx}', 'public/js', null, {
    base: {
        ts: 'resources/js/ts/', // per file extension  mapping
        tsx: 'resources/js/tsx/**/*.compile.tsx',
        default: 'resources/js'
    }
});
```

#### base as a function 
```javascript
mixGlob.js('resources/js/**/*.compile.{js,jsm,ts,tsx}', 'public/js', null, {
    base: function (file, ext, mm) { // mm => micromatch instance
        if (mm.every(file, ['resources/js/specialfolder/**/*.compile.js'])) {
            return 'resources/js/specialfolder/';
        } else if (ext === 'jsm') {
            return path.dirname(file);
        } else if (['ts', 'tsx'].includes(ext)) {
            return 'resources/ts';
        }
        else {
            /**
             * default
             */
            
            return 'resources/js/';
        }
    }
});
```
#### base in the instance constructor
```javascript
const mixGlob = new MixGlob({
    mix,
    mapping: {
        base: {
            byExt: {
                tsx: 'resources/ts/tsx/',
                ts: 'resources/ts/'
            },
            byFunc: {
                sass: 'resources/styles',
                js: (file, ext, mm) => {
                    if (mm.every(file, 'resources/js/base/**/*.compile.js')) {
                        return 'resources/js/base';
                    } else {
                        return 'resources/js';
                    }
                },
                /**
                 * object  {
                 *      ext: '...',
                 *      //...,
                 *      default: '...'
                 * }   /// is supported too
                 * /
            }
        }
    }
});
```

### specifier option
#### use a specifier
```javascript
mixGlob.ts(['resources/ts/**/*.cmp.ts', 'resources/ts/**/*.cmp.tsx'], 'public/js', null, {
    base: {
        ts: 'resources/ts/',
        tsx: 'resources/tsx/'
    },
    compileSpecifier: { 
        specifier: 'cmp' // the specifier
    }
})
```
#### not use one
```javascript
mixGlob.ts(['resources/ts/**/*.special.ts', 'resources/ts/**/*.container.tsx'], 'public/js', null, {
    base: {
        ts: 'resources/ts/',
        tsx: 'resources/tsx/'
    },
    compileSpecifier: { 
        disabled: true
    }
});
```

// more yet to come ...  (some updates are intended)

// always open to any suggestions.

// your contribution is appreciated. 

// You are needed to test all the features. 

### Mapping 
NOTE: for extension mapping, it's queit useless until i find a workaround for the no support of laravel-mix for outputing in other format then default.

#### Example of changing the mapping by files extension
```javascript
mixGlob.ts(['resources/ts/**/*.cmp.ts', 'resources/ts/**/*.cmp.tsx'], 'public/js', null, {
    base: 'resources/sass/',
    compileSpecifier: { 
        specifier: 'cmp'
    },
    mapping: {
        ext: { // remembre for now this just to show. It's useless and don't work as intended (laravel-mix doesn't support outputing in other format then the default) [until i find a workaround]
            'tsx': 'jsx'
        }
    }
})
```

#### Example of precising the mapping by file extension at MixGlob instance construction

```js
const mixGlob = MixGlob({
    mix, // mix required
    mapping: { // optional
        ext: { // we precise ext. Other mapping may be added later
            byExt: {
                tsx: 'jsx',
                jsx: 'jsx',
                jsm: 'jsm'
                //...
                // Note this will be overriding by any mapping provided at functions calls (like mixGlob.sass()|.js()|.ts()...)
            }
        }
    }
});
```

#### Example of precising the mapping by functions at MixGlob instance construction

```js
const mixGlob = MixGlob({
    mix, // mix required
    mapping: { // optional
        ext: { // we precise ext. 
                js: 'jsm',
                //...
                // Note this will be overriding by any mapping provided at functions calls (like mixGlob.sass()|.js()|.ts()...)
            }
        }
    }
});
```
## an explicative video

## Issues and features requests
Don't hesitate to fill an issue for any bug, or feature request. 
(It's in Beta, though tested and work well in linux, less tested in windows. Helping fix any potential bugs is very requested.). More test are needed, to cover more functions.  
:heartbeat: All contribution are appreciated :heartbeat:

## contribution
- There is no test implemented yet. Neither guidelines. Feel free to fill any PR.
- Show your support by staring the project :heartbeat:.
- Feel free to contact me at allaldevelopment@gmail.com
- Help test it better.
- please report (fill issue) for any bug or error. Send the error message. And the context.

:heartbeat: :heart: Don't forget to star it. Share too :heart: :heartbeat:

## Work to do
- Implement tests
- concise logging to console. (improvement were done!)
- more extensive cross platform testing 
- add filtering functionalities and mapping
- ...


> ::::::NOTE::::::
>
> laravel-mix-glob is newly published, it is however already practical. It's in beta now.  (Filling issuing about any bug or problem. Or even just to Know better. All welcomed. And appreicated.)
>
> Know that it is more well tested on Linux then Windows. If you find any problem let me know. (I'm ready to work on any issues and problems. And any contribution is appreciated.)
>
> Don't forget to star the project. :heartbeat: :heart:
> ::::::::::::::::