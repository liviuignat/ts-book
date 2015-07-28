var gulp = require('gulp');
var tslint = require('gulp-tslint');
var runner = require('karma').runner;
var KarmaServer = require('karma').Server;
var ts = require('gulp-typescript');
var browserify  = require('browserify');
var transform   = require('vinyl-transform');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');

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
gulp.task('bower', function() {
  return gulp.src([
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/q/q.js'
    ])
   .pipe(gulp.dest('./temp/source/vendor/'));
});

var browserified = transform(function(filename) {
  var b = browserify({ entries: filename, debug: true });
  return b.bundle();
});
gulp.task('bundle-js', function () {
  return gulp.src(['./temp/source/vendor/**/*.js', './temp/source/js/**/*.js'])
   .pipe(sourcemaps.init({ loadMaps: true }))
   //.pipe(uglify())
   .pipe(sourcemaps.write('./'))
   .pipe(gulp.dest('./dist/source/'));
});
gulp.task('bundle-test', function () {
  return gulp.src('./temp/test/**/**.test.js')
   .pipe(gulp.dest('./dist/test/'));
});
gulp.task('html', function () {
  return gulp.src('./index.html')
   .pipe(gulp.dest('./dist/source'));
});

gulp.task('karma', function(cb) {
  var conf = {
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['PhantomJS']
  };
  var done = function () {
    cb();
  };

  var server = new KarmaServer(conf, done);
  server.start();
});

gulp.task('watch', function () {
  gulp.watch([
    './source/**/*.ts',
    './test/**/*.ts'
  ], ['build']);
});

gulp.task('build', function(cb) {
  runSequence(
    'ts-lint',
    'tsc',
    'tsc-tests',
    'bower',
    ['bundle-js', 'html'],
    'karma', cb
  );
});

gulp.task('default', ['build', 'watch', 'browser-sync']);

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./dist/source"
    }
  });

  return gulp.watch([
    "./dist/**/**",
  ], [browserSync.reload]);
});
