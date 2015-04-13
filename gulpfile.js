const gulp = require('gulp');
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');
const jshintStylish = require('jshint-stylish');
const mocha = require('gulp-mocha');
const cached = require('gulp-cached');
const istanbul = require('gulp-istanbul');
const coveralls = require('gulp-coveralls');
const allJS = [
  'src/**/*.js',
  'tests/**/*.js'
];

// LINTING
gulp.task('jshint', function() {
  return gulp.src(allJS)
    .pipe(cached('jshint'))
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStylish));
});

gulp.task('jscs', function() {
  return gulp.src(allJS)
    .pipe(cached('jscs'))
    .pipe(jscs());
});

gulp.task('watch', function() {
  gulp.watch(allJS, ['lint']);
});

gulp.task('lint', ['jshint', 'jscs']);

// TESTS
gulp.task('run-tests', ['lint'], function(done) {
  var options = {
    reporter: 'dot',
    bail: true
  };

  gulp.src('src/**/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src('tests', {read: false})
        .pipe(mocha(options))
        .pipe(istanbul.writeReports())
        .on('end', done);
    });
});

gulp.task('watch-tests', ['run-tests'], function() {
  gulp.watch(allJS, ['run-tests']);
});

gulp.task('submit-tests-coverage', ['run-tests'], function() {
  return gulp.src('coverage/**/lcov.info')
    .pipe(coveralls());
});

gulp.task('test', ['watch-tests']);

// DEFAULT
gulp.task('default', ['lint', 'watch']);
