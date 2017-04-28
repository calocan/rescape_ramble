import {resolve} from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
    devtool: 'inline-source-map',

    resolve: {
        modules: [
            resolve('./source'),
            resolve('./node_modules')
        ],
        alias: {
            'mapbox-gl$': resolve('node_modules/mapbox-gl/dist/mapbox-gl.js'),
            //'webworkify': 'webworkify-webpack',
            // Ensure only one copy of react
            react: resolve('node_modules/react'),
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
        noParse: /node_modules\/mapbox-gl\/dist\/mapbox-gl.js/,
        loaders: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader'
                }],
                exclude: /node_modules\/(?!mapbox-gl\/js)/
            },
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