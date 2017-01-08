/**
 * Gulp Buildfile
 */

const gulp = require('gulp');
const del = require('del');
const gulpSequence = require('gulp-sequence');
const exec = require('child_process').exec;

const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const merge = require('merge2');
const mocha = require('gulp-mocha');
const tscConfig = require('./tsconfig.json');


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
 * Common build
 */
gulp.task('update-fluxgate-common', function (cb) {
    //execCommand('npm uninstall --save @fluxgate/common', 'common', null, cb);
    execCommand('npm uninstall --save @fluxgate/common && npm install --save @fluxgate/common', '.', null, cb);
})

gulp.task('really-clean', ['clean'], function (cb) {
    return del('node_modules');
})

// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del(['dist', 'build', 'lib', 'dts']);
})

/**
 * kompiliert den Server
 */
gulp.task('compile', function () {
    var tsResult = gulp
        .src('src/**/*.ts')
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(typescript(tscConfig.compilerOptions));

    return merge([
        tsResult.dts.pipe(
            gulp.dest('dts')
        ),
        tsResult.js.pipe(
            sourcemaps.write('.', {
                sourceRoot: ".",
                includeContent: true
            }))
            .pipe(gulp.dest('build/src')),
    ]);
})

//optional - use a tsconfig file
gulp.task('test', function () {
    //find test code - note use of 'base'
    return gulp.src('./test/**/*.spec.ts', { base: '.' })
        /*transpile*/
        .pipe(typescript(tscConfig.compilerOptions))
        /*flush to disk*/
        .pipe(gulp.dest('build'))
        /*execute tests*/
        .pipe(mocha({
            reporter: 'spec'
        }));
});


gulp.task('bundle', ['compile'], function (cb) {
    execCommand('webpack', '.', null, cb);
})


gulp.task('update-fluxgate', ['update-fluxgate-common'])

/* single command to hook into VS Code */
gulp.task('default', gulpSequence('clean', 'compile', /*'test',*/ 'bundle'));