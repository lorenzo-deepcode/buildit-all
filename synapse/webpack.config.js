const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SassLintPlugin = require('sasslint-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const version = require('./package.json').version;

const webpackConfig = {
  entry: [
    './src/js/index.js',
    './src/scss/main.scss',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '/js/bundle.[hash].js',
  },
  devtool: 'source-map',
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new ExtractTextPlugin('/css/main.[hash].css'),
    new webpack.DefinePlugin({
      'process.env.EOLAS_DOMAIN': JSON.stringify(process.env.EOLAS_DOMAIN),
      'process.env.TEST_API': JSON.stringify(process.env.TEST_API),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.VERSION': JSON.stringify(version),
    }),
    new SassLintPlugin({
      glob: 'src/scss/**/*.s?(a|c)ss',
      ignorePlugins: ['extract-text-webpack-plugin'],
    }),
  ],
  resolve: {
    modulesDirectories: [path.join(__dirname, 'src/js/'), 'node_modules'],
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {
      actions: path.join(__dirname, 'src/js/actions'),
      api: path.join(__dirname, 'src/js/api'),
      components: path.join(__dirname, 'src/js/components'),
      containers: path.join(__dirname, 'src/js/containers'),
      helpers: path.join(__dirname, 'src/js/helpers'),
      middleware: path.join(__dirname, 'src/js/middleware'),
      reducers: path.join(__dirname, 'src/js/reducers'),
      stores: path.join(__dirname, 'src/js/stores'),
      scss: path.join(__dirname, 'src/scss'),
    },
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel-loader', 'eslint'],
        exclude: /node_modules/,
      }, {
        test: /\.html$/,
        loader: 'htmlhint',
        exclude: /node_modules/,
      },
    ],
    loaders: [{
      test: /\.(js)/,
      exclude: /node_modules/,
      // cacheable: true,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
        plugins: ['transform-runtime'],
      },
    },
    {
      test: /\.(jsx)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
      },
    },
    {
      test: /.json/,
      exclude: [/node_modules/, /config/],
      // cacheable: true,
      loader: 'json-loader',
    }, {
      test: /\.html$/,
      exclude: /node_modules/,
      loader: 'html',
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('css!sass'),
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    }],
  },
};

if (process.env.NODE_ENV === 'development') {
  webpackConfig.plugins.push(new DashboardPlugin());
}

module.exports = webpackConfig;
