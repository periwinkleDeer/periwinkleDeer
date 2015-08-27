var gulp = require('gulp');
var concat = require('gulp-concat');
var minifier = require('gulp-uglify/minifier');
var uglify = require('uglify-js');
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');

var path = {
  HTML: 'client/index.html',
  ALL: ['client/js/*.js', 'src/index.html'],
  JS: ['client/js/*.js'],
  MINIFIED_OUT: 'build.min.js',
  DEST_SRC: 'dist/src',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

gulp.task('transform', function() {
  gulp.src(path.JS)
    .pipe(react())
    .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('copy', function() {
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});

gulp.task('build', function() {
  gulp.src(path.JS)
    .pipe(react())
    .pipe(concat(path.MINIFIED_OUT))
    .pipe(minifier({}, uglify))
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('update', function() {
  gulp.watch(path.ALL, ['transform', 'copy', 'build']);
});

gulp.task('production', ['transform', 'copy', 'build']);
gulp.task('default', ['update', 'transform', 'copy', 'build']);