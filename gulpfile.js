/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const uglify = require('gulp-uglify');

const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('browserify', () => browserify({
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

gulp.task('default', gulp.series('browserify', 'minify', (done) => done()));

gulp.task('build', () => tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('build')));
