// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

module.exports = {
  entry: {
    app: resolve('source/app.js')
  },

  devtool: 'source-map',

  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('.')],
      exclude: [/node_modules/],
      options: {
        babelrc: false,
        presets: ['env', 'react'],
        plugins: ["transform-class-properties", "transform-decorators-legacy"]
      }
    }]
  },

  resolve: {
    modules: [
      resolve("source"), 'node_modules',
    ],
    alias: {
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },
};
