/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const uglify = require('gulp-uglify');

gulp.task('browserify', () => browserify({
    basedir: '.',
    debug: true,
    entries: ['demos/index.ts'],
    cache: {},
    packageCache: {},
})
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('demos/web/dist')));

gulp.task('minify', () => gulp.src('demos/web/dist/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('./demos/web/dist/min')));

gulp.task('examples', gulp.series('browserify', 'minify', (done) => done()));
