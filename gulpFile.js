"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-uglify');
var rename = require('gulp-rename');
var selfExecute = require('gulp-self-execute');

gulp.task('session', function () {
  return gulp.src(['atom-session-sdk/src/*class.js'])
    .pipe(concat('session.sdk.js'))
    .pipe(selfExecute())
    .pipe(gulp.dest('dist/'))
    .pipe(rename('session.sdk.min.js'))
    .pipe(minify())
    .pipe(gulp.dest('dist/'))
});

gulp.task('pixel', function () {
  return gulp.src(['atom-session-sdk/src/atom-pixel.js'])
    .pipe(concat('atom-pixel.sdk.js'))
    .pipe(selfExecute())
    .pipe(gulp.dest('dist/'))
    .pipe(rename({ extname: '.min.js' }))
    // .pipe(rename('session.sdk.min.js'))
    .pipe(minify())
    .pipe(gulp.dest('dist/'))
});


gulp.task('track', function () {
  return gulp.src(['atom-session-sdk/src/track.html'])
    .pipe(gulp.dest('dist/'))
});


gulp.task('default', ['session','pixel', 'track'], function () {});
