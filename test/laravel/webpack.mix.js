const mixGlob = require('./../../dist/laravelMixGlob.min.js');

mixGlob = new MixGlob();

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
}).js('resources/js/**/*.compile.js', 'public/js/', null, {
    base: 'resources/js/'
}).mix('sass')('resources/sass/summernote.scss', '../resources/views/system/admin/dashboard/partials/_summernote_css.blade.php');