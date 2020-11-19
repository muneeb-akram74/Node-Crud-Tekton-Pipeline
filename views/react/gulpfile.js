var gulp = require('gulp');
var browserSync = require('browser-sync').create();
// if using less than Gulp 4, npm install run-sequence then
// var runSequence = require('run-sequence');

var less = 
    require('gulp-less');
var sass = 
  require('gulp-sass');
var path = require('path');
var minifyCSS = 
    require('gulp-csso');
var concat =
    require('gulp-concat');
var uglify =
    require('gulp-uglify');
var sourcemaps =
    require('gulp-sourcemaps');
const autoClose = require('browser-sync-close-hook');

gulp.task('css', function(){
  return gulp.src(
    'src/*.less'
  )
  .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
  }))
  // .pipe(minifyCSS())
  .pipe(gulp.dest(
    '.'
  ))
  .pipe(browserSync.stream());
});

gulp.task('sass', function(){
  return gulp.src(
    'src/*.scss'
  )
  .pipe(sass({
    paths: [ path.join(__dirname, 'scss', 'includes') ]
  }))
  // .pipe(minifyCSS())
  .pipe(gulp.dest(
    '.'
  ))
  .pipe(browserSync.stream());
  // .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function(done){
  return gulp.src(
    'src/*.js'
  )
  //.pipe(sourcemaps.init())
  .pipe(concat(
      'app.min.js'
  ))
  //.pipe(uglify())
  //.pipe(sourcemaps.write())
  .pipe(gulp.dest(
    'build/js/src'
  ));

  // done();
});

// Static Server + watching scss/html files
// gulp.task('serve', ['css'], function() {
gulp.task('serve', function(done) {
  browserSync.use({
    plugin() {},
    hooks: {
      'client:js': autoClose, // <-- important part
    },
  });
  
  browserSync.init({
    open: false,
    // open: "tunnel",
    reloadOnRestart: true,
    // server: ".",
    // or
    // proxy: 'yourserver.dev'
    // This accommodates the existing NodeJS setup
    proxy: "localhost:8080/react/slate/123"
  });

  gulp.watch("lib/css/*.css");
  // gulp.watch("*.html").on('change', browserSync.reload);
  gulp.watch(["*.html", ".js"]).on('change', browserSync.reload);
  done();
});

gulp.task('default',
  // , 'css'
  // , 'sass'
  gulp.series('js', 'serve', function (done) {
      console.log('task after task array');
      done();
  }),
  function(done) {
    console.log('default task');
    // if using less than Gulp 4, npm install run-sequence then
    // runSequence('js', callback);
    done();
  }
);

// error: Task function must be specified
// gulp.task('watch', ['watch'], function() {
gulp.task('watch', function() {
  gulp.watch("lib/css/*.css");
  // gulp.watch("*.html").on('change', browserSync.reload);
  gulp.watch(["*.html", ".js", ".css"]).on('change', browserSync.reload);
});

// var gulp = require('gulp');

// gulp.task('default', function() {
//     // place code for your default task here
// });
