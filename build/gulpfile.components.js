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
// Start: components
//-----------------------------------------------------------------------
gulp.task('tslint:components', function (cb) {
  execCommand('gulp tslint', 'components', bufferSize, cb);
})

gulp.task('really-clean:components', ['clean:components'], function (cb) {
    return del('components/node_modules');
})

gulp.task('clean:components', function (cb) {
  execCommand('gulp clean', 'components', bufferSize, cb);
})

gulp.task('build:components', function (cb) {
  execCommand('gulp', 'components', bufferSize, cb);
})

gulp.task('test:components', function (cb) {
  execCommand('gulp test', 'components', bufferSize, cb);
})

gulp.task('publish:components', function (cb) {
  execCommand('gulp publish -f', 'components', bufferSize, cb);
})

gulp.task('doc:components', function (cb) {
  execCommand('gulp doc', 'components', bufferSize, cb);
})

gulp.task('build-all:components', gulpSequence('clean:components','update-fluxgate:components','build:components', 'test:components', 'publish:components'))
//-----------------------------------------------------------------------
// End: components
//-----------------------------------------------------------------------

gulp.task('update-fluxgate:components', function (cb) {
  execCommand('gulp update-fluxgate', 'components', bufferSize, cb);
})