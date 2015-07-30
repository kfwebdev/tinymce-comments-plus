'use strict';

var gulp = require( 'gulp' ),
    sass = require( 'gulp-sass' ),
    livereload = require( 'gulp-livereload' );

gulp.task( 'html', function () {
    gulp.src( './js/*.js' )
        .pipe( livereload() );
    gulp.src( './*.php' )
        .pipe( livereload() );
    gulp.src( './views/*.php' )
        .pipe( livereload() );
});

gulp.task( 'sass', function () {
    gulp.src( './sass/*.scss' )
        .pipe( sass().on( 'error', sass.logError ) )
        .pipe( gulp.dest( './css' ) )
        .pipe( livereload() );
});

gulp.task( 'watch', function() {
    livereload.listen();
    gulp.watch( 'js/*.js', [ 'html' ] );
    gulp.watch( '*.php', [ 'html' ] );
    gulp.watch( 'views/*.php', [ 'html' ] );
    gulp.watch( 'sass/*.scss', [ 'sass' ] );
});

// Default Task
gulp.task( 'default', [ 'sass', 'watch' ] );
