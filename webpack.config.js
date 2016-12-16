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
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PUBLIC = __dirname + '/app/public';

const APP = __dirname + '/app';
const BUILD = __dirname + '/build';
const STYLE = __dirname + '/app/style.css';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const TEMPLATE = __dirname + '/app/templates/index_default.html'
const FONTS = __dirname + `/app/assets/fonts/[name].[ext]`;
const postcssImport = require('postcss-easy-import');
const postcssCustomMedia = require('postcss-custom-media');
const postcssCssVariables = require('postcss-css-variables');
const postcssCalc = require("postcss-calc")

var path = require('path');
var mainPath = path.resolve(__dirname, 'app', 'index.js');
// Note that the hex code here is the version of Sketchup's js code. It might need to be replaced
// with an updated version at some point by requested a model from 3d warehouse and copying the
// startup_*.js and compiled_*.js code that is returned
var sketchupStartupPath = path.resolve(__dirname, 'app', 'startup_b56fb52.js');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

module.exports = {
    node: {fs: "empty"},
    entry: {
        main: [
            // For hot style updates
            'webpack/hot/dev-server',

            // The script refreshing the browser on none hot updates
            'webpack-dev-server/client?http://localhost:8080',

            mainPath
        ],
        style: STYLE,
    },
    output: {
        path: BUILD,
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel?cacheDirectory'],
                include: APP
            }, {
                test: /\.css$/,
                loaders: ['style', 'css', 'postcss'],
                include: APP
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                loader: 'file-loader?name=/images/[name].[ext]',
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
            {
                test: /\.yaml$/,
                loader: 'file-loader?limit=30000&name=[name]-[hash].[ext]'
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
            postcssCalc(),
            precss,
            autoprefixer({ browsers: ['last 2 versions'] })
        ];
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        historyApiFallback: true,
        inline: true,
        progress: true,
        //stats: 'errors-only',
        'display-modules': true,
        host: HOST,
        port: PORT
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        new HtmlWebpackPlugin({
            template: TEMPLATE, inject: 'body'
        }),
        new webpack.HotModuleReplacementPlugin(),

        new CopyWebpackPlugin([
            {from: PUBLIC, to: BUILD}
        ], {
            ignore: [
                '.DS_Store'
            ]
        }),
    ],
};