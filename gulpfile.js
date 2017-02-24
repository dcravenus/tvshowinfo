var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var cleanCSS = require('gulp-clean-css');

var jsFiles = [
  'lib/*.js',
  //'index.js'
];
var jsDest = 'dist/scripts';

gulp.task('js', function() {
  return gulp.src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

gulp.task('index', function() {
  return gulp.src('index.html')
    .pipe(htmlreplace({
      js: 'scripts/scripts.js',
      css: 'styles/styles.css'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
  return gulp.src(['styles.css', 'lib/*.css', 'lib/font-awesome-4.6.3/css/font-awesome.min.css'])
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('fonts', function() {
  return gulp.src('lib/font-awesome-4.6.3/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy', function() {
  return gulp.src(['index.js', '*.ejs'])
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['index', 'js', 'css', 'fonts', 'copy']);