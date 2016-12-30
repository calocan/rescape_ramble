/**
 * Created by Andy Likuski on 2016.08.02
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const webpack = require('webpack');

// File ops
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Folder ops
const CleanPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

// PostCSS support
const postcssImport = require('postcss-easy-import');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const postcssCustomMedia = require('postcss-custom-media');
const postcssCssVariables = require('postcss-css-variables');

// Constants
const APP = path.join(__dirname, 'app');
const DIST = path.join(__dirname, 'dist');
const STYLE = path.join(__dirname, 'app/style.css');
const PUBLIC = path.join(__dirname, 'app/public');
const TEMPLATE = path.join(__dirname, 'app/templates/index_default.html');

const PACKAGE = Object.keys(
    require('./package.json').dependencies
);

module.exports = {
    entry: {
        app: APP,
        style: STYLE
        //vendor: PACKAGE
    },
    resolve: {
        //extensions: ['', '.js', '.jsx']
    },
    output: {
        path: DIST,
        filename: '[name].[chunkhash].js',
        chunkFilename: '[chunkhash].js',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loaders: ['babel?cacheDirectory'],
                include: APP
            },
            // Extract CSS during build
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css!postcss'),
                include: APP
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                loader: 'file-loader?name=images/[name].[ext]',
                include: APP
            },
            {
                test: /\.(webm)$/,
                loader: 'file-loader?name=/videos/[name].[ext]',
                include: APP
            },
            {
                test: /\.(otf|eot|woff|woff2|ttf)$/,
                loader: 'file-loader?limit=30000&name=[name]-[hash].[ext]'
            },
            // Process JSON data fixtures
            {
                test: /\.json$/,
                loader: 'json',
                include: APP
            }
        ]
    },

    postcss: function processPostcss(webpack) {
        return [
            postcssImport({
                addDependencyTo: webpack
            }),
            postcssCustomMedia(),
            postcssCssVariables(),
            precss,
            autoprefixer({ browsers: ['last 2 versions'] })
        ];
    },

    // Remove comment if you require sourcemaps for your production code
    devtool: 'cheap-module-source-map',
    plugins: [
        // Required to inject NODE_ENV within React app.
        // Reduntant package.json script entry does not do that, but required for .babelrc
        // Optimizes React for use in production mode
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production') // eslint-disable-line quote-props
            }
        }),
        // Clean build directory
        new CleanPlugin([DIST]),
        new CopyWebpackPlugin([
                { from: PUBLIC, to: DIST }
            ],
            {
                ignore: [
                    // Doesn't copy Mac storage system files
                    '.DS_Store'
                ]
            }
        ),
        // Auto generate index.html
        new HtmlWebpackPlugin({
            template: TEMPLATE,
            // JS placed at the bottom of the body element
            inject: 'body',
            // Use html-minifier
            minify: {
                collapseWhitespace: true
            }
        }),

        // Extract CSS to a separate file
        new ExtractTextPlugin('[name].[chunkhash].css'),

        // Remove comment to dedupe duplicating dependencies for larger projects
        // new webpack.optimize.DedupePlugin(),

        // Separate vendor and manifest files
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),

        // Minify JavaScript
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
        // Error: vendor.450f275….js:16 Uncaught TypeError: Cannot read property 'shape' of undefined
        // Error: manifest.798b47f….js:1 Uncaught TypeError: Cannot read property 'call' of undefined
        // new webpack.optimize.OccurrenceOrderPlugin()
    ]
};
