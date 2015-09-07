'use strict';

var gulp = require( 'gulp' ),
    sass = require( 'gulp-sass' ),
    babel = require('gulp-babel'),
    livereload = require( 'gulp-livereload' );

gulp.task( 'scripts', function () {
    gulp.src( './js/*.js' )
        .pipe( babel() )
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
    gulp.watch( 'js/*.js', [ 'scripts' ] );
    gulp.watch( '*.php', [ 'scripts' ] );
    gulp.watch( 'views/*.php', [ 'scripts' ] );
    gulp.watch( 'sass/*.scss', [ 'sass' ] );
});

// Default Task
gulp.task( 'default', [ 'sass', 'watch' ] );
