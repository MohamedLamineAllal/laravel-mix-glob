# laravel-mix-glob
A wrapper above laravel-mix that add support for globs.


> ::::::NOTE::::::
> UPDATED! new version (See the doc for what's new)
>
> laravel-mix-glob is newly published, it is however already practical. It's in beta now.  (Filling issuing about any bug or problem. Or even just to Know better. All welcomed. And appreicated.)
>
> Know that it is more well tested on Linux then Windows. If you find any problem let me know. (I'm ready to work on any issues and problems. And any contribution is appreciated.)
>
> Don't forget to start the project. :heartbeat: :heart:
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
    }
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
    // mapping: {
    //     ext: {
    //          'scss': 'css'
    //     }
    // }
})
.js('resources/js/**/*.compile.js', 'public/js/', null, {
    base: 'resources/js/'
})
.mix('sass')('resources/sass/summernote.scss', '../resources/views/system/admin/dashboard/partials/_summernote_css.blade.php'); // laravel-mix instance
```

Notice that you can chain them.

Also the api expose the laravel-mix instance as shown at the end.
or just use mix instance.


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

## The mapping and why:
Here is the default mapping per laravel-mix functions:

```js
{
    sass: {
        mapExt: 'css'// for this function by default if no per extension mapping is provided, the output extension will be css
    },
    js: {
        mapExt: 'js'
    },
    less: {
        mapExt: 'css'
    },
    stylus: {
        mapExt: 'css'
    },
    react: {
        mapExt: 'js'
    },
    ts: {
        mapExt: 'js'
    },
    preact: {
        mapExt:'js'
    }
}
```

#### Where and How the mapping is used
Because with the globs the output need to be created automatically. Such a mapping is needed to do so. As a method like `sass` can have files of different extensions, and so too does js (jsm, jsx). Whatever it is, the mapping allow to precise the extension of the output for a method (sass, js, react, ts ...) or by file extensions. Then in the methods params, we can precise a mapping by input files extensions.

#### Why
- Reason one is that you may need to change the default mapping. 
- Reason two is If i'm not providing a certain mapping. (You still can)

#### Example of changing the mapping by files extension
```javascript
mixGlob.ts(['resources/ts/**/*.cmp.ts', 'resources/ts/**/*.cmp.tsx'], 'public/js', null, {
    base: 'resources/sass/',
    compileSpecifier: { 
        specifier: 'cmp'
    },
    mapping: {
        ext: { // remembre for now this just to show. It's useless and don't work as intended (laravel-mix doesn't support outputing in other format then the default) [until i find a workaround]
            'jsm': 'jsm',
            'tsx': 'jsx'
        }
    }
    //extMapping: 'js' // all the files whatever the extension (in this example ts or tsx or anything else), like a wildcard.
})
```

#### Example of precising the mapping by file extension at MixGlob instance construction

```js
const mixGlob = MixGlob({
    mix, // mix required
    mapping: { // optional
        mapExt: { // we precise mapExt. Other mapping may be added later
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
        mapExt: { // we precise mapExt. Other mapping may be added later
            byFunc: {
                js: 'jsm',
                //...
                // Note this will be overriding by any mapping provided at functions calls (like mixGlob.sass()|.js()|.ts()...)
            }
        }
    }
});
```


## Methods parameters:
Laravel mix above functions have the following signature `(input, output, mixOptions)`.  MixGlob change that to `(glob, outputDir, mixOptions, mixGlobOptions)`.

Notice that mixOptions are the same as with mix. 

### mixGlobOptions
------------------
|      Option      |  type  |                 default                 |                                                                                                           Role                                                                                                          |
|:----------------:|:------:|:---------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       base       | string |                                         |                                                          Precise the base directory, so the transforamtion are correctly done,   and the output well generated                                                          |
| compileSpecifier | object | {disabled: false, specifier: 'compile'} | The specifier allow us to specify a string that will be removed from the compiled file. The goal is to have a way to differentiate the files that need to be compiled (main bundles).   And to use a specifier for that |
|    extMapping    | object |                  string                 |                 Provide mapping for a specific extensions of matched files.     ex: scss => css, sass => css.     If a string is provided, then all the files whatever there extension are mapped to it.                |

#### More details about the options
The `base` option is very important to specify the base folder. Generally `resources/js`, `resoures/sass` ...etc It's goal is to be able to extract what to put on the output dir.

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


The `extMapping` ..

## Adding files and Restart
MixGlob laverage chokidar for files watch. If you add a file that the glob match (while it's running). Webpack will be completly restarted for you. The old process is killed and a new one start.

## How mix glob work
laravel-mix-glob first inherit all the functions form laravel mix. It laverage globs to match files. Then it will loop through the matched files. And execute the laravel-mix functions file by file. So it wrap upon laravel-mix. Automate using the globs all the file by file functions call, that you should do otherwise. In plus to that. It have files watchers. That watch using the same globs. If a file that match a glob is added. Webpack will automaticly be restarted so it take the new file in. This apply for every used function. And too there is the mapping, the base directory option and the specifier which all were explained.  

## Watching and process quiting
You need to know that after you add a file and webpack get restarted. Quiting the process will require a little manoeuvre. Either by you closing the console. Or you can click ENTER (May be several times), you will then get a message to tell you to type the character `c` several times. This will quit the process correctly (as there is more then one involve).

## MixGlob and laravel-mix

MixGlob is just a convenience that add support for globs. It's ment to be used along laravel-mix. All the functions of laravel-mix are exported to MixGlob. But only the one on the default mapping above are supposed to work. For the rest it's not tested yet. And some work is to be done. it's jsut for beta for now. If you get any errors. Use the laravel-mix instance and the usual flow. Also that apply for the functions that doesn't need globs.

## examples

## an explicative video

## Issues and features requests
Don't hesitate to fill an issue for any bug, or feature request. 
(As now it's an alpha version, though tested and work well in linux. Helping fix any potential bugs is very requested.)

## contribution
- There is no test implemented yet. Neither guidelines. Feel free to fill any PR.
- Show your support by staring the project :heartbeat:.
- Feel free to contact me at allaldevelopment@gmail.com
- Help test it better.


## Work to do
- Implement tests
- concise logging to console.
- more extensive cross platform testing
- ...



> ::::::NOTE::::::
>
> laravel-mix-glob is newly published, it is however already practical. It's in beta now.  (Filling issuing about any bug or problem. Or even just to Know better. All welcomed. And appreicated.)
>
> Know that it is more well tested on Linux then Windows. If you find any problem let me know. (I'm ready to work on any issues and problems. And any contribution is appreciated.)
>
> Don't forget to start the project. :heartbeat: :heart:
> ::::::::::::::::
