var gulp = require('gulp');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');
var browserify  = require('browserify');
var transform   = require('vinyl-transform');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var karma = require("gulp-karma");
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');


// gulp.task('default', ['ts-lint', 'tsc', 'tsc-tests', 'bundle-js', 'bundle-test'], function() {
// });
gulp.task('default', function(cb) {
  runSequence(
    'ts-lint',                      // lint
    ['tsc', 'tsc-tests'],        // compile
    ['bundle-js','bundle-test'], // optimize
    'karma',                      // test
    'browser-sync',              // serve
    cb                           // callback
  );
});


gulp.task('ts-lint', function() {
  return gulp.src([
   './source/ts/**/**.ts', './test/**/**.test.ts'
  ]).pipe(tslint())
    .pipe(tslint.report('verbose'));
});

var tsProject = ts.createProject({
    removeComments : true,
    noImplicitAny : true,
    target : 'ES3',
    module : 'commonjs',
    declarationFiles : false
});
gulp.task('tsc', function() {
  return gulp.src('./source/ts/**/**.ts')
   .pipe(ts(tsProject))
   .js.pipe(gulp.dest('./temp/source/js'));
});
gulp.task('tsc-tests', function() {
  return gulp.src('./test/**/**.test.ts')
   .pipe(ts(tsProject))
   .js.pipe(gulp.dest('./temp/test/'));
});

var browserified = transform(function(filename) {
  var b = browserify({ entries: filename, debug: true });
  return b.bundle();
});
gulp.task('bundle-js', function () {
  return gulp.src('./temp/source/js/main.js')
   .pipe(browserified)
   .pipe(sourcemaps.init({ loadMaps: true }))
   .pipe(uglify())
   .pipe(sourcemaps.write('./'))
   .pipe(gulp.dest('./dist/source/js/'));
});
gulp.task('bundle-test', function () {
  return gulp.src('./temp/test/**/**.test.js')
   .pipe(browserified)
   .pipe(gulp.dest('./dist/test/'));
});

gulp.task('karma', function(cb) {
  gulp.src('./temp/test/**/**.test.js')
    .pipe(plumber())
    .pipe(karma({
       configFile: './karma.conf.js',
       action: 'run'
     }))
     .on('end', cb);
});

gulp.task('browser-sync', ['test'], function() {
  browserSync({
    server: {
      baseDir: "./dist"
    }
  });

  return gulp.watch([
    "./dist/source/js/**/*.js",
    "./dist/source/css/**.css",
    "./dist/test/**/**.test.js",
    "./dist/data/**/**",
    "./index.html"
  ], [browserSync.reload]);
});
