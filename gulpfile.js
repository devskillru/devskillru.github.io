const { src, dest, parallel, series, watch } = require('gulp');
const spawn = require('child_process').spawn;
const bs = require('browser-sync').create();
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');

const path = {
  html: ['*.html', '_includes/*.html', '_layouts/*.html'],
  styles: '_sass/**/*.scss',
};

function build(done) {
  return spawn('jekyll', ['build'], {
    shell: true,
    stdio: 'inherit'
  }).on('close', done);
}

function browsersync() {
  bs.init({
    server: { baseDir: "_site" },
    port: 4000,
    ui: {
      port: 4001,
    },
    notify: false,
    online: true
  });
}

function styles() {
	return src([
    '_sass/main.scss'
  ])
	.pipe(sass())
	.pipe(concat('main.min.css'))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(cleancss( { level: { 1: { specialComments: 0 } } } ))
	.pipe(dest('css/'))
}

function watching() {
  watch(path.styles).on('change', series(styles, build, bs.reload));
  watch(path.html).on('change', series(build, bs.reload));
}

exports.build = build;
exports.browsersync = browsersync;
exports.styles = styles;
exports.default = series(styles, build, parallel(browsersync, watching));
