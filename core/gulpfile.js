/**
 * Gulp Buildfile
 */

const gulp = require('gulp');
const compodoc = require('@compodoc/gulp-compodoc');
const env = require('gulp-env');
const del = require('del');
const gulpSequence = require('gulp-sequence');
const argv = require('yargs').argv;
const exec = require('child_process').exec;
const gulp_tslint = require('gulp-tslint');
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
  return del(['dist', 'build', 'lib', 'dts', 'documentation']);
})


gulp.task('tslint', () => {
  return gulp.src(['**/*.ts', '!**/*.d.ts', '!node_modules/**'])
    .pipe(gulp_tslint())
    .pipe(gulp_tslint.report());
});


gulp.task('compile', function () {
  const tsResult = gulp.src('src/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject());

  return merge([
    tsResult.dts.pipe(gulp.dest('dist/dts')),
    tsResult.js
      .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
      .pipe(gulp.dest('dist/src'))
  ]);
});



gulp.task('compile:test', ['default'], function () {
  //find test code - note use of 'base'
  return gulp.src('./test/**/*.ts', { base: '.' })
    .pipe(sourcemaps.init())
    /*transpile*/
    .pipe(tsc(tscConfig.compilerOptions))
    /*flush to disk*/
    .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
    .pipe(gulp.dest('dist'));
});


gulp.task('test', ['set-env', 'compile:test'], function () {
  gulp.src('./dist/test/**/*.spec.js', { read: false })
    .pipe(mocha({
      reporter: 'spec'
    }));
});



gulp.task('publish', ['test'], function (cb) {
  const force = argv.f ? argv.f : '';
  const forceSwitch = (force ? '-f' : '');

  execCommand('npm publish ' + forceSwitch, '.', null, cb);
});

gulp.task('doc', () => {
  return gulp.src('src/**/*.ts')
    .pipe(compodoc({
      output: 'documentation',
      tsconfig: 'src/tsconfig.json',
      serve: false
    }))
});


// Hinweis: kein bundeling mehr für leichters Debuggen
// gulp.task('bundle', ['compile'], function (cb) {
//   execCommand('webpack', '.', null, cb);
// });

gulp.task('set-env', function () {
  env({
    vars: {
      PLATFORM: 'node'
    }
  })
});


gulp.task('default', gulpSequence('set-env', 'clean', 'compile'));