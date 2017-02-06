var path = require('path');
var webpack = require('webpack')

module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    root: __dirname + '/source'
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
      }
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
