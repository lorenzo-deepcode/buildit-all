const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const DashboardPlugin = require('webpack-dashboard/plugin')

const merge = require('webpack-merge')
const webpackConfig = require('./webpack.config')

const dev = {
  devtool: 'inline-source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
      './src/client.jsx',
    ],
  },
  output: {
    pathinfo: true,
    publicPath: '/',
  },
  devServer: {
    contentBase: './src',
    publicPath: '/',
    hot: true,
    port: 3001,
    compress: true,
    historyApiFallback: { verbose: true },
    noInfo: false,
    stats: { colors: true },
    overlay: { errors: true, warnings: false },
  },
  plugins: [
    new DashboardPlugin,
    new webpack.NamedModulesPlugin,
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [ /node_modules/ ],
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { modules: true, camelCase: 'only', localIdentName: '[local]' } },
        ],
      },
      {
        test: /\.(sass|scss|css)$/,
        exclude: [ /node_modules/ ],
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true, modules: true, camelCase: 'only', localIdentName: '[name]-[local]--[hash:base64:5]', importLoaders: 2 } },
          { loader: 'postcss-loader', options: { sourceMap: true, plugins: () => ([ autoprefixer() ]) } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },
}

module.exports = merge.smart(webpackConfig, dev)
