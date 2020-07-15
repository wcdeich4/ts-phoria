/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const uglify = require('gulp-uglify');

gulp.task('browserify', () => browserify({
    basedir: '.',
    debug: true,
    entries: ['src/demo.ts'],
    cache: {},
    packageCache: {},
})
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('docs/dist')));

gulp.task('minify', () => gulp.src('docs/dist/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('./docs/dist/min')));

gulp.task('examples', gulp.series('browserify', 'minify', (done) => done()));
