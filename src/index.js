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

const LOGGER = {
    log: debug('MixGlob'),
    err: debug('MixGlob:Error'),
    debug: debug('MixGlob:debug')
};

// setting up logging
settingUpLogging();

const MixGlob = (function () {
    LOGGER.debug('in MixGlob Module');

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
        css: {
            ext: 'css'
        },
        postCss: {
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
        LOGGER.debug('mapExt():');
        LOGGER.debug({
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
        LOGGER.debug('_mixDefaultMapExt():\n!!!!!!!!!' + String(ext));
        if (ext) return ext;
        throw 'defaultMapExt: no mapping precised, neither it\'s supported by default';
    }

    function defaultMapExt(mixFunc, mapping) {
        let mixFuncExt = null;
        if (mixFuncs[mixFunc]) {
            LOGGER.debug('defaultMapExt():\n=========mixFuncs[funcName].ext==========> ');
            LOGGER.debug(mixFuncs[mixFunc].ext);
            mixFuncExt = mixFuncs[mixFunc].ext;
        }
        return _mixDefaultMapExt(mixFunc, mapping, mixFuncExt);
    }



    function mixBaseGlob(mixFuncName, glb, output, mixOptions, options, defaultExtMapping, noWatch) { // this should refer to the MixGlob instance.
        LOGGER.debug('mixBaseGlob ==='.bgBlue);;
        LOGGER.log('mix function: %s'.yellow, mixFuncName);
        LOGGER.log('Glob: '.yellow + glb)

        let files;
        try {
            files = globbyResolve(glb);
        } catch (err) {
            LOGGER.err(err);
            return;
        }
        LOGGER.log('Matched files ===='.green);
        LOGGER.log(files);

        this.watchedFiles = [
            ...this.watchedFiles,
            ...files.filter(file => !this.watchedFiles.includes(file))
        ];
        
        this.watchedGlobs = [
            ...this.watchedGlobs,
            glb
        ];

        if (!noWatch) {
            /**
             * Watch for files and directories
             */
            LOGGER.debug('! NO WATCH ENTERED !!!!!!!!!!!!! -------');

            LOGGER.debug('watching ==first+>'.blue);
            LOGGER.debug(glb.yellow);

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
                    LOGGER.debug('UNLINK DIR CHOKIDAR -------------');
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

        //handling global optional values (with default)

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
            LOGGER.debug('this.mapping.ext.byExt === ');
            LOGGER.debug(this.mapping.ext && this.mapping.ext.byExt);
            extmap = mapExt(ext, extMapping, defaultExtMapping);

            LOGGER.debug('==> extmap = ' + String(extmap));
            if (ext && ext !== extmap) {
                fl = fl.replace(re_ext, extmap);
            }
            
            out = path.join(output, fl);
            LOGGER.debug('out ======'.bgGreen);
            LOGGER.log({
                file: fl,
                out
            });
            
            if (mixOptions) {
                this.mixInst = this.mixInst[mixFuncName](file, out, mixOptions);
            } else {
                this.mixInst = this.mixInst[mixFuncName](file, out);
            }
            LOGGER.debug(`mix ${mixFuncName} func exec`.yellow);
            LOGGER.debug({
                file,
                out,
                mixOptions
            });
        });

        // print total handled files
        if (this.totalHandledFilesLogTimeout) {
            clearTimeout(this.totalHandledFilesLogTimeout);
        }

        this.totalHandledFilesLogTimeout = setTimeout(function () {
            LOGGER.log('Total handled files :'.cyan);
            LOGGER.log(this.watchedFiles);
        }.bind(this), 50);
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
                    LOGGER.log(pthLogMsg.bgBlue);
                    LOGGER.log(pth.yellow);
                    LOGGER.log('Corresponding watcher glob: '.bgBlue);
                    LOGGER.log(glb);
                    LOGGER.debug(this.watchedGlobs);
                    LOGGER.log('restart...'.cyan);

                    this.cache.setKey('is_subprocess', true);
                    this.cache.save();
                    LOGGER.debug('is_subprocess = ')
                    LOGGER.debug(this.cache.getKey('is_subprocess'));

                    const subprocess = spawn("npm", ['run', this.shouldWatch], {
                        detached: true,
                        stdio: 'inherit',
                        cwd: process.cwd()
                    });

                    subprocess.on('error', (err) => {
                        LOGGER.debug('subprocess.on(error)');
                        LOGGER.err(err);
                        this.cache.setKey('is_subprocess', false);
                        this.cache.save();
                    });

                    subprocess.unref();

                    LOGGER.debug('pid ==== ' + subprocess.pid);

                    this.pidsList = [subprocess.pid];
                    this.cache.setKey('pids', this.pidsList);
                    this.cache.save();
                    // here add the process pid to a log (to remove it later)

                    setTimeout(() => {
                        process.exit(0);
                    }, 1000)
                }
            } catch (err) {
                LOGGER.err(err);
            }
        }
    }


    function MixGlob(options) {
        LOGGER.debug('Mix glob constructor');
        LOGGER.debug('Mix glob constructor: argv =');
        LOGGER.debug(process.argv);
        LOGGER.log('Mix glob'.yellow);

        this.cache = flatCache.load('laravel-mix-glob');

        this.shouldWatch = process.argv.some(arg => arg.includes('watch')) ? 'watch' : false;
        if (!this.shouldWatch) {
            this.shouldWatch = process.argv.some(arg => arg.includes('hot')) ? 'hot' : false;
        }

        if (this.shouldWatch && process && process.stdout) {
            LOGGER.debug({
                pidscache: this.cache.getKey('pids'),
                is_subprocess_cache: this.cache.getKey('is_subprocess')
            });
            this.pidsList = this.cache.getKey('pids') || [];
            this.is_subprocess = this.cache.getKey('is_subprocess') || false;

            LOGGER.debug('READ FROM CACHE');
            LOGGER.debug({
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
                    LOGGER.log("To quit type 'c' multiple times".bgBlue);
                    LOGGER.debug(`'${data}'`);
                    if (data === 'c' || data === 'C') {
                        LOGGER.debug('ENTERED data === "c" || "C"');

                        LOGGER.log('closing ...'.green);
                        LOGGER.log('pids '.cyan + JSON.stringify(this.pidsList).yellow);

                        this.cache.setKey('pids', []);
                        this.cache.save();

                        this.pidsList.forEach(pid => {
                            try {
                                process.kill(pid, 'SIGINT');
                            } catch (err) {
                                LOGGER.err('Error killing pid '.red + pid);
                            }
                        });

                        LOGGER.log('closed! CONTROL+C now'.blue);

                        process.exit(0);
                    }
                } else {
                    LOGGER.log("CONTROL+C to exit".bgBlue + '  (twice)');
                }
            });
            process.on('SIGINT', () => {
                setTimeout(() => {
                    if (this.is_subprocess) {
                        LOGGER.log('SIGINT'.bgRed);
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

function settingUpLogging() {
    // Debug mode
    if (process.env.DEBUG) {
        const debugStr = process.env.DEBUG.toLowerCase().trim();
        if (debugStr === '1' || debugStr === 'true') {
            debug.enable('MixGlob, MixGlob:Error, MixGlob:debug');
        }
    } else {
        // No debug mode
        debug.enable('MixGlob, MixGlob:Error');
    }

    // Handling Logging tweaking flags
    const debugTweakingEnvFlags = [
        'DEBUG_HIDE_DATE',
        'DEBUG_COLORS',
        'DEBUG_DEPTH',
        'DEBUG_SHOW_HIDDEN'
    ];

    /**
     *  Flags:
     *     'LOG_HIDE_DATE',
     *     'LOG_COLORS',
     *     'LOG_DEPTH',
     *     'LOG_SHOW_HIDDEN'
     *  will apply the same as the DEBUG_ equivalent
     */
    for (const debugTweakFlag of debugTweakingEnvFlags) {
        const logTweakFlagEquiv = debugTweakFlag.replace('DEBUG', 'LOG');
        if (process.env[logTweakFlagEquiv]) {
            process.env[debugTweakFlag] = process.env[logTweakFlagEquiv];
        }
    }
}

module.exports = MixGlob;
