// karma.conf.js
module.exports = function( config ) {
  config.set({
    basePath: '',
    preprocessors: {
       'js/*-test.js': [ 'browserify' ]
    },
    files: [
        'js/*-test.js'
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
