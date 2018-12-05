var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

module.exports = {
  entry: [
    './src/index'
  ],
  module: {
    loaders: [
      { test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, "src"),
          fs.realpathSync(__dirname + "/node_modules/taco-components"),
        ],
        query: {
          presets: ['es2015', 'react'].map(function(name) { return require.resolve("babel-preset-"+name) }),
          plugins: ['transform-runtime'].map(function(name) { return require.resolve("babel-plugin-"+name) }),
        }, },
      { test: /\.s?css$/, loader: 'style!css!sass' },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      actions: path.join(__dirname, 'src/actions'),
      notifications: path.join(__dirname, 'src/notifications'),
      sagas: path.join(__dirname, 'src/sagas'),
    },
    fallback: path.join(__dirname, "node_modules"),
  },
  resolveLoader: { fallback: path.join(__dirname, "node_modules") },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'aws': {
        'accessKeyId': JSON.stringify('AKIAII47F3M5KTOZSPXA'),
        'secretAccessKey': JSON.stringify('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'),
        'region': JSON.stringify('us-east-1'),
      }
    }),
  ]
};
