import {resolve} from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

/**
 * brew services start couchdb
 * brew services start couchdb
 * npm install -g add-cors-to-couchdb
 * add-cors-to-couchdb
 */
export default {
    devtool: 'inline-source-map',
    /*
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    */
    resolve: {

        modules: [
            resolve('./source'),
            'node_modules'
        ],
        alias: {
            'mapbox-gl$': resolve('node_modules/mapbox-gl/dist/mapbox-gl.js'),
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
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('.')],
                exclude: [/node_modules/],
                options: {
                    babelrc: false,
                    presets: ['env', 'react'],
                    plugins: ["transform-class-properties", "transform-decorators-legacy", "transform-object-rest-spread"],
                }
            },
            {
                test: /node_modules[\/\\]react-geocoder[\/\\].*\.js/,
                loader: 'babel-loader',
                query: { presets:['env', 'react'] }
            },
            {
                test: /node_modules\/JSONStream\/index\.js$/,
                loaders: ['shebang-loader', 'babel-loader'],
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