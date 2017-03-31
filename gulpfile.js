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
gulp.task('update-fluxgate-common', function (cb) {
  //execCommand('npm uninstall --save @fluxgate/common', 'common', null, cb);
  execCommand('npm uninstall --save @fluxgate/common && npm install --save @fluxgate/common', 'common', null, cb);
})

gulp.task('lint-common', function (cb) {
  execCommand('gulp lint', 'common', null, cb);
})

gulp.task('really-clean-common', ['clean-common'], function (cb) {
    return del('common/node_modules');
})

gulp.task('clean-common', function (cb) {
  execCommand('gulp clean', 'common', null, cb);
})

gulp.task('build-common', function (cb) {
  execCommand('gulp', 'common', bufferSize, cb);
})

gulp.task('deploy-common', function (cb) {
  execCommand('gulp deploy', 'common', null, cb);
})


/**
 * Server build
 */
gulp.task('update-fluxgate-server', function (cb) {
  //execCommand('npm uninstall --save @fluxgate/common @fluxgate/server', 'server', null, cb);
  execCommand('npm uninstall --save @fluxgate/common @fluxgate/server && npm install --save @fluxgate/common @fluxgate/server', 'server', null, cb);
})

gulp.task('lint-server', function (cb) {
  execCommand('gulp lint', 'server', null, cb);
})

gulp.task('really-clean-server', ['clean-server'], function (cb) {
    return del('server/node_modules');
})

gulp.task('clean-server', function (cb) {
  execCommand('gulp clean', 'server', null, cb);
})

gulp.task('build-server', function (cb) {
  execCommand('gulp', 'server', bufferSize, cb);
})

gulp.task('run-server', function (cb) {
  execCommand('gulp run', 'server', bufferSize, cb);
})


/**
 * Client Tasks
 */
gulp.task('update-fluxgate-client', function (cb) {
  //execCommand('npm uninstall --save @fluxgate/common @fluxgate/client', 'client', null, cb);
  execCommand('npm uninstall --save @fluxgate/common @fluxgate/client && npm install --save @fluxgate/common @fluxgate/client', 'client', null, cb);
})

gulp.task('lint-client', function (cb) {
  execCommand('gulp lint', 'client', null, cb);
})

gulp.task('really-clean-client', ['clean-client'], function (cb) {
    return del('client/node_modules');
})

gulp.task('clean-client', function (cb) {
  execCommand('gulp clean', 'client', null, cb);
})

gulp.task('build-client', function (cb) {
  execCommand('gulp', 'client', bufferSize, cb);
})

gulp.task('run-client', function (cb) {
  execCommand('ng serve', 'client', bufferSize, cb);
})

gulp.task('deploy-client', function (cb) {
  execCommand('gulp deploy', 'client', null, cb);
}),



// clean the contents of the distribution directory
gulp.task('clean-deploy', function () {
  return del('dist');
});

let dist = 'server/dist/server/src/';
/*
gulp.task('deploy-server', function () {
  return gulp
    .copy('server/dist/server/src/**', 'dist');
})
*/



/**
 * initiale Installation mittels npm
 */

gulp.task('install-common', function (cb) {
  execCommand('npm install', 'common', null, cb);
})

gulp.task('install-client', function (cb) {
  execCommand('npm install', 'client', null, cb);
})

gulp.task('install-server', function (cb) {
  execCommand('npm install', 'server', null, cb);
})


gulp.task('info', function () {
  console.log(line);
  console.log('Building with:')
  console.log(`  APP_ENV  = ${process.env.APP_ENV}`)
  console.log(`  NODE_ENV = ${process.env.NODE_ENV}`)
  console.log(line);
})


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


gulp.task('client-tslint', function (cb) {
  execCommand('gulp tslint', 'client', null, cb);
})

gulp.task('tslint', ['client-tslint'], () => {
    return gulp.src([
      'common/src/**/*.ts',
      'server/src/**/*.ts',
      '!**/*.d.ts', '!node_modules/**'
      ])
      .pipe(gulp_tslint())
      .pipe(gulp_tslint.report());
});


gulp.task('update-fluxgate', ['update-fluxgate-common', 'update-fluxgate-client', 'update-fluxgate-server'])
gulp.task('npm-install', ['install-common', 'install-client', 'install-server'])
gulp.task('lint', ['lint-server', 'lint-client'])
gulp.task('clean', ['clean-common', 'clean-server', 'clean-client'], function(cb) {
  return del('dist');
})
gulp.task('really-clean', ['really-clean-common', 'really-clean-server', 'really-clean-client'], function (cb) {
    return del('node_modules');
})
gulp.task('build', gulpSequence('info', 'clean', 'build-common', 'build-server', 'build-client', 'deploy'))
gulp.task('deploy', gulpSequence('deploy-client', 'deploy-common'))
gulp.task('default', gulpSequence('build'))

//
// baut alles mit Deployment und startet den Server
//
gulp.task('run', gulpSequence('build', 'run-server'))
