module.exports = function (config) {

  config.set({
    basePath: '',
    frameworks: ['mocha', 'browserify', 'sinon-chai'],
    client: {
      chai: {
        includeStack: true
      }
    },
    files: [
      'atom-session-sdk/test/pixel.e2e.js',
      'dist/*.sdk.js',
      'atom-session-sdk/test/*spec.js',
      'https://js-sdk.atom-data.io/1.5.0/sdk.js'
    ],
    exclude: [],
    preprocessors: {
      'atom-session-sdk/test/*e2e.js': ['browserify'],
      'dist/*.sdk.js': ['browserify'],
      'atom-session-sdk/test/*spec.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: [
        [
          'browserify-istanbul',
          {
            instrumenterConfig: {
              embedSource: true
            }
          }]
      ]
    },
    coverageReporter: {
      reporters: [
        {'type': 'text'},
        {'type': 'html', dir: 'coverage'},
        {'type': 'lcov'}
      ]
    },
    reporters: ['mocha', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: 'debug',
    browsers: ['PhantomJS'],
    autoWatch: false,
    singleRun: true
  })
};
