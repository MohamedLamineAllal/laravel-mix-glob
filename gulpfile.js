const {series, src, dest, watch} = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
function minify(done) {
    return src('src/index.js')
        .pipe(uglify())
        .pipe(rename('laravelMixGlob.min.js'))
        .pipe(dest('dist/')).on('end', function () {
            done();
        });
}

const delayedMinify = delay(minify, 2000);

function watchTask() {
    watch('src/index.js', series(delayedMinify)); // when a changment happen to one of the files, this will be triggered, but, this get executed after 2000 ms , and only if not other triggering happen, otherwise counting start all over
}


exports.default =  series(watchTask);

exports.minify = minify;

function delay(cb, ms) {
    let timer = null;

    return function (done) {
        clearTimeout(timer);
        setTimeout(cb.bind(null, done), ms);
    }
}