const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin  = require('eslint-webpack-plugin');
const HTMLBundlerPlugin = require('html-bundler-webpack-plugin');
const dev = process.env.NODE_ENV === 'dev';

let cssLoaders = [
    "css-loader",
    "postcss-loader",
    "sass-loader",
]

let config = {
    mode: dev ? 'development' : 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    resolve: {
        alias: {
            '@styles': path.join(__dirname, 'src/assets/scss'),
            '@scripts': path.join(__dirname, 'src/assets/js'),
            '@images': path.join(__dirname, 'src/assets/images'),
        }
    },
    plugins: [
        new CleanWebpackPlugin({verbose: true}),
        new ESLintPlugin(),
        new HTMLBundlerPlugin({
            entry: 'src/views/',
            js: {
                filename: 'js/[name].[contenthash:8].js',
            },
            css: {
                filename: 'css/[name].[contenthash:8].css',
            },
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: cssLoaders,
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/' + (dev ? '[name][ext]' : '[name].[hash:8][ext]'),
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/' + (dev ? '[name][ext]' : '[name].[hash:8][ext]'),
                }
            }
        ]
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        watchFiles: {
            paths: ['src/**/*.*'],
            options: {
                usePolling: true,
            },
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    optimization: {
        minimize: !dev,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            })
        ],
    }
}

if (!dev) {
    config.plugins.push(new WebpackManifestPlugin())
}

module.exports = config;