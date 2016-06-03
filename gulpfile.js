var fs = require('fs');
var gulp = require('gulp'); // https://github.com/gulpjs/gulp
var moment = require('moment'); // https://github.com/moment/moment/
var clc = require('cli-color'); // https://github.com/medikoo/cli-color
var rename = require('gulp-rename'); // https://github.com/hparra/gulp-rename
var sourcemaps = require('gulp-sourcemaps'); // https://github.com/floridoo/gulp-sourcemaps
var gulpif = require('gulp-if'); // https://github.com/robrich/gulp-if

var production = (process.env.NODE_ENV === 'production');

gulp.task('default', ['move', 'pug', 'sass', 'react']);



/*====================================
=            Browser Sync            =
====================================*/

var browserSync = require('browser-sync').create(); // https://github.com/Browsersync/browser-sync
var reload = browserSync.reload;

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
});

gulp.task('watch', ['pug:watch', 'sass:watch', 'react:watch', 'browser-sync']);



/*============================
=            Move            =
============================*/

var cssmin = require('gulp-cssmin'); // https://github.com/chilijung/gulp-cssmin
var uglify = require('gulp-uglify'); // https://github.com/terinjokes/gulp-uglify
var concat = require('gulp-concat'); // https://github.com/contra/gulp-concat

gulp.task('move', function() {
	gulp.src([
			'./bower_components/skeleton/css/normalize.css',
			'./bower_components/skeleton/css/skeleton.css',
		])
		.pipe(concat('lib.min.css'))
		.pipe(cssmin())
		.pipe(gulp.dest('./public/css/'));

	gulp.src([
			'./node_modules/jquery/dist/jquery.min.js',
			'./bower_components/color-thief/dist/color-thief.min.js',
		])
		.pipe(concat('lib.min.js'))
		.pipe(uglify({ mangle: false }))
		.pipe(gulp.dest('./public/js/'));
});



/*===========================
=            Pug            =
===========================*/

var pug = require('gulp-pug'); // https://github.com/jamen/gulp-pug

gulp.task('pug', function() {
	gulp.src('./src/views/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('./'));
});

gulp.task('pug:watch', ['pug'], function() {
	gulp.watch('./src/views/**/*.pug', ['pug', reload]);
});



/*============================
=            Sass            =
============================*/

'use strict';

var sass = require('gulp-sass'); // https://github.com/dlmanning/gulp-sass

gulp.task('sass', function() {
	gulp.src('./src/styles/*.scss')
		.pipe(gulpif(production, sourcemaps.init()))
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(gulpif(production, sourcemaps.write()))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./public/css/'));
});

gulp.task('sass:watch', ['sass'], function() {
	gulp.watch('./src/styles/**/*.scss', ['sass', reload]);
});



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

gulp.task('react', function() {
	bundle();
});

gulp.task('react:watch', ['react'], function() {
	b.plugin(watchify);
	b.on('log', function(msg) {
		colorLog('yellowBright', msg);
		reload();
	});
	b.on('update', bundle);
});

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
