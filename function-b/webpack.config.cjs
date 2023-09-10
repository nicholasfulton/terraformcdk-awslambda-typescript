// Import path for resolving file paths
const ZipPlugin = require('zip-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const { IgnorePlugin } = require('webpack');

module.exports = {
    target: 'node18',
    mode: 'production',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        // new IgnorePlugin({ resourceRegExp: /^aws-crt$/ }),
        new CopyPlugin({
            patterns: [
                './package.json'
            ]
        }),
        new ZipPlugin({
            include: [
                'index.js',
                'package.json'
            ],
            filename: 'deploy.zip'
        })
    ],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: "module",
        },
    },
    experiments: {
        outputModule: true
    }
}