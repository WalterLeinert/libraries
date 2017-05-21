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
// Start: platform
//-----------------------------------------------------------------------
gulp.task('tslint:platform', function (cb) {
  execCommand('gulp tslint', 'platform', bufferSize, cb);
  return stream;
})

gulp.task('really-clean:platform', ['clean:platform'], function (cb) {
    return del('platform/node_modules');
})

gulp.task('clean:platform', function (cb) {
  execCommand('gulp clean', 'platform', bufferSize, cb);
})

gulp.task('build:platform', function (cb) {
  execCommand('gulp', 'platform', bufferSize, cb);
})

gulp.task('test:platform', function (cb) {
  execCommand('gulp test', 'platform', bufferSize, cb);
})

gulp.task('publish:platform', function (cb) {
  execCommand('gulp publish -f', 'platform', bufferSize, cb);
})

gulp.task('doc:platform', function (cb) {
  execCommand('gulp doc', 'platform', bufferSize, cb);
})

gulp.task('build-all:platform', gulpSequence('clean:platform', 'update-fluxgate:platform', 'build:platform', 'test:platform', 'publish:platform'))
//-----------------------------------------------------------------------
// End: platform
//-----------------------------------------------------------------------

gulp.task('update-fluxgate:platform', function (cb) {
  execCommand('gulp update-fluxgate', 'platform', bufferSize, cb);
})