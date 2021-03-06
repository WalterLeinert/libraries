const gulp = require('gulp');
const gulp_tslint = require('gulp-tslint');
const del = require('del');
const gulpSequence = require('gulp-sequence');
const argv = require('yargs').argv;
const exec = require('child_process').exec;

const line = '------------------------------------------------------------';
const bufferSize = 4096 * 500;

//-----------------------------------------------------------------------
// Start: Utilities
//-----------------------------------------------------------------------
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
//-----------------------------------------------------------------------
// End: Utilities
//-----------------------------------------------------------------------


//-----------------------------------------------------------------------
// Start: common
//-----------------------------------------------------------------------
gulp.task('tslint:common', function (cb) {
  execCommand('gulp tslint', 'common', bufferSize, cb);
})

gulp.task('really-clean:common', ['clean:common'], function (cb) {
    return del('common/node_modules');
})

gulp.task('clean:common', function (cb) {
  execCommand('gulp clean', 'common', bufferSize, cb);
})

gulp.task('build:common', function (cb) {
  execCommand('gulp', 'common', bufferSize, cb);
})

gulp.task('test:common', function (cb) {
  execCommand('gulp test', 'common', bufferSize, cb);
})

gulp.task('publish:common', function (cb) {
  execCommand('gulp publish -f', 'common', bufferSize, cb);
})

gulp.task('doc:common', function (cb) {
  execCommand('gulp doc', 'common', bufferSize, cb);
})

gulp.task('build-all:common', gulpSequence('clean:common', 'build:common', 'test:common', 'publish:common'))
//-----------------------------------------------------------------------
// End: common
//-----------------------------------------------------------------------

gulp.task('update-fluxgate:common', function (cb) {
  execCommand('gulp update-fluxgate', 'common', bufferSize, cb);
})

gulp.task('update-fluxgate-yarn:common', function (cb) {
  execCommand('gulp update-fluxgate-yarn', 'common', bufferSize, cb);
})