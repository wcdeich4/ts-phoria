const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');

const uglify = require('gulp-uglify');

gulp.task('build', () => browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {},
})
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist')));

gulp.task('minify', () => gulp.src('dist/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/min')));

gulp.task('default', gulp.series('build', 'minify', (done) => done()));
