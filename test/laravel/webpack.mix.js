require('colors')
const mix = require('laravel-mix');
console.log('webpcak mix start'.bgCyan);
const MixGlob = require('./../../dist/laravelMixGlob.min.js');

console.log("webpack mix ".yellow);

mixGlob = new MixGlob({
    mix,
    mapping: {
        mapExt: {
            byFunc: { // by function mapping
                sass: 'css',
                js: 'js'
                // ....  whenever you need it
            },
            byExt: { // by function mapping
                scss: 'css',
                jsm: 'jsm',
                tsx: 'jsx'
                // ....
                // this will take precedency over the above. (if there is a mapping it will be taking. Otherwise a given mapping byfunc will be taken if provided. Otherwise it will default to the default mapping)
            }
        },
        mapBase: { // comming in a future version

        }
    }
});

mixGlob.sass('resources/sass/**/*.compile.scss', 'public/css', null, {
    base: 'resources/sass/',
    // compileSpecifier: { 
    //     disabled: true // there is no compile specifier (disabled), and so it will not be removed from the extension (by default disabled = false, and the default specifier = 'compile', and it get removed from the path)
    //      ,
    //      specifier: 'cmp'
    // }
    // mapping: {   // this take precedency over any other mapping
    //     ext: {
    //         'scss': 'css' // multiple files separatly
    //     },
        // or
        // ext: 'css', // all to the same
        //   
    //     base: { // will come in a future version
    //          
    //     }
    // }
}).js(['resources/js/**/*.compile.{js,jsm}', '!resources/js/secondPattern/**/*'], 'public/js/', null, {
    base: 'resources/js/'
})
.js('resources/js/secondPattern/**/*.compile.{js,jsm}', 'public/js', null, {
    base: 'resources/js/secondPattern'
})
.ts(['resources/js/ts/**/*.compile.ts', 'resources/js/ts/**/*.compile.tsx'], 'public/js', null, {
    base: 'resources/js/ts' // add mapping of the base by extension
})
.mix('sass')('resources/sass/summernote.scss', '../resources/views/system/admin/dashboard/partials/_summernote_css.blade.php');