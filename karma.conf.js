// karma.conf.js
module.exports = function( config ) {
  config.set({
    basePath: '',
    files: [
        'js/*-test.js'
    ],
    frameworks: [ 'mocha' ],
    browsers: [ 'Chrome' ],
    logLevel: config.LOG_DEBUG
  });
};
