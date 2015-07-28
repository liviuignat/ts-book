module.exports = function (config) {
  'use strict';
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    browsers: ['Chrome'],
    reporters: ['progress', 'coverage'],
    plugins : [
      'karma-coverage',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher'
    ],
    preprocessors: {
      './temp/source/**/*.js' : ['coverage'],
      './temp/test/*.test.js' : ['coverage']
    },
    files: [
      // './bower_components/jquery/dist/jquery.min.js',
      // './bower_components/q/q.js',
      './temp/source/vendor/**/*.js',
      './temp/source/js/**/*.js',
      './temp/test/*.test.js'
    ],
    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: true
  });
};
