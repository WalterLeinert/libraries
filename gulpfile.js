/**
 * Gulp Buildfile für den Server
 */

const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const mocha = require('gulp-mocha');
const tscConfig = require('./tsconfig.compile.json');

// var jsdoc = require("gulp-jsdoc");

// Tests
// gulp.task('doc', function (cb) {
//     gulp.src("./lib/**/*.js")
//         .pipe(jsdoc('./documentation-output'))
// })

gulp.task('really-clean', ['clean'], function (cb) {
    return del('node_modules');
})

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del(['dist', 'build', 'lib', 'dts']);
})

/**
 * kompiliert den Server
 */
gulp.task('compile', function () {
  var tsResult = gulp
    .src('src/**/*.ts')
    .pipe(sourcemaps.init()) // This means sourcemaps will be generated
    .pipe(typescript(tscConfig.compilerOptions));

  return tsResult.js
    .pipe(sourcemaps.write('.', {
      sourceRoot: ".",
      includeContent: true
    }))
    .pipe(gulp.dest('lib'));
})


//optional - use a tsconfig file
var tsProject = typescript.createProject('./tsconfig.json');
gulp.task('test', function() {
    //find test code - note use of 'base'
    return gulp.src('./test/**/*.spec.ts', { base: '.' })
    /*transpile*/
    .pipe(tsProject())
    /*flush to disk*/
    .pipe(gulp.dest('build'))
    /*execute tests*/
    .pipe(mocha({
        reporter: 'spec'
    }));
});
/* single command to hook into VS Code */
gulp.task('default', ['compile', 'test']);