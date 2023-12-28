'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const Paths = require('./paths');

const config = merge(common, {
  entry: {
    popup: Paths.src + '/popup.tsx',
    contentScript: Paths.src + '/contentScript.tsx',
    background: Paths.src + '/background.tsx',
    colors: Paths.src + '/colors.tsx',
  },
});

module.exports = config;
