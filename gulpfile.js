'use strict';

var gulp = require( 'gulp' ),
    sass = require( 'gulp-sass' ),
    babel = require( 'gulp-babel' ),
    livereload = require( 'gulp-livereload' );

gulp.task( 'html', function () {
    gulp.src( './views/*.php' )
        .pipe( livereload() );
});

gulp.task( 'sass', function () {
    gulp.src( './sass/*.scss' )
        .pipe( sass().on( 'error', sass.logError ) )
        .pipe( gulp.dest( './css' ) )
        .pipe( livereload() );
});

gulp.task( 'jsx', function () {
    gulp.src( './jsx/*.jsx' )
        .pipe( babel() )
        .pipe( gulp.dest( './js' ) )
        .pipe( livereload() );
});

gulp.task( 'watch', function() {
    livereload.listen();
    gulp.watch( '*.php', [ 'html' ] );
    gulp.watch( 'views/*.php', [ 'html' ] );
    gulp.watch( 'sass/*.scss', [ 'sass' ] );
    gulp.watch( 'jsx/*.jsx', [ 'jsx' ] );
});

// Default Task
gulp.task( 'default', [ 'sass', 'jsx', 'watch' ] );
