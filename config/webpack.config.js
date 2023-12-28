'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

const config = merge(common, {
  entry: {
    popup: PATHS.src + '/popup.tsx',
    contentScript: PATHS.src + '/contentScript.tsx',
    background: PATHS.src + '/background.tsx',
    colors: PATHS.src + '/colors.tsx',
  },
});

module.exports = config;
