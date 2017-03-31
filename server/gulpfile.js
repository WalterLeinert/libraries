/**
 * Gulp Buildfile
 */

// require("reflect-metadata");

const gulp = require('gulp');
const tslint = require('gulp-tslint');
const del = require('del');
const gulpSequence = require('gulp-sequence');
const argv = require('yargs').argv;
const exec = require('child_process').exec;
const tsc = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const merge = require('merge2');
const mocha = require('gulp-mocha');
const tscConfig = require('./tsconfig.json');
const tsProject = tsc.createProject('tsconfig.json');


/**
    * Hilfsfunktion zum Ausführen eines Kommandos (in gulp Skripts)
    * 
    * command      - der Kommandostring (z.B. 'gulp clean')
    * cwd          - das Arbeitsverzeichnis (z.B. 'client')
    * maxBuffer    - die Größe des Puffers für Ausgaben
    * cb           - Callbackfunktion
    */
function execCommand(command, cwd, maxBuffer, cb) {
  let execOpts = {};
  if (cwd) {
    execOpts.cwd = cwd;
  }

  if (maxBuffer) {
    execOpts.maxBuffer = maxBuffer;
  }

  // console.log('ops = ', execOpts);

  exec(command, execOpts, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}


/**
 * Common build
 */
gulp.task('update-fluxgate-common', function (cb) {
  //execCommand('npm uninstall --save @fluxgate/common', 'common', null, cb);
  execCommand('npm uninstall --save @fluxgate/common && npm install --save @fluxgate/common', '.', null, cb);
})

gulp.task('really-clean', ['clean'], function (cb) {
  return del('node_modules');
})

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del(['dist', 'build', 'js', 'lib', 'dts', 'release']);
})


gulp.task('tslint', () => {
  return gulp.src(['**/*.ts', '!**/*.d.ts', '!node_modules/**'])
    .pipe(tslint())
    .pipe(tslint.report());
});


/**
 * kompiliert den Server
 */
gulp.task('compile', function() {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(gulp.dest('dist/dts')),
        tsResult.js
          .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
          .pipe(gulp.dest('dist/src'))
    ]);
});



gulp.task('compile-test', function () {
  //find test code - note use of 'base'
  return gulp.src('./test/**/*.spec.ts', { base: '.' })
    /*transpile*/
    .pipe(tsc(tscConfig.compilerOptions))
    /*flush to disk*/
    .pipe(gulp.dest('dist'));
});



//optional - use a tsconfig file
gulp.task('test', ['compile-test'], function () {
  gulp.src('./dist/test/**/*.spec.js', {read: false})
    .pipe(mocha({
      reporter: 'spec'
    }));
});


gulp.task('publish', ['default'], function (cb) {
  const force = argv.f ? argv.f : '';
  const forceSwitch = (force ? '-f' : '');

  execCommand('npm publish ' + forceSwitch, '.', null, cb);
});


gulp.task('bundle', function (cb) {
  execCommand('webpack', '.', null, cb);
})


gulp.task('update-fluxgate', ['update-fluxgate-common'])

/* single command to hook into VS Code */
gulp.task('default', gulpSequence('clean', 'compile'/*gulp*/ /*, 'bundle'*/));