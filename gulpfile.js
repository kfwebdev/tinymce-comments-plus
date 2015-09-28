'use strict';

var gulp = require( 'gulp' ),
    gutil = require( 'gulp-util' ),
    Server = require( 'karma' ).Server;

// Testing Task
gulp.task( 'test', function ( done ) {
  new Server({
    configFile: __dirname + '/conf/karma.conf.js',
    singleRun: true
  }, done ).start();
});


// Default Task
gulp.task( 'default', [ 'test' ] );
