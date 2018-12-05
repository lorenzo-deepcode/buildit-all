const path = require('path')

const webpack = require('webpack')

const stylelint = require('stylelint')
const postcssReporter = require('postcss-reporter')

const HTMLPlugin = require('html-webpack-plugin')

const sourceLoaderRule = {
  test: /\.jsx?$/,
  exclude: [ /node_modules/ ],
  loader: 'babel-loader?cacheDirectory',
}

const sourceLinterRule = {
  test: /\.jsx?$/,
  include: [ path.join(__dirname, 'src') ],
  exclude: [ /node_modules/ ],
  enforce: 'pre',
  use: [ 'eslint-loader' ],
}

const styleLinterRule = {
  test: /\.(sass|scss|css)$/,
  enforce: 'pre',
  loader: 'postcss-loader',
  options: { plugins: () => ([ stylelint(), postcssReporter({ clearMessages: true }) ]) },
}

const assetsLoaderRule = {
  test: /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$/,
  use: [ { loader: 'url-loader', options: { limit: 20000 } } ],
}

const htmlLoaderRule = {
  test: /\.html$/,
  use: [ { loader: 'file-loader?name=[name].[ext]' } ],
}

const jsonLoaderRule = {
  test: /\.json$/,
  use: [ { loader: 'file-loader?name=[name].[ext]' } ],
}

module.exports = {
  // MAKE IMPORTS GREAT AGAIN!
  resolve: {
    alias: {
      Store: path.resolve(__dirname, 'src/store'),
      History: path.resolve(__dirname, 'src/history'),

      Redux: path.resolve(__dirname, 'src/redux'),
      Models: path.resolve(__dirname, 'src/models'),

      Components: path.resolve(__dirname, 'src/components'),
      Containers: path.resolve(__dirname, 'src/containers'),
      Hoc: path.resolve(__dirname, 'src/hoc'),
      Constants: path.resolve(__dirname, 'src/constants'),
      Utils: path.resolve(__dirname, 'src/utils'),

      Styles: path.resolve(__dirname, 'src/styles'),
      Images: path.resolve(__dirname, 'src/images'),

      Api: path.resolve(__dirname, 'src/api'),

      Fixtures: path.resolve(__dirname, 'test/unit/__fixtures__'),
    },
    extensions: [ '.js', '.jsx', '.json' ],
  },
  entry: {},
  output: {},
  plugins: [
    new webpack.NoEmitOnErrorsPlugin,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    new HTMLPlugin({
      template: './src/index.ejs',
      favicon: './src/images/favicon.ico',
      filename: 'index.html',
      inject: 'body',
    }),
  ],
  module: {
    rules: [
      sourceLoaderRule,
      sourceLinterRule,
      styleLinterRule,
      assetsLoaderRule,
      htmlLoaderRule,
      jsonLoaderRule,
    ],
  },
}
