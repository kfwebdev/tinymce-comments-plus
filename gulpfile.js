'use strict';

var gulp = require( 'gulp' ),
    gutil = require( 'gulp-util' ),
    livereload = require( 'gulp-livereload' ),
    Server = require( 'karma' ).Server;


gulp.task( 'scripts', function () {
    gulp.src( './js/*.js' )
        .pipe( livereload() );

    gulp.src( './components/**/*.js' )
        .pipe( livereload() );

    gulp.src( './components/**/*.jsx' )
        .pipe( livereload() );

    gulp.src( './*.php' )
        .pipe( livereload() );

    gulp.src( './views/*.php' )
        .pipe( livereload() );
});


gulp.task( 'watch', function() {
    livereload.listen();
    gulp.watch( 'js/*.js', [ 'scripts' ] );
    gulp.watch( 'components/**/*.js', [ 'scripts' ] );
    gulp.watch( 'components/**/*.jsx', [ 'scripts' ] );
    gulp.watch( '*.php', [ 'scripts' ] );
    gulp.watch( 'views/*.php', [ 'scripts' ] );
});


// Testing Task
gulp.task( 'test', function ( done ) {
  new Server({
    configFile: __dirname + '/conf/karma.conf.js',
    singleRun: true
  }, done ).start();
});


// Default Task
gulp.task( 'default', [ 'watch' ] );
