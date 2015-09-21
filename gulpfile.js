'use strict';

var gulp = require( 'gulp' ),
    gutil = require( 'gulp-util' ),
    livereload = require( 'gulp-livereload' ),
    webpack = require( 'webpack' ),
    WebpackDevServer = require( 'webpack-dev-server' ),
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


// gulp.task( 'sass', function () {
//     gulp.src( './sass/*.scss' )
//         .pipe( sass().on( 'error', sass.logError ) )
//         .pipe( gulp.dest( './css' ) )
//         .pipe( livereload() );
// });


gulp.task( 'watch', function() {
    livereload.listen();
    gulp.watch( 'js/*.js', [ 'scripts' ] );
    gulp.watch( 'components/**/*.js', [ 'scripts' ] );
    gulp.watch( 'components/**/*.jsx', [ 'scripts' ] );
    gulp.watch( '*.php', [ 'scripts' ] );
    gulp.watch( 'views/*.php', [ 'scripts' ] );
});


gulp.task( 'webpack', function( callback ) {
   // run webpack
   webpack(
      require( './conf/webpack.config.js' ),
      null,
      function( err, stats ) {
           if ( err ) throw new gutil.PluginError( 'webpack', err );
           gutil.log( '[webpack]', stats.toString({
               // output options
      }));

      callback();
   });
});


gulp.task( 'webpack-dev-server', function( callback ) {
    // Start a webpack-dev-server
    var compiler = webpack({
        // configuration
    });

    new WebpackDevServer( compiler, {
        // server and middleware options
    }).listen( 8080, 'localhost', function( err ) {
        if ( err ) throw new gutil.PluginError( 'webpack-dev-server', err );
        // Server listening
        gutil.log( '[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html' );

        // keep the server alive or continue?
        // callback();
    });
});


// Testing Task
gulp.task( 'test', function ( done ) {
  new Server({
    configFile: __dirname + '/conf/karma.conf.js',
    singleRun: true
  }, done ).start();
});


// Default Task
gulp.task( 'default', [ 'webpack', 'watch' ] );
