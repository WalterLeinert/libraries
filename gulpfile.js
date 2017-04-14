/**
 * Master Gulp Buildfile
 */
'user strict';

var gulp = require('gulp');
const gulpSequence = require('gulp-sequence');



require('./build/gulpfile.npm');
require('./build/gulpfile.docker');

require('./build/gulpfile.core');
require('./build/gulpfile.platform');
require('./build/gulpfile.common');
require('./build/gulpfile.server');
require('./build/gulpfile.client');


gulp.task('info', function () {
  console.log('------------------------------------------------------------');
  console.log('Building with:')
  console.log(`  APP_ENV  = ${process.env.APP_ENV}`)
  console.log(`  NODE_ENV = ${process.env.NODE_ENV}`)
  console.log('------------------------------------------------------------');
})


gulp.task('npm-install', ['install:common', 'install:client', 'install:server'])
gulp.task('update-fluxgate', ['update-fluxgate:platform', 'update-fluxgate:common', 'update-fluxgate:client', 'update-fluxgate:server'])

gulp.task('really-clean', ['really-clean:core', 'update-fluxgate:platform', 'update-fluxgate:common', 'really-clean:server', 'really-clean:client'], function (cb) {
    return del('node_modules');
})

gulp.task('clean', ['clean:core', 'clean:platform', 'clean:common', 'clean:client', 'clean:server'], function(cb) {
  return del('dist');
})
gulp.task('tslint', ['tslint:core', 'tslint:platform', 'tslint:common', 'tslint:server', 'tslint:client'])

gulp.task('publish', ['publish:core', 'publish:platform', 'publish:common', 'publish:client', 'publish:server'])


gulp.task('build-all', gulpSequence('build-all:core', 'build-all:platform', 'build-all:common', ['build-all:server', 'build-all:client']))

gulp.task('default', gulpSequence('build-all'))