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

gulp.task('update', function() {
  gulp.watch(path.ALL, ['transform', 'copy']);
});

gulp.task('build', function() {
  gulp.src(path.JS)
    .pipe(react())
    .pipe(concat(path.MINIFIED_OUT))
    .pipe(minifier({}, uglify))
    .pipe(gulp.des(path.DEST_BUILD));
});

gulp.task('replaceHTML', function() {
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js':'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});
gulp.task('default', ['update']);
gulp.task('production', ['replaceHTML', 'build']);