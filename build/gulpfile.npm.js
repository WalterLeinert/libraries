const gulp = require('gulp');
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

gulp.task('install:core', function (cb) {
  execCommand('npm install', 'core', bufferSize, cb);
})

gulp.task('install:platform', function (cb) {
  execCommand('npm install', 'platform', bufferSize, cb);
})

gulp.task('install:common', function (cb) {
  execCommand('npm install', 'common', bufferSize, cb);
})

gulp.task('install:client', function (cb) {
  execCommand('npm install', 'client', bufferSize, cb);
})

gulp.task('install:components', function (cb) {
  execCommand('npm install', 'components', bufferSize, cb);
})

gulp.task('install:server', function (cb) {
  execCommand('npm install', 'server', bufferSize, cb);
})