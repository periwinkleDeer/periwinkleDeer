var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');

var path = {
  HTML: 'client/index.html',
  CSS: 'client/style.css',
  ASSETS: ['client/assets/*.jpg', 'client/assets/*.png'],
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'dist',
  DEST_BUILD: 'dist/build',
  DEST_SRC: 'dist/src',
  DEST_ASSETS: 'dist/assets',
  ENTRY_POINT: './client/js/App.js'
};

gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});

gulp.task('copyCSS', function() {
  gulp.src(path.CSS)
    .pipe(gulp.dest(path.DEST));
});

gulp.task('copyASSETS', function() {
  gulp.src(path.ASSETS)
    .pipe(gulp.dest(path.DEST_ASSETS));
})

gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});
gulp.task('watch', function() {
  gulp.watch(path.HTML, ['copy']);
  gulp.watch(path.CSS, ['copyCSS']);
  gulp.watch(path.ASSETS, ['copyASSETS']);

  var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC));
      console.log('Updated');
  })
    .bundle().on('error', function(err) {
      console.log(err.message);
      this.end();
    })
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('build', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
  })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(path.DEST_BUILD));
});



gulp.task('production', ['replaceHTML', 'build']);

gulp.task('default', ['copy', 'copyCSS', 'copyASSETS', 'watch']);