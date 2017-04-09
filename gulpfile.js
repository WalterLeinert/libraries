/**
 * Master Gulp Buildfile
 */
'user strict';

const gulp = require('gulp');
const gulp_tslint = require('gulp-tslint');
const del = require('del');
const gulpSequence = require('gulp-sequence');
const argv = require('yargs').argv;
const exec = require('child_process').exec;

const line = '------------------------------------------------------------';
const bufferSize = 4096 * 500;


/**
 * ------------------------------------------------------------
 * * Hilfsfunktionen
 * ------------------------------------------------------------
 */

/**
 * Ausführen eines Kommandos (in gulp Skripts)
 *
 * command      - der Kommandostring (z.B. 'gulp clean')
 * cwd          - das Arbeitsverzeichnis (z.B. 'client')
 * maxBuffer    - die Größe des Puffers für Ausgaben
 * cb           - Callbackfunktion
 */
execCommand = function (command, cwd, maxBuffer, cb) {
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
 * Kopiert File(s) von src nach dest
 */
gulp.copy = function (src, dest) {
  return gulp.src(src /*, {base:"."}*/)
    .pipe(gulp.dest(dest));
};
/**
 * ------------------------------------------------------------
 * * Hilfsfunktionen
 * ------------------------------------------------------------
 */


/**
 * Common build
 */
gulp.task('lint-common', function (cb) {
  execCommand('gulp tslint', 'common', bufferSize, cb);
})

gulp.task('really-clean-common', ['clean-common'], function (cb) {
    return del('common/node_modules');
})

gulp.task('clean-common', function (cb) {
  execCommand('gulp clean', 'common', bufferSize, cb);
})

gulp.task('build-common', function (cb) {
  execCommand('gulp', 'common', bufferSize, cb);
})

gulp.task('test-common', function (cb) {
  execCommand('gulp test', 'common', bufferSize, cb);
})

gulp.task('publish-common', function (cb) {
  execCommand('gulp publish -f', 'common', bufferSize, cb);
})

gulp.task('build-all-common', gulpSequence('clean-common', 'build-common', 'test-common', 'publish-common'))



/**
 * Server build
 */
gulp.task('update-fluxgate-server', function (cb) {
 execCommand('gulp update-fluxgate-common', 'server', bufferSize, cb);
})

gulp.task('lint-server', function (cb) {
  execCommand('gulp tslint', 'server', bufferSize, cb);
})

gulp.task('really-clean-server', ['clean-server'], function (cb) {
    return del('server/node_modules');
})

gulp.task('clean-server', function (cb) {
  execCommand('gulp clean', 'server', bufferSize, cb);
})

gulp.task('build-server', function (cb) {
  execCommand('gulp', 'server', bufferSize, cb);
})

gulp.task('test-server', function (cb) {
  execCommand('gulp test', 'server', bufferSize, cb);
})

gulp.task('publish-server', function (cb) {
  execCommand('gulp publish -f', 'server', bufferSize, cb);
})

gulp.task('build-all-server', gulpSequence('clean-server', 'update-fluxgate-server', 'build-server', /*'test-server',*/ 'publish-server'))



/**
 * Client Tasks
 */
gulp.task('update-fluxgate-client', function (cb) {
 execCommand('gulp update-fluxgate-common', 'client', bufferSize, cb);
})

gulp.task('lint-client', function (cb) {
  execCommand('gulp tslint', 'client', bufferSize, cb);
})

gulp.task('really-clean-client', ['clean-client'], function (cb) {
    return del('client/node_modules');
})

gulp.task('clean-client', function (cb) {
  execCommand('gulp clean', 'client', bufferSize, cb);
})

gulp.task('test-client', function (cb) {
  execCommand('gulp test', 'client', bufferSize, cb);
})

gulp.task('build-client', function (cb) {
  execCommand('gulp', 'client', bufferSize, cb);
})

gulp.task('publish-client', function (cb) {
  execCommand('gulp publish -f', 'client', bufferSize, cb);
})

gulp.task('build-all-client', gulpSequence('clean-client', 'update-fluxgate-client', 'build-client', 'test-client', 'publish-client'))



/**
 * initiale Installation mittels npm
 */

gulp.task('install-common', function (cb) {
  execCommand('npm install', 'common', bufferSize, cb);
})

gulp.task('install-client', function (cb) {
  execCommand('npm install', 'client', bufferSize, cb);
})

gulp.task('install-server', function (cb) {
  execCommand('npm install', 'server', bufferSize, cb);
})


gulp.task('info', function () {
  console.log(line);
  console.log('Building with:')
  console.log(`  APP_ENV  = ${process.env.APP_ENV}`)
  console.log(`  NODE_ENV = ${process.env.NODE_ENV}`)
  console.log(line);
})


gulp.task('publish', ['publish-common', 'publish-client', 'publish-server'])
gulp.task('npm-install', ['install-common', 'install-client', 'install-server'])
gulp.task('lint', ['lint-common', 'lint-server', 'lint-client'])

gulp.task('clean', ['clean-common', 'clean-server', 'clean-client'], function(cb) {
  return del('dist');
})

gulp.task('really-clean', ['really-clean-common', 'really-clean-server', 'really-clean-client'], function (cb) {
    return del('node_modules');
})

gulp.task('update-fluxgate', ['update-fluxgate-client', 'update-fluxgate-server'])

gulp.task('build-all', gulpSequence('build-all-common', ['build-all-server', 'build-all-client']))

// gulp.task('build', gulpSequence('info', 'clean', 'build-common', 'build-server', 'build-client', 'publish'))

gulp.task('default', gulpSequence('build-all'))