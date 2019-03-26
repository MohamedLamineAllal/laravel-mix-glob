require('colors');
// const mix = require('laravel-mix')
const glob = require('glob');
const path = require('path');
const chokidar = require('chokidar');
const mm = require('micromatch');
const { exec, spawn } = require('child_process');

const MixGlob = (function () {
    console.log('in MixGlob'.yellow);

    function _mapExt(ext, mapping) {
        if (typeof mapping === 'string') {
            return mapping;
        }

        if (mapping && mapping.hasOwnProperty(ext)) {
            return mapping[ext];
        }

        return false;
    }

    // map the extension to the provided mapping, if not then to the default, if not then it return the extension itself
    function mapExt(ext, mapping, defaultMapping) { // return false if there is not matching (check for false and take same extension)
        var mp = _mapExt(ext, mapping);
        if (mp) return mp;

        return _mapExt(ext, defaultMapping);
        // var mp = _mapExt(ext, mapping);
        // if(mp) return mp;
        // var dmp = _mapExt(defaultMapping);
        // if(dmp) return dmp;
        // return fa;
    }

    function globMulti (glbs) {
        if (!Array.isArray(glbs)) {
            glbs = [glbs];
        }

        const files = [];

        glbs.forEach(glb => {
            console.log('glb glob mutli ='.yellow);
            console.log(glb);
            files.push(...glob.sync(glb));
        });

        console.log('files glob mutli'.cyan);
        console.log(files);

        return files;
    }

    function mixBaseGlob(mixFuncName, glb, output, mixOptions, options, defaultExtMapping, noWatch) { // this should refer to the MixGlob instance.
        console.log('mixBaseGlob ==='.bgBlue);



        const files = globMulti(glb);
        console.log('gb files ===='.green);
        console.log(files);

        this.watchedFiles = [
            ...this.watchedFiles,
            ...files.filter(file => !this.watchedFiles.includes(file))
        ];
        console.log('watched files'.cyan);
        console.log(this.watchedFiles);

        if (!Array.isArray(glb)) {
            glb = [glb];
        }

        this.watchedGlobs = [
            ...this.watchedGlobs,
            ...glb
        ];


        if (!noWatch) {
            if (this.watcher) {
                console.log('watching ==+>'.blue);
                console.log(glb.yellow);
                this.watcher.add(glb);
            } else {
                console.log('watching ==first+>'.blue);
                console.log(glb.yellow);

                this.watcher =
                    chokidar.watch(glb)
                    .on('add', pth => {
                        // console.log('File added ->'.yellow);
                        // console.log(pth);
                        if (mm.every(pth, this.watchedGlobs) && !this.watchedFiles.includes(pth)) {
                            // mixBaseGlob.call(this, mixFuncName, pth, output, mixOptions, options, defaultExtMapping, false);
                            console.log('File added'.bgCyan);
                            console.log(pth.yellow);
                            console.log('restart...'.cyan);
                            const subprocess = spawn("npm", ['run', 'watch'], {shell: true, stdio: 'inherit', cwd: process.cwd()});

                            subprocess.unref();

                            setTimeout(() => {
                                process.exit(0);
                            }, 1000);
                        }
                    })
                    // .on('unlink', pth => {

                    // });
            }
        }

        // var mixInstance = null;
        let fl; // file var to make the output
        let out;
        let ext;
        let re_speci;
        let re_ext;
        let extMapping = defaultExtMapping; // this mean map any extension to css ('otherwise you provide an mapping object)
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
        if (options.extMapping) {
            extMapping = options.extMapping;
        }
        // [to do] add verbose option (to show elegantly what files where treated)
        files.forEach((file) => {
            // console.log('>');
            // console.log("src=  " , file);

            if (options.base) {
                fl = file.replace(options.base, ''); // remove the base
                // console.log('file = ', file);
            } else {
                fl = file;
            }
            // console.log('=> ', fl);

            // handling specifier

            if (!options.compileSpecifier.disable) {
                fl = fl.replace(re_speci, '.'); // remove the specifier
                // console.log('=> ', fl);
            }

            // console.log('--------->');

            //handling extension mapping (and replace)
            ext = path.extname(fl).substr(1);
            // console.log('==> ext = ', ext);
            re_ext = new RegExp(ext + '$', 'g');
            extmap = mapExt(ext, extMapping, defaultExtMapping);
            // console.log('==> extmap = ', extmap);
            if (ext !== extmap) {
                fl = fl.replace(re_ext, extmap);
            }
            // console.log('--->');

            // console.log('==> fl = ', fl);
            out = path.join(output, fl);
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

            // console.log('fl = ', fl);
            // console.log('file = ', file);
            // console.log('out = ', out);
        });
    }


    var mixFuncs = {
        //default specifier = 'compile for all'
        // usage glob => *.compile.ext to check against only compile.ext. . or *.compile.* (all extensions preceded with compile)
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

    function _mixDefaultMapExt(mixFunc, passedMapping, defaultMapping) {
        const ext = mapExt(mixFunc, passedMapping, defaultMapping);
        // console.error('!!!!!!!!!', ext);
        if (ext) return ext;
        throw 'defaultMapExt: no mapping precised, neither it\'s supported by default';
    }

    function defaultMapExt(mixFunc, mapping) {
        let mixFuncExt = null;
        if (mixFuncs[mixFunc]) {
            // console.log('=========mixFuncs[funcName].mapExt==========> ', mixFuncs[mixFunc].mapExt);
            mixFuncExt = mixFuncs[mixFunc].mapExt;
        }
        return _mixDefaultMapExt(mixFunc, mapping, mixFuncExt);
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
        console.log('Mix glob'.yellow);
        if (!options.mix) {
            throw new Error('mix instance missing!')
        }

        if (options) {
            if (options.mapping) {
                this.mapping = options.mapping
            }
        }

        if (!options || !options.mapping) {
            this.mapping = {};
        }

        this.mixInst = options.mix;
        this.watchedFiles = [];
        this.watchedGlobs = [];

        Object.keys(this.mixInst).forEach((mixFunc, index) => {
            if (!(['mix', 'config', 'scripts', 'styles'].includes(mixFunc))) {
                //[glb1] <<<====
                // console.log((index + ' - ' + mixFunc).yellow);
                this[mixFunc] = function (glb, output, mixOptions, options) {
                    //[glb1] when you write all the default extensions for all of them tatke it out
                    const defaultExtMapping = defaultMapExt(mixFunc, this.mapping.mapExt);
                    // console.log('before mix base glob'.green);
                    // console.log(this);
                    mixBaseGlob.call(this, mixFunc, glb, output, mixOptions, options, defaultExtMapping);
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

module.exports = MixGlob;