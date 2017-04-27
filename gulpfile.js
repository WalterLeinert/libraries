/**
 * Master Gulp Buildfile
 */
'use strict';

var gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
const del = require('del');


require('./build/gulpfile.npm');
require('./build/gulpfile.docker');

require('./build/gulpfile.core');
require('./build/gulpfile.platform');
require('./build/gulpfile.common');
require('./build/gulpfile.server');
require('./build/gulpfile.client');
require('./build/gulpfile.components');


gulp.task('info', function () {
  console.log('------------------------------------------------------------');
  console.log('Building with:')
  console.log(`  APP_ENV  = ${process.env.APP_ENV}`)
  console.log(`  NODE_ENV = ${process.env.NODE_ENV}`)
  console.log('------------------------------------------------------------');
})


gulp.task('npm-install', [
  'install:core',
  'install:platform',
  'install:common',
  'install:client',
  'install:components',
  'install:server'
])

gulp.task('update-fluxgate', [
  'update-fluxgate:platform',
  'update-fluxgate:common',
  'update-fluxgate:client',
  'update-fluxgate:components',
  'update-fluxgate:server'
])

gulp.task('really-clean', [
  'really-clean:core',
  'really-clean:platform',
  'really-clean:common',
  'really-clean:client',
  'really-clean:components',
  'really-clean:server'
], function (cb) {
  return del('node_modules');
})

gulp.task('clean', [
  'clean:core',
  'clean:platform',
  'clean:common',
  'clean:server',
  'clean:client',
  'clean:components'
])

gulp.task('tslint', [
  'tslint:core',
  'tslint:platform',
  'tslint:common',
  'tslint:client',
  'tslint:components',
  'tslint:server'
])

gulp.task('test', [
  'test:core',
  'test:platform',
  'test:common',
  'test:client',
  'test:components',
  'test:server'
])

gulp.task('publish', [
  'publish:core',
  'publish:platform',
  'publish:common',
  'publish:client',
  'publish:components',
  'publish:server'
])

gulp.task('doc', [
  'doc:core',
  'doc:platform',
  'doc:common',
  'doc:client',
  'doc:components',
  'doc:server'
])

gulp.task('build-all:client-components',
  gulpSequence('build-all:client', 'build-all:components')
);


gulp.task('build-all',
  gulpSequence(
    'build-all:core',
    'build-all:platform',
    'build-all:common',
    ['build-all:server', 'build-all:client-components']
  )
)

gulp.task('default', gulpSequence('build-all'))