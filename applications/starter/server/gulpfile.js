/**
 * Gulp Buildfile für den Server
 */

const gulp = require('gulp');
const del = require('del');
const exec = require('child_process').exec;
const gulpSequence = require('gulp-sequence')
const tsc = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const merge = require('merge2');
const tslint = require('gulp-tslint');
// const nodemon = require('nodemon');
const tsProject = tsc.createProject('tsconfig.json');
// const tsSpecProject = tsc.createProject('tsconfig.spec.json');

const distPathClient = '../../../dist/starter';
const distPath = '../../../dist/starter-server';



/**
    * Hilfsfunktion zum Ausführen eines Kommandos (in gulp Skripts)
    *
    * command      - der Kommandostring (z.B. 'gulp clean')
    * cwd          - das Arbeitsverzeichnis (z.B. 'client')
    * maxBuffer    - die Größe des Puffers für Ausgaben
    * cb           - Callbackfunktion
    */
function execCommand(command, cwd, maxBuffer, cb) {
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
}

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del([distPath, 'dist'], { force: true });
});



/**
 * kompiliert den Server
 */
gulp.task('compile', function () {
  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject());

  const deployResult = gulp.src('package.json')
    .pipe(gulp.dest(distPath));

  return merge([
    tsResult.dts.pipe(gulp.dest(distPath + '/dts')),
    tsResult.js
      .pipe(sourcemaps.write('.')) // Now the sourcemaps are added to the .js file
      .pipe(gulp.dest(distPath + '/src')),
    deployResult
  ]);
});



/**
 * kopiert erforderliche Files
 */
gulp.task('copy-files', function () {
  //
  // für das dynamische laden der @fluxgate/server-Controller die Runtime-Umgebung
  // wie unter Docker erstellen
  //
  gulp
    .copy(distPathClient + '/**/*', distPath + '/app');

  gulp
    .copy('src/lib/config/**/*.*', distPath + '/src/lib/config');
})


gulp.task('tslint', () => {
  return gulp.src(['**/*.ts', '!**/*.d.ts', '!node_modules/**'])
    .pipe(tslint())
    .pipe(tslint.report());
});


/**
 * Startet den Server
 */
// gulp.task('run', function (cb) {
//   // execCommand('node server.js', 'dist/server/src', 1024 * 500, cb);
//   nodemon({
//     cwd: distPath + '/src',
//     script: 'server.js',
//     ext: 'js',
//     env: { 'NODE_ENV': 'local' }
//   })
// });


gulp.task('run-server', function (cb) {
  execCommand('node -r tsconfig-paths/register server.js', distPath + '/src', 1024 * 500, cb);
});

gulp.task('deploy', ['copy-files'])

gulp.task('test', ['default'], function () {
  console.warn('*** echte Tests aktivieren, sobald Tests existieren');
  // TODO: echte Tests aktivieren, sobald Tests existieren
});

gulp.task('update-fluxgate', function (cb) {
  execCommand('npm uninstall --save @fluxgate/core @fluxgate/platform @fluxgate/common @fluxgate/server && ' +
    'npm install --save @fluxgate/core @fluxgate/platform @fluxgate/common @fluxgate/server', '.', null, cb);
})


gulp.task('npm-install', function (cb) {
  execCommand('npm install', '.', null, cb);
})


gulp.task('build', gulpSequence('clean', 'compile', 'deploy'))
gulp.task('default', ['build'])