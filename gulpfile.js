var gulp = require('gulp');
var sass = require('gulp-sass');
var path = require('path');
var autoprefixer = require('gulp-autoprefixer');
const jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var pump = require('pump');
var browserSync = require('browser-sync').create();

///////// Compile SASS
gulp.task('sass', function () {
  return gulp.src('./assets/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: [
            'last 2 versions',
        ],
        cascade: false
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

// create a task that ensures the `less` task is complete before
// reloading browsers
gulp.task('sass-watch', ['sass'], function (done) {
    browserSync.reload();
    done();
});


//// JavaScript

//jslint and uglify
gulp.task('js', function (cb) {
    pump([
          gulp.src('./assets/js/*.js'),
          jshint(),
          jshint.reporter('default'),
          uglify(),
          gulp.dest('./js'),
          browserSync.stream()
      ],
      cb
    );
  });

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});



// Live Server with Browser Sync
// Static Server + watching less/js/html files
gulp.task('serve', ['sass-watch'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./assets/sass/*.scss", ['sass-watch']);
    gulp.watch("./assets/js/*.js", ["js-watch"]);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

// Default task
gulp.task('default', ['serve']);