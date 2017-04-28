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
gulp.task('tslint:client', function (cb) {
  execCommand('gulp tslint', 'client', bufferSize, cb);
})

gulp.task('really-clean:client', ['clean:client'], function (cb) {
    return del('client/node_modules');
})

gulp.task('clean:client', function (cb) {
  execCommand('gulp clean', 'client', bufferSize, cb);
})

gulp.task('build:client', function (cb) {
  execCommand('gulp', 'client', bufferSize, cb);
})

gulp.task('test:client', function (cb) {
  execCommand('gulp test', 'client', bufferSize, cb);
})

gulp.task('publish:client', function (cb) {
  execCommand('gulp publish -f', 'client', bufferSize, cb);
})

gulp.task('doc:client', function (cb) {
  execCommand('gulp doc', 'client', bufferSize, cb);
})

gulp.task('build-all:client', gulpSequence('clean:client','update-fluxgate:client','build:client', 'test:client', 'publish:client'))
//-----------------------------------------------------------------------
// End: client
//-----------------------------------------------------------------------

gulp.task('update-fluxgate:client', function (cb) {
  execCommand('gulp update-fluxgate', 'client', bufferSize, cb);
})