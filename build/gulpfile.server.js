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
// Start: server
//-----------------------------------------------------------------------
gulp.task('tslint:server', function (cb) {
  execCommand('gulp tslint', 'server', bufferSize, cb);
})

gulp.task('really-clean:server', ['clean:server'], function (cb) {
    return del('server/node_modules');
})

gulp.task('clean:server', function (cb) {
  execCommand('gulp clean', 'server', bufferSize, cb);
})

gulp.task('build:server', function (cb) {
  execCommand('gulp', 'server', bufferSize, cb);
})

gulp.task('test:server', function (cb) {
  execCommand('gulp test', 'server', bufferSize, cb);
})

gulp.task('publish:server', function (cb) {
  execCommand('gulp publish -f', 'server', bufferSize, cb);
})

gulp.task('doc:server', function (cb) {
  execCommand('gulp doc', 'server', bufferSize, cb);
})

gulp.task('build-all:server', gulpSequence('clean:server', 'update-fluxgate:server', 'build:server', 'test:server', 'publish:server'))
//-----------------------------------------------------------------------
// End: server
//-----------------------------------------------------------------------

gulp.task('update-fluxgate:server', function (cb) {
  execCommand('gulp update-fluxgate', 'server', bufferSize, cb);
})

gulp.task('update-fluxgate-yarn:server', function (cb) {
  execCommand('gulp update-fluxgate-yarn', 'server', bufferSize, cb);
})