import {resolve} from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
    devtool: 'source-map',

    resolve: {
        modules: [
            resolve('./source'),
            resolve('./node_modules')
        ],
        alias: {
            'mapbox-gl$': resolve('node_modules/mapbox-gl/dist/mapbox-gl.js'),
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
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            "react",
                            ["es2015", {"modules": false}]
                        ],
                        plugins: [
                            "transform-flow-strip-types"
                        ],

                    }
                }],
                exclude: /node_modules\/(?!mapbox-gl\/js)/
            },
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
    ],
    externals: {
        'react/addons': 'react',
        'react/lib/ExecutionEnvironment': 'react',
        'react/lib/ReactContext': 'react'
    }
};