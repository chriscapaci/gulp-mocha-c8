var gulp = require('gulp');
var eslint = require('gulp-eslint');
var ava = require('gulp-ava');
var fs = require('fs');
var runSequence = require('run-sequence');

const pkg = JSON.parse(fs.readFileSync('./package.json'));

gulp.task('lint', function () {
    return gulp.src('./lib/*.js')
        .pipe(eslint(pkg.eslintConfig))
        .pipe(eslint.format('stylish'))
        .pipe(eslint.failAfterError());
});

gulp.task('test-tests', function () {
    return gulp.src(['./test/test.js'])
        .pipe(ava());
});

gulp.task('test', gulp.series('test-tests'));
