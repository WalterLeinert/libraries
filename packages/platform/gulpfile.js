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
const tsProject = tsc.createProject('tsconfig.json');
const tsSpecProject = tsc.createProject('tsconfig.spec.json');
const removeCode = require('gulp-remove-code');

const distPath = '../../dist/platform';

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
  return del([distPath, 'dist', 'build', 'lib', 'dts', 'documentation'], {force: true});
});


gulp.task('tslint', () => {
  return gulp.src(['**/*.ts', '!**/*.d.ts', '!node_modules/**'])
    .pipe(gulp_tslint())
    .pipe(gulp_tslint.report());
});



gulp.task('compile:browser', function() {
    const tsResult = tsProject.src()
        .pipe(removeCode({ browser: true }))
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(gulp.dest(distPath + '/browser/dts')),
        tsResult.js
          .pipe(sourcemaps.write('.')) // Now the sourcemaps are added to the .js file
          .pipe(gulp.dest(distPath + '/browser/src'))
    ]);
});

gulp.task('compile:node', function() {
    const tsResult = tsProject.src()
        .pipe(removeCode({ node: true }))
        .pipe(sourcemaps.init())
        .pipe(tsProject());

        const deployResult = gulp.src('package.json')
        .pipe(gulp.dest(distPath));

    return merge([
        tsResult.dts.pipe(gulp.dest(distPath + '/node/dts')),
        tsResult.js
          .pipe(sourcemaps.write('.')) // Now the sourcemaps are added to the .js file
          .pipe(gulp.dest(distPath + '/node/src')),
          deployResult
    ]);
});


gulp.task('compile:test-node', ['default'], function () {
  //find test code - note use of 'base'
  return tsSpecProject.src()
    .pipe(sourcemaps.init())
    /*transpile*/
    .pipe(tsSpecProject())
    /*flush to disk*/
    .pipe(sourcemaps.write('.', { sourceRoot: './', includeContent: false })) // Now the sourcemaps are added to the .js file
    .pipe(gulp.dest('dist/node'));
});


gulp.task('test-node', ['set-env', 'compile:test-node'], function () {
  console.warn('*** echte Tests aktivieren, sobald Tests existieren');
  // TODO: echte Tests aktivieren, sobald Tests existieren
});

// gulp.task('test-node', ['set-env', 'compile:test-node'], function () {
//   gulp.src('./dist/node/**/*.spec.js', { read: false })
//     .pipe(mocha({
//       require: [
//         'ts-node/register',
//         'tsconfig-paths/register'
//       ],
//       reporter: 'spec'
//     }));
// });

gulp.task('test', gulpSequence('test-node'));


gulp.task('publish', ['test-node'], function (cb) {
  const force = argv.f ? argv.f : '';
  const forceSwitch = (force ? '-f' : '');

  execCommand('npm publish ' + forceSwitch, '.', null, cb);
});

gulp.task('update-fluxgate', function (cb) {
  execCommand('npm uninstall --save @fluxgate/core && npm install --save @fluxgate/core', '.', null, cb);
})

gulp.task('update-fluxgate-yarn', function (cb) {
  execCommand('yarn remove @fluxgate/core && yarn add @fluxgate/core', '.', null, cb);
})


gulp.task('doc', () => {
  return gulp.src('src/**/*.ts')
    .pipe(compodoc({
      output: 'documentation',
      tsconfig: 'src/tsconfig.json',
      serve: false
    }))
});

gulp.task('set-env', function () {
  env({
    vars: {
      PLATFORM: 'node'
    }
  })
});


gulp.task('default', gulpSequence('set-env', 'clean', 'compile:browser', 'compile:node'));