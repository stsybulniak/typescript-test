import webpack from 'webpack';
import path from 'path';

import nodeExternals from 'webpack-node-externals';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import NodemonPlugin from 'nodemon-webpack-plugin';

const isProduction = (process.env.NODE_ENV || 'production') !== 'development';

const config: webpack.Configuration = {
    optimization: {
        // We no not want to minimize our code.
        // minimize: false
    },
    mode: isProduction ? 'production' : 'development',
    entry: './index.ts',
    target: 'node',
    context: path.resolve(__dirname, './src'),
    node: {
        __dirname: false,
        __filename: false,
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader']
            },
        ]
    },
    plugins: [
        new NodemonPlugin(),
        new CopyWebpackPlugin([
            {from: 'locales', to: 'locales'}
        ])
    ],
    resolve: {
        enforceExtension: false,
        extensions: ['.ts', '.js', '.json'],
    },
    externals: [nodeExternals()],
    watch: !isProduction
};

export default config;