// karma.conf.js
module.exports = function( config ) {
  config.set({
    basePath: '',
    preprocessors: {
       '**/__tests__/*.js': [ 'browserify' ]
    },
    files: [
        '**/__tests__/*.js'
    ],
    frameworks: [ 'mocha', 'browserify' ],
    browsers: [ 'Chrome' ],
    logLevel: config.LOG_DEBUG,
    plugins: [
            'karma-mocha',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-browserify'
    ]
  });
};
