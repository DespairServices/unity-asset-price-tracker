'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const PATHS = require('./paths');

const common = {
  output: {
    path: PATHS.out,
    filename: '[name].js',
  },
  devtool: 'source-map',
  stats: {
    all: false,
    errors: true,
    builtAt: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          context: 'public',
        },
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};

module.exports = common;
