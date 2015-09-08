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

// Testing Task
gulp.task( 'test', function ( done ) {
    var server =  new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    });

    server.on( 'browser_error', function ( browser, err ){
        gutil.log( 'Karma Run Failed: ' + err.message );
        throw err;
    });

    server.on( 'run_complete', function ( browsers, results ){
        if ( results.failed ) {
            throw new Error( 'Karma: Tests Failed' );
        }
        gutil.log( 'Karma Run Complete: No Failures' );
        done();
    });

    server.start();
});
