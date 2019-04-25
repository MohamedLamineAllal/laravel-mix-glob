require('colors');
// const mix = require('laravel-mix')
const globby = require('globby');
const path = require('path');
const chokidar = require('chokidar');
const mm = require('micromatch');
const spawn = require('cross-spawn');
const fs = require('fs');
const debug = require('debug');
const flatCache = require('flat-cache');

const mglogger = {
    log: debug('MixGlob'),
    err: debug('MixGlob:Error'),
    debug: debug('MixGlob:debug')
}

const DEBUG_ENV_VARS = [
    'DEBUG',
    'DEBUG_HIDE_DATE',
    'DEBUG_COLORS',
    'DEBUG_DEPTH',
    'DEBUG_SHOW_HIDDEN'
];

if (noDebugEnvVar()) {
    debug.enable('MixGlob:debug');
    mglogger.debug('!!!!! ----- No debug env var ----- !!!!');
    mglogger.debug('env vars:')
    mglogger.debug(Object.keys(process.env));
    debug.enable('MixGlob, MixGlob:*, -MixGlob:debug');
}

const MixGlob = (function () {
    mglogger.debug('in MixGlob Module');

    var mixFuncs = {
        //default specifier = 'compile for all'
        // usage glob => *.compile.ext to check against only compile.ext. . or *.compile.* (all extensions preceded with compile)
        sass: {
            ext: 'css'
        },
        js: {
            ext: 'js'
        },
        less: {
            ext: 'css'
        },
        stylus: {
            ext: 'css'
        },
        react: {
            ext: 'js'
        },
        ts: {
            ext: 'js'
        },
        preact: {
            ext: 'js'
        }
    }


    function _mapExt(ext, mapping) {
        if (typeof mapping === 'string') {
            return mapping;
        }

        if (mapping && mapping.hasOwnProperty(ext)) {
            /**
             * this work to with by function mapping (in construction, creating default) [we can override them in construction]
             */
            return mapping[ext];
        }

        return false;
    }

    // map the extension to the provided mapping, if not then to the default, if not then it return the extension itself
    function mapExt(ext, mapping, defaultMapping) { // return false if there is not matching (check for false and take same extension)
        mglogger.debug('in mapExt');
        mglogger.debug({
            ext,
            mapping,
            defaultMapping
        });
        var mp = _mapExt(ext, mapping);
        if (mp) return mp;

        return _mapExt(ext, defaultMapping); // if at construction function mapping (it will be a string it will return the already evaluated value)
        // var mp = _mapExt(ext, mapping);
        // if(mp) return mp;
        // var dmp = _mapExt(defaultMapping);
        // if(dmp) return dmp;
        // return fa;
    }


    function _mixDefaultMapExt(mixFunc, passedMapping, defaultMapping) {
        const ext = mapExt(mixFunc, passedMapping, defaultMapping);
        // console.error('!!!!!!!!!', ext);
        if (ext) return ext;
        throw 'defaultMapExt: no mapping precised, neither it\'s supported by default';
    }

    function defaultMapExt(mixFunc, mapping) {
        let mixFuncExt = null;
        if (mixFuncs[mixFunc]) {
            // console.log('=========mixFuncs[funcName].ext==========> ', mixFuncs[mixFunc].ext);
            mixFuncExt = mixFuncs[mixFunc].ext;
        }
        return _mixDefaultMapExt(mixFunc, mapping, mixFuncExt);
    }



    function mixBaseGlob(mixFuncName, glb, output, mixOptions, options, defaultExtMapping, noWatch) { // this should refer to the MixGlob instance.
        mglogger.debug('mixBaseGlob ==='.bgBlue);;
        mglogger.log('mix function: %s'.yellow, mixFuncName);
        mglogger.log('Glob: '.yellow + glb)

        let files;
        try {
            files = globbyResolve(glb);
        } catch (err) {
            mglogger.err(err);
            return;
        }
        mglogger.log('Matched files ===='.green);
        mglogger.log(files);

        this.watchedFiles = [
            ...this.watchedFiles,
            ...files.filter(file => !this.watchedFiles.includes(file))
        ];
        mglogger.log('Total handled files :'.cyan);
        mglogger.log(this.watchedFiles);

        this.watchedGlobs = [
            ...this.watchedGlobs,
            glb
        ];

        if (!noWatch) {
            mglogger.debug('! NO WATCH ENTERED !!!!!!!!!!!!! -------');
            // if (this.watcher) {
            //     mglogger.debug('watching ==+>'.blue);
            //     mglogger.debug(glb);
            //     this.watcher.add(glb);
            // } else {
            mglogger.debug('watching ==first+>'.blue);
            mglogger.debug(glb.yellow);


            this.watchers.push(chokidar.watch(glb, {
                    ignoreInitial: true
                })
                .on('add', pth => {
                    restartMix.call(this, 'add', pth, glb);
                })
                .on('unlink', pth => {
                    restartMix.call(this, 'unlink', pth, glb);
                })
                .on('unlinkDir', pth => {
                    mglogger.debug('UNLINK DIR CHOKIDAR -------------');
                    restartMix.call(this, 'unlinkDir', pth, glb);
                })
            );
        }

        // var mixInstance = null;
        let fl; // file var to make the output
        let out;
        let ext;
        let re_speci;
        let re_ext;
        let extMapping = (this.mapping.ext && this.mapping.ext.byExt) || defaultExtMapping; // this mean map any extension to css||... ('otherwise you provide an mapping object)
        let base = 
        this.mapping.base && 
        (
            this.mapping.base.byExt || 
            this.mapping.base.byFunc[mixFuncName]
        );

        let extmap;
        // handling options access
        if (!options) options = {};
        if (!options.compileSpecifier) options.compileSpecifier = {};

        //handling globale opational values (with default)

        if (!options.compileSpecifier.disabled) { // if not disabled, the we set the regex that correspond to it, depending on the specifier
            let specifier = 'compile';
            if (options.compileSpecifier.specifier) {
                specifier = options.compileSpecifier.specifier;
            }
            re_speci = new RegExp('.' + specifier + '.(?!.*' + specifier + '.)', 'g');
        } // doing it here for better performance hhh! {even doesn't really matter it's something that get executed jsut once }

        //mapping
        if (options.mapping && options.mapping.ext) {
            extMapping = options.mapping.ext;
        }

        if (options.base) {
            base = options.base
        }

        // [to do] add verbose option (to show elegantly what files where treated)
        files.forEach((file) => {
            ext = path.extname(file).substr(1);

            if (base) {
                fl = file.replace(baseResolve(base, file, ext), ''); // remove the base
            } else {
                fl = path.basename(file);
            }

            // handling specifier

            if (!options.compileSpecifier.disable) {
                fl = fl.replace(re_speci, '.'); // remove the specifier
            }

            // //handling extension mapping (and replace)
            // // console.log('==> ext = ', ext);
            re_ext = new RegExp(ext + '$', 'g');
            mglogger.debug('this.mapping.ext.byExt === ');
            mglogger.debug(this.mapping.ext && this.mapping.ext.byExt);
            extmap = mapExt(ext, extMapping, defaultExtMapping);

            // console.log('==> extmap = ', extmap);
            if (ext && ext !== extmap) {
                fl = fl.replace(re_ext, extmap);
            }
            // console.log('--->');

            // console.log('==> fl = ', fl);
            out = path.join(output, fl);
            mglogger.debug('out ======'.bgGreen);
            console.log({
                fl,
                out
            });
            // var out = path.dirname(path.join(output, fl));
            //    console.dir(this.mix);
            if (mixOptions) {
                // console.log(mixFuncName);
                // console.log('mixInst =='.green);
                // console.log(this.mixInst);
                this.mixInst = this.mixInst[mixFuncName](file, out, mixOptions);
                // console.log('done');
            } else {
                // console.log(mixFuncName);
                // console.log('mixInst =nop='.green);
                // console.log(this.mixInst);
                this.mixInst = this.mixInst[mixFuncName](file, out);
                // console.log('done');
            }
            mglogger.debug(`mix ${mixFuncName} func exec`.yellow);
            mglogger.debug({
                file,
                out,
                mixOptions
            });

            // console.log('fl = ', fl);
            // console.log('file = ', file);
            // console.log('out = ', out);
        });
    }



    /**
     * NOTE: accepted type for glb => string or array. (for object or func. Auto restart is not supported. So they aren't officially supported. But can be used if wanted). 
     */
    function globbyResolve(glb) {
        if (Array.isArray(glb) || typeof glb === 'string') {
            return globby.sync(glb);
        } else if (typeof glb === 'object') {
            return globby.sync(glb.pattern, glb.options);
        } else if (typeof glb === 'function') {
            return glb(globby);
        } else {
            throw new Error('Wrong glb parameter, possible types are string|array|object ({pattern, options})|function {return <promise> -> resolve paths}');
        }
    }

    function baseResolve(base, file, ext) {
        if (typeof base === 'string') {
            return base;
        } else if (typeof base === 'function') {
            return base(file, ext, mm);
        } else if (typeof base === 'object') {
            return base[ext] || base.default;
        }
    }

    function restartMix(reason, pth, glb) {
        console.log(pth);
        let pthLogMsg = '';

        switch (reason) {
            case 'add':
                pthLogMsg = 'File added :';
                break;
            case 'unlink':
                pthLogMsg = 'File removed :';
                break;
            case 'unlinkDir':
                pthLogMsg = 'Directory removed :';
                break;
            default:
        }

        if (!this.onRestart) {
            this.onRestart = true;
            try {
                if (mm.every(pth, glb)) {
                    mglogger.log(pthLogMsg.bgBlue);
                    mglogger.log(pth.yellow);
                    mglogger.log('Corresponding watcher glob: '.bgBlue);
                    mglogger.log(glb);
                    mglogger.debug(this.watchedGlobs);
                    mglogger.log('restart...'.cyan);

                    this.cache.setKey('is_subprocess', true);
                    this.cache.save();
                    mglogger.debug('is_subprocess = ')
                    mglogger.debug(this.cache.getKey('is_subprocess'));

                    const subprocess = spawn("npm", ['run', this.shouldWatch], {
                        detached: true,
                        stdio: 'inherit',
                        cwd: process.cwd()
                    });

                    // mglogger.debug('Before processPersist_addPID :');
                    // mglogger.debug('pid = ' + subprocess.pid);
                    // const pid = subprocess.pid;

                    subprocess.on('error', (err) => {
                        mglogger.debug('subprocess.on(error)');
                        mglogger.err(err);
                        this.cache.setKey('is_subprocess', false);
                        this.cache.save();
                    });

                    subprocess.unref();

                    mglogger.debug('pid ==== ' + subprocess.pid);

                    this.pidsList = [subprocess.pid];
                    this.cache.setKey('pids', this.pidsList);
                    this.cache.save();
                    // here add the process pid to a log (to remove it later)

                    setTimeout(() => {
                        process.exit(0);
                    }, 1000)
                }
            } catch (err) {
                mglogger.err(err);
            }
        }
    }



    // make a function like for extMapping
    //but for mixFunc (if there is a precised mapping, we use that, if not we use the default mapping, if not available (didn't support one of the mixFunc) error will be thrown)

    // console.dir(mix);
    // for (var property in mix) {
    //     if (!mix.hasOwnProperty(property)) continue;
    //     console.log(property);
    //     // Do stuff...
    // }

    function MixGlob(options) {
        mglogger.debug('Mix glob constructor');
        mglogger.debug('Mix glob constructor: argv =');
        mglogger.debug(process.argv);
        mglogger.log('Mix glob'.yellow);

        this.cache = flatCache.load('laravel-mix-glob');

        this.shouldWatch = process.argv.some(arg => arg.includes('watch')) ? 'watch' : false;
        if (!this.shouldWatch) {
            this.shouldWatch = process.argv.some(arg => arg.includes('hot')) ? 'hot' : false;
        }
        // console.log('process!!'.bgBlue);
        // console.log(process);

        if (this.shouldWatch && process && process.stdout) {
            // console.log('stdout ======'.red);
            mglogger.debug({
                pidscache: this.cache.getKey('pids'),
                is_subprocess_cache: this.cache.getKey('is_subprocess')
            });
            this.pidsList = this.cache.getKey('pids') || [];
            this.is_subprocess = this.cache.getKey('is_subprocess') || false;

            mglogger.debug('READ FROM CACHE');
            mglogger.debug({
                pidsList: this.pidsList,
                is_subprocess: this.is_subprocess
            });

            let cacheReset = false;
            if (this.is_subprocess) {
                this.cache.setKey('is_subprocess', false);
                cacheReset = true;
            }

            if (this.pidsList.length > 0) {
                this.cache.setKey('pids', []);
                cacheReset = true;
            }

            if (cacheReset) {
                this.cache.save();
            }

            this.onRestart = false;
            process.stdout.on('data', (data) => {
                data = data.toString();
                if (this.is_subprocess) {
                    mglogger.log("To quit type 'c' multiple times".bgBlue);
                    mglogger.debug(`'${data}'`);
                    if (data === 'c' || data === 'C') {
                        mglogger.debug('ENTERED data === "c" || "C"');

                        mglogger.log('closing ...'.green);
                        mglogger.log('pids '.cyan + JSON.stringify(this.pidsList).yellow);

                        this.cache.setKey('pids', []);
                        this.cache.save();

                        this.pidsList.forEach(pid => {
                            try {
                                process.kill(pid, 'SIGINT');
                            } catch (err) {
                                mglogger.err('Error killing pid '.red + pid);
                            }
                        });



                        mglogger.log('closed! CONTROL+C now'.blue);

                        process.exit(0);
                    }
                } else {
                    mglogger.log("CONTROL+C to exit".bgBlue + '  (twice)');
                }
            });
            process.on('SIGINT', () => {
                setTimeout(() => {
                    if (this.is_subprocess) {
                        mglogger.log('SIGINT'.bgRed);
                        process.exit(0);
                    }
                }, 2000);
            });
        }

        if (!options.mix) {
            throw new Error('mix instance missing!'.red)
        }

        this.mapping = (options && options.mapping) || {};
        this.mixInst = options.mix;
        this.watchers = [];
        this.watchedFiles = [];
        this.watchedGlobs = [];

        Object.keys(this.mixInst).forEach((mixFunc, index) => {
            if (!(['mix', 'config', 'scripts', 'styles'].includes(mixFunc))) {
                //[glb1] <<<====
                // console.log((index + ' - ' + mixFunc).yellow);
                this[mixFunc] = function (glb, output, mixOptions, options) {
                    //[glb1] when you write all the default extensions for all of them tatke it out
                    const defaultExtMapping = defaultMapExt(mixFunc, this.mapping.ext && this.mapping.ext.byFunc);
                    // console.log('before mix base glob'.green);
                    // console.log(this);
                    mixBaseGlob.call(this, mixFunc, glb, output, mixOptions, options, defaultExtMapping, !this.shouldWatch);
                    return this;
                }.bind(this);
            }
        });

        // console.log('this ===='.bgBlue);
        // console.log(this);

        // this.mix
    }

    (function (p) {
        p.createMapping = function (mappings) {
            // following the mixFunc on the mapping, you update there corresponding functions in the object
            // ->!!!!! to be done
        }

        //expose originale mix functions (can be chained with mixGlob)
        p.mix = function (mixFuncName) { // usage : .mix('scripts')('', '').js().mix('minify')(...).
            return function () {
                // console.log(arguments);
                this.mixInst[mixFuncName].apply(this.mixInst, arguments);
                return this;
            }.bind(this);
        }
    })(MixGlob.prototype);

    return MixGlob;
})();

function noDebugEnvVar() {
    for (const envVar of Object.keys(process.env)) {
        if (DEBUG_ENV_VARS.includes(envVar)) {
            return false;
        }
    }
    return true;
}

module.exports = MixGlob;