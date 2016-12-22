var gulp = require('gulp');
var ts = require('gulp-typescript');
var mocha = require('gulp-mocha');

gulp.task('build', function() {/*SNIP*/});

//optional - use a tsconfig file
var tsProject = ts.createProject('./tsconfig.json');
gulp.task('test', function() {
    //find test code - note use of 'base'
    return gulp.src('./test/**/*.spec.ts', { base: '.' })
    /*transpile*/
    .pipe(tsProject())
    /*flush to disk*/
    .pipe(gulp.dest('build'))
    /*execute tests*/
    .pipe(mocha({
        reporter: 'spec'
    }));
});
/* single command to hook into VS Code */
gulp.task('default', ['build','test']);