const { src, dest, parallel } = require('gulp');
const concat = require('gulp-concat');
const replace = require('gulp-replace');

function docsBuildReadme() {
  return src([
    './documentation/Header.md',
    './documentation/v2/README.md',
    './documentation/Footer.md',
  ])
    .pipe(concat('README.md'))
    .pipe(replace('(../', '(./'))
    .pipe(dest('.'));
}

function docsCopyContributing() {
  return src('./documentation/Contribution.md')
    .pipe(concat('CONTRIBUTING.md'))
    .pipe(replace('(../', '(./'))
    .pipe(dest('.'));
}

exports.docBuildReadme = docsBuildReadme;
exports.docCopyContributing = docsCopyContributing;
exports.docsBuild = parallel(docsBuildReadme, docsCopyContributing);
