// karma.conf.js
module.exports = function( config ) {
  config.set({
    basePath: '',
    files: [ '**/*-test.js' ],
    frameworks: [ 'mocha' ],
    browsers: [ 'Chrome' ]
  });
};
