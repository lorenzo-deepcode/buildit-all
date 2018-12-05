const path = require('path')

const autoprefixer = require('autoprefixer')
const webpack = require('webpack')

const ExtractText = require('extract-text-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const NameAllModules = require('name-all-modules-plugin')
const ScriptExtHtml = require('script-ext-html-webpack-plugin')

const merge = require('webpack-merge')
const webpackConfig = require('./webpack.config')

const extractText = new ExtractText({ filename: '[name].[contenthash:8].css', disable: false, allChunks: true })

const prod = {
  entry: {
    app: './src/client.jsx',
    vendor: [ 'react' ],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].[chunkhash].js',
  },
  devtool: 'source-map',
  plugins: [
    extractText,
    new ScriptExtHtml({
      defaultAttribute: 'defer',
    }),
    new CleanPlugin([ 'build' ], { root: path.join(__dirname, '.') }),
    new webpack.NamedModulesPlugin,
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name
      }
      return chunk.mapModules(m => path.relative(m.context, m.request)).join('_')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
    }),
    new NameAllModules,

    // This does... something "good", but is like dropping a hammer
    // onto a faberge egg - keep it for now and unless it can
    // explain itself better we'll ditch it.
    new webpack.PrefetchPlugin('./node_modules/lodash-es/isEmpty.js'),
    new webpack.PrefetchPlugin('./node_modules/redux-actions/es/index.js'),
    new webpack.PrefetchPlugin('./node_modules/redux/es/index.js'),
    new webpack.PrefetchPlugin('./node_modules/babel-runtime/regenerator/index.js'),
    new webpack.PrefetchPlugin('./node_modules/react-router/es/index.js'),
    new webpack.PrefetchPlugin('./node_modules/react-router-redux/es/index.js'),
    new webpack.PrefetchPlugin('./node_modules/redux-saga/es/index.js'),
    new webpack.PrefetchPlugin('./node_modules/react-dom/index.js'),
    new webpack.PrefetchPlugin('./node_modules/react-redux/es/index.js'),
    new webpack.PrefetchPlugin('./node_modules/react-hot-loader/lib/index.js'),
    new webpack.PrefetchPlugin('./node_modules/history/es/index.js'),
    new webpack.PrefetchPlugin('./src/store/configureStore.prod.js'),
    new webpack.PrefetchPlugin('./node_modules/react-router/es/index.js'),
    new webpack.PrefetchPlugin('./node_modules/prop-types/factoryWithThrowingShims.js'),

    new webpack.optimize.UglifyJsPlugin({
      compress: { screw_ie8: true, warnings: false },
      output: { comments: false },
      sourceMap: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [ /node_modules/ ],
        use: extractText.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { modules: true, camelCase: 'only', localIdentName: '[local]' } },
          ],
        }),
      },
      {
        test: /\.(sass|scss|css)$/,
        exclude: [ /node_modules/ ],
        use: extractText.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { sourceMap: true, modules: true, camelCase: 'only', localIdentName: '[name]-[local]--[hash:base64:5]', importLoaders: 2 } },
            { loader: 'postcss-loader', options: { sourceMap: true, plugins: () => ([ autoprefixer() ]) } },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ],
        }),
      },
    ],
  },
}

module.exports = merge.smart(webpackConfig, prod)
