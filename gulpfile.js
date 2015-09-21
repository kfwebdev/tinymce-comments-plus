'use strict';

var gulp = require( 'gulp' ),
    gutil = require( 'gulp-util' ),
    sass = require( 'gulp-sass' ),
    babel = require('gulp-babel'),
    livereload = require( 'gulp-livereload' ),
    Server = require( 'karma' ).Server;


gulp.task( 'scripts', function () {
    gulp.src( './js/*.js' )
        .pipe( babel() )
        .pipe( livereload() );

    gulp.src( './components/**/*.js' )
        .pipe( babel() )
        .pipe( livereload() );

    gulp.src( './components/**/*.jsx' )
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
    gulp.watch( 'components/**/*.js', [ 'scripts' ] );
    gulp.watch( 'components/**/*.jsx', [ 'scripts' ] );
    gulp.watch( '*.php', [ 'scripts' ] );
    gulp.watch( 'views/*.php', [ 'scripts' ] );
    gulp.watch( 'sass/*.scss', [ 'sass' ] );
});


// Testing Task
gulp.task( 'test', function ( done ) {
  new Server({
    configFile: __dirname + '/conf/karma.conf.js',
    singleRun: true
  }, done ).start();
});


// Default Task
gulp.task( 'default', [ 'sass', 'watch' ] );
