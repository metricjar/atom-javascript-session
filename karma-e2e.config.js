// module.exports = function(config) {
//
//   config.set({
//     basePath: '',
//     frameworks: ['mocha','browserify', 'sinon-chai'],
//     client: {
//       chai: {
//         includeStack: true
//       }
//     },
//     files: [
//       'dist/*.sdk.js',
//       'atom-session-sdk/test/*.e2e.js'
//     ],
//     exclude: [
//     ],
//     preprocessors: {
//       'dist/*.sdk.js': ['browserify'],
//       'atom-session-sdk/test/*.e2e.js': ['browserify']
//     },
//     browserify: {
//       debug: true
//     },
//     reporters: ['mocha'],
//     port: 9876,
//     colors: true,
//     logLevel: 'debug',
//     browsers: ['PhantomJS'],
//     autoWatch: false,
//     singleRun: true
//   })
// };
