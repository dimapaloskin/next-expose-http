const gulp = require('gulp');
const cache = require('gulp-cached');
const babel = require('gulp-babel');
const notify = require('gulp-notify');

const babelOptions = {
  presets: ['es2015'],
  plugins: [
    'transform-async-to-generator',
    'transform-object-rest-spread',
    'transform-runtime'
  ]
};

gulp.task('compile', [
  'compile-bin',
  'compile-utils'
]);

gulp.task('compile-bin', () => {

  return gulp.src('bin/*')
    .pipe(cache('bin'))
    .pipe(babel(babelOptions))
    .pipe(gulp.dest('dist/bin'))
    .pipe(notify('Bin compiled'));
});

gulp.task('compile-utils', () => {

  return gulp.src('utils/*')
    .pipe(cache('utils'))
    .pipe(babel(babelOptions))
    .pipe(gulp.dest('dist/utils'))
    .pipe(notify('Utils compiled'));
});
