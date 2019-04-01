# laravel-mix-glob
A wrapper above laravel-mix that add support for globs.


> ::::::NOTE::::::
>
> laravel-mix-glob is newly published, it is however already practical. It's in beta now.  (Filling issuing about any bug or problem. Or even just to Know better. All welcomed. And appreicated.)
>
> Know that i only tested it in linux. I will test it too in windows. (In mean time i'm ready to work on any issues and problems)
>
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
    mapping: {
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
    // extMapping: {
    //     'scss': 'cssExtra'
    // }
    //extMapping: 'cssExtra' // all the files whatever the extension, like a wildcard.
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


## The mapping and why:
Here is the default mapping:

```js
{
    sass: {
        mapExt: 'css'
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
The keys are the name of the mix functions. Because with the globs the output is automatically created. Such a mapping is needed to do so. As a method like `sass` can have files of different extensions, and so too does js (jsm, jsx). Whatever it is, the mapping allow to precise the extension of the output for a method (sass, js, react, ts ...). Then in the methods params, we can precise a mapping by input files extension.

(I may add support for dynamic mapping soon (Using a function, you map per file))

#### Why
- Reason one is that you may need to change the default mapping. 
- Reason two is If i'm not providing a certain mapping. (You still can)

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
- Show your support by staring the project.
- Feel free to contact me at allaldevelopment@gmail.com
- Help test it better.

## Work to do
- Implement tests
- concise logging to console.
- ...



> ::::::NOTE::::::
>
> laravel-mix-glob is newly published, it is however already practical. It's in beta now.  (Filling issuing about any bug or problem. Or even just to Know better. All welcomed. And appreicated.)
>
> Know that i only tested it in linux. I will test it too in windows. (In mean time i'm ready to work on any issues and problems)
>
> ::::::::::::::::
