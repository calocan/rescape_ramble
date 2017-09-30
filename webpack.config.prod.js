const path = require('path');
const {resolve} = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        modules: [
            resolve('./src'),
            resolve('./node_modules')
        ],
        alias: {
            'mapbox-gl$': resolve('node_modules/mapbox-gl/dist/mapbox-gl.js'),
            // Ensure only one copy of react
            react: resolve('node_modules/react'),
        },
    },

    entry: [
        resolve('src/index')
    ],
    output: {
        path: resolve('build'),
        filename: 'index.js',
        publicPath: '/static/'
    },
    module: {
        noParse: /node_modules\/mapbox-gl\/dist\/mapbox-gl.js/,
        loaders: [
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
                })
            },

        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
            }
        })
    ]
};