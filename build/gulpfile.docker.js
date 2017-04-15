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


//-----------------------------------------------------------------------
// Start: Docker build, up, down
//-----------------------------------------------------------------------

gulp.task('docker-build', function (cb) {
  // Hinweis: das Environment spielt für den build keine große Rolle, entsprechende Files
  // (wie .docker/env/app.development.env) müssen nur existieren
  //
  // Bei docker-up wird das Environment sehr wohl ausgewertet und definiert, womit die Container laufen!
  const env = 'development'

  let buildEnv = {
        APP_ENV: env,
        NODE_ENV: env,
  }
  console.log('using environment: ', buildEnv)

  exec('docker-compose build',
    {
      cwd: '.',
      maxBuffer: bufferSize,
      env: buildEnv,
    }, function (err, stdout, stderr) {
      console.log(stdout);
      console.error(stderr);
      cb(err);
    });
})

/**
 * Docker up ausführen für das angegebene Environment
 */
gulp.task('docker-up', function (cb) {
  const env = argv.env ? argv.env : 'development';
  const detached = argv.d ? argv.d : '';

  let buildEnv = {
        APP_ENV: env,
        NODE_ENV: env,
  }
  console.log('using environment: ', buildEnv)

  let upSwitch = '';
  if (detached) {
    upSwitch = '-d';
  }

  exec('docker-compose up ' + upSwitch,
    {
      cwd: '.',
      maxBuffer: bufferSize,
      env: buildEnv,
    }, function (err, stdout, stderr) {
      console.log(stdout);
      console.error(stderr);
      cb(err);
    });
})
//-----------------------------------------------------------------------
// End: Docker
//-----------------------------------------------------------------------