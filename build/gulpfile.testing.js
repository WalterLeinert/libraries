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
// Start: client
//-----------------------------------------------------------------------
gulp.task('tslint:testing', function (cb) {
  execCommand('gulp tslint', 'client', bufferSize, cb);
})

gulp.task('really-clean:testing', ['clean:testing'], function (cb) {
    return del('client/node_modules');
})

gulp.task('clean:testing', function (cb) {
  execCommand('gulp clean', 'client', bufferSize, cb);
})

gulp.task('build:testing', function (cb) {
  execCommand('gulp', 'client', bufferSize, cb);
})

gulp.task('test:testing', function (cb) {
  execCommand('gulp test', 'client', bufferSize, cb);
})

gulp.task('publish:testing', function (cb) {
  execCommand('gulp publish -f', 'client', bufferSize, cb);
})

gulp.task('doc:testing', function (cb) {
  execCommand('gulp doc', 'client', bufferSize, cb);
})

gulp.task('build-all:testing', gulpSequence('clean:testing', 'build:testing', 'test:testing', 'publish:testing'))
//-----------------------------------------------------------------------
// End: client
//-----------------------------------------------------------------------

gulp.task('update-fluxgate:testing', function (cb) {
  execCommand('gulp update-fluxgate', 'client', bufferSize, cb);
})

gulp.task('update-fluxgate-yarn:testing', function (cb) {
  execCommand('gulp update-fluxgate-yarn', 'client', bufferSize, cb);
})