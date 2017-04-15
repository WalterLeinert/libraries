/**
 * Gulp Buildfile
 */
'user strict';

const gulp = require('gulp');
const ngc = require('gulp-ngc');
const gulp_tslint = require('gulp-tslint');
const del = require('del');
const gulpSequence = require('gulp-sequence');
const argv = require('yargs').argv;
const exec = require('child_process').exec;
const tslint = require("gulp-tslint");
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const merge = require('merge2');
const mocha = require('gulp-mocha');
const tscConfig = require('./src/tsconfig.app.json');

const bufferSize = 4096 * 1024;

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


gulp.task('update-fluxgate', function (cb) {
  execCommand('npm uninstall --save @fluxgate/core @fluxgate/common @fluxgate/platform && ' +
    'npm install --save @fluxgate/core @fluxgate/common @fluxgate/platform', '.', null, cb);
})

gulp.task('really-clean', ['clean'], function (cb) {
  return del('node_modules');
})

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del(['dist', 'build', 'aot', 'lib', 'dts', '**/*.ngfactory.ts', '**/*.ngsummary.json']);
})

gulp.task('tslint', () => {
  return gulp.src(['**/*.ts', '!**/*.d.ts', '!node_modules/**'])
    .pipe(tslint())
    .pipe(tslint.report());
});

/**
 * kompiliert den Server
 */
gulp.task('compile', function () {
  var tsResult = gulp
    .src('src/**/*.ts')
    .pipe(sourcemaps.init()) // This means sourcemaps will be generated
    .pipe(typescript(tscConfig.compilerOptions));

  return merge([
    tsResult.dts.pipe(
      gulp.dest('build/dts')
    ),
    tsResult.js.pipe(
      sourcemaps.write('.', {
        sourceRoot: '.',
        includeContent: true
      }))
      .pipe(gulp.dest('build/src')),
  ]);
})

gulp.task('ngc', () => {
  return ngc('src/tsconfig.app.json');
});

//optional - use a tsconfig file
gulp.task('test', function (cb) {

  // TODO:
  execCommand('ng test --single-run', '.', bufferSize, cb);

  // //find test code - note use of 'base'
  // return gulp.src('./test/**/*.spec.ts', { base: '.' })
  //   /*transpile*/
  //   .pipe(typescript(tscConfig.compilerOptions))
  //   /*flush to disk*/
  //   .pipe(gulp.dest('build'))
  //   /*execute tests*/
  //   .pipe(mocha({
  //     reporter: 'spec'
  //   }));
});



gulp.task('build-test', gulpSequence('default'/*, 'test'*/));

gulp.task('publish', ['build-test'], function (cb) {
  const force = argv.f ? argv.f : '';
  const forceSwitch = (force ? '-f' : '');

  execCommand('npm publish ' + forceSwitch, '.', bufferSize, cb);
});


gulp.task('bundle', function (cb) {
  execCommand('webpack', '.', bufferSize, cb);
})


/* single command to hook into VS Code */
gulp.task('default', gulpSequence('clean', 'ngc'));