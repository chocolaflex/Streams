var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var cssmin = require('gulp-cssmin');


var paths = {
    site: './site/',
    scss: './site/css/',
    js: './site/js/',
    out:'./public/'
};
gulp.task('html', function () {
    gulp.src(`${paths.site}**/*.html`)
        .pipe(plumber())
        .pipe(gulp.dest(`${paths.out}`));
});

gulp.task('scss', function () {
    gulp.src(`${paths.scss}*.scss`)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(`${paths.out}css/`));
});

gulp.task('babel', function () {
    gulp.src([`${paths.js}**/*.js`, `!${paths.js}old/**/*.js`])
        .pipe(plumber())
        .pipe(babel())
        .pipe(gulp.dest(`${paths.out}js/`));
});
gulp.task('default', function () {
    let w_html = gulp.watch(`${paths.site}**/*.html`, ['html']);
    let w_sass = gulp.watch(`${paths.scss}*.scss`, ['scss']);
    let w_js = gulp.watch([`${paths.js}**/*.js`, `!${paths.js}old/**/*.js`], ['babel']);

    w_html.on('change', function (event) {
        console.log('HTML File ' + event.path + ' was ' + event.type + ', running task html...');
    });
    w_sass.on('change', function (event) {
        console.log('CSS File ' + event.path + ' was ' + event.type + ', running task sass...');
    });
    w_js.on('change', function (event) {
        console.log('es6 File ' + event.path + ' was ' + event.type + ', running task babel...');
    });
});