var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    app:'./main',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js'
  },
  resolve: {
		root: path.resolve(__dirname),
		extensions: ['', '.js', '.jsx']
	},
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, exclude: [ /node_modules/ ], loader: 'babel' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      { test: /\.(png|jpg|gif)$/, loader: 'file-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({filename: 'index.html', template:'src/index.html'}),
  ],
  devServer: {
    stats: 'minimal'
  },
  devtool: 'source-map'
};
