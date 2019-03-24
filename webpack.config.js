/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const dotenv = require('dotenv');

const ENV_REGEX = /^REACT_APP_/;

dotenv.config();
const envKeys = Object.keys(process.env).filter(key => key.match(ENV_REGEX));

function NothingPlugin() {
    this.apply = function() {};
}

const config = (env) => ({
    entry: ['@babel/polyfill', './src/index.jsx'],
    output: {
        filename:  (env && env.NODE_ENV === 'production' 
                        ? '[name].[contenthash].js' 
                        : '[name].js'),
        path: path.resolve(__dirname, 'public')
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader',
            },
            {
                test: /\.css$/,
                exclude: /\.module\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.module\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                ],
            },
            {
                test: /\.(css|scss|sass)$/,
                exclude: /\.module\.(css|scss|sass)$/,
                use: [
                    (env && env.NODE_ENV === 'production'
                        ? MiniCssExtractPlugin.loader 
                        : 'style-loader'),
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.module\.(css|scss|sass)$/,
                use: [
                    (env && env.NODE_ENV === 'production'
                        ? MiniCssExtractPlugin.loader 
                        : 'style-loader'),
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: true,
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: [
            '.mjs',
            '.js',
            '.jsx'
        ],
    },
    devServer: {
        publicPath: '/',
        contentBase: './public',

    },
    plugins: [
        (env && env.NODE_ENV === 'production'
                        ? new MiniCssExtractPlugin({ 
                            chunkFilename: '[id].css',
                            filename: '[name].[contenthash].css' })
                        : new NothingPlugin()),
        (env && env.analyze 
            ? new BundleAnalyzerPlugin()
            : new NothingPlugin()),
        new HtmlWebpackPlugin({
            hash: true,
            cache: true,
            title: 'eight-river',
            template: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new webpack.EnvironmentPlugin(envKeys),
    ],
    devtool:
        (env && env.NODE_ENV === 'production' 
            ? 'source-map' 
            : 'cheap-module-eval-source-map'),
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    enforce: true,
                },
                styles: {
                    name: 'styles',
                    test: /\.(css|scss|sass)$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
});

module.exports = config;