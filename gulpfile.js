var fs = require('fs');
var gulp = require('gulp'); // https://github.com/gulpjs/gulp
var moment = require('moment'); // https://github.com/moment/moment/
var clc = require('cli-color'); // https://github.com/medikoo/cli-color
var rename = require('gulp-rename'); // https://github.com/hparra/gulp-rename
var sourcemaps = require('gulp-sourcemaps'); // https://github.com/floridoo/gulp-sourcemaps
var gulpif = require('gulp-if'); // https://github.com/robrich/gulp-if

var production = (process.env.NODE_ENV === 'production');

gulp.task('default', []);



/*====================================
=            Browser Sync            =
====================================*/

var browserSync = require('browser-sync').create(); // https://github.com/Browsersync/browser-sync
var reload = browserSync.reload;

gulp.task('watch', []);



/*============================
=            Move            =
============================*/

var cssmin = require('gulp-cssmin'); // https://github.com/chilijung/gulp-cssmin
var uglify = require('gulp-uglify'); // https://github.com/terinjokes/gulp-uglify
var concat = require('gulp-concat'); // https://github.com/contra/gulp-concat

gulp.task('move', function() {});



/*===========================
=            Pug            =
===========================*/

var pug = require('gulp-pug'); // https://github.com/jamen/gulp-pug

gulp.task('pug', function() {});

gulp.task('pug:watch', ['pug'], function() {});



/*============================
=            Sass            =
============================*/

'use strict';

var sass = require('gulp-sass'); // https://github.com/dlmanning/gulp-sass

gulp.task('sass', function() {});

gulp.task('sass:watch', ['sass'], function() {});



/*=============================
=            React            =
=============================*/

var browserify = require('browserify'); // https://github.com/substack/node-browserify
var watchify = require('watchify'); // https://github.com/substack/watchify
var source = require('vinyl-source-stream'); // https://github.com/hughsk/vinyl-source-stream
var buffer = require('vinyl-buffer'); // https://github.com/hughsk/vinyl-buffer
var reactify = require('reactify'); // https://github.com/andreypopp/reactify

var b = browserify('./src/scripts/main.jsx', {
	cache: {},
	packageCache: {},
	debug: !production,
	transform: [reactify]
});

gulp.task('react', function() {});

gulp.task('react:watch', ['react'], function() {});

function bundle() {
	b.bundle()
		.on('error', errorLog)
		.pipe(source('main.min.js'))
		.pipe(buffer())
		.pipe(gulpif(production, uglify()))
		.on('error', errorLog)
		.pipe(gulp.dest('./public/js/'));
}



/*===============================
=            Utility            =
===============================*/

function colorLog(color, message) {
	console.log('[%s] %s',
		clc.blackBright(moment().format('HH:mm:ss')),
		clc[color](message)
	);
}

function errorLog(err) {
	colorLog('redBright', err.stack);
}
