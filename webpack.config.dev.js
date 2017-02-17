var path = require('path');
const {resolve} = require('path');
var webpack = require('webpack')

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    modules: [__dirname + '/source', 'node_modules'],
    alias: {
      'mapbox-gl$': path.join(__dirname, "/node_modules/mapbox-gl/dist/mapbox-gl.js"),
      // Ensure only one copy of react
      react: resolve('./node_modules/react'),
    },
  },
  entry: [
    './source/index'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/static/'
  },
  module: {
    noParse: /node_modules\/mapbox-gl\/dist\/mapbox-gl.js/,
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: path.join(__dirname, 'source'),
      query: {
        presets: ['es2015', 'stage-0', 'react']
      },
      exclude: /node_modules\/(?!mapbox-gl\/js)/,
    },
    {
       test: /\.json$/,
       loader: 'json-loader'
    }]
  },
   plugins: [
     new webpack.DefinePlugin({
       'process.env': {
         'NODE_ENV': JSON.stringify('development'),
       }
     })
   ]
};
