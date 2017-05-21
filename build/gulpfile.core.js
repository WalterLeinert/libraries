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
// Start: core
//-----------------------------------------------------------------------
gulp.task('tslint:core', function (cb) {
  execCommand('gulp tslint', 'core', bufferSize, cb);
})

gulp.task('really-clean:core', ['clean:core'], function (cb) {
    return del('core/node_modules');
})

gulp.task('clean:core', function (cb) {
  execCommand('gulp clean', 'core', bufferSize, cb);
})

gulp.task('build:core', function (cb) {
  execCommand('gulp', 'core', bufferSize, cb);
})

gulp.task('test:core', function (cb) {
  execCommand('gulp test', 'core', bufferSize, cb);
})

gulp.task('publish:core', function (cb) {
  execCommand('gulp publish -f', 'core', bufferSize, cb);
})

gulp.task('doc:core', function (cb) {
  execCommand('gulp doc', 'core', bufferSize, cb);
})

gulp.task('build-all:core', gulpSequence('clean:core', 'build:core', 'test:core', 'publish:core'))
//-----------------------------------------------------------------------
// End: core
//-----------------------------------------------------------------------