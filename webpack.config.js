const resolve = require('path').resolve;
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * brew services start couchdb
 * brew services start couchdb
 * npm install -g add-cors-to-couchdb
 * add-cors-to-couchdb
 */
module.exports = {
    devtool: 'inline-source-map',
    resolve: {

        modules: [
            resolve('./source'),
            'node_modules'
        ],
        alias: {
            'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
            //'webworkify': 'webworkify-webpack'
        },
    },

    entry: [
        resolve('source/index')
    ],

    output: {
        path: resolve('build'),
        filename: 'index.js',
        publicPath: '/static/'
    },
    module: {
        noParse: /(mapbox-gl)\.js$/,
        loaders: [
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
                })
            },

        ]
    },
    node: {
        fs: 'empty',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
            }
        }),
        new ExtractTextPlugin( "bundle.css" )
    ],
    externals: {
        'react/addons': 'react',
        'react/lib/ExecutionEnvironment': 'react',
        'react/lib/ReactContext': 'react'
    }
};