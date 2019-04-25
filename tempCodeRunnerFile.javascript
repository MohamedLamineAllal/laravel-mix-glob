const glob = require('glob');

glob(['./*', './test/**/*'], function (err, files) {
    console.log('callback ============');
    console.log(files);
});