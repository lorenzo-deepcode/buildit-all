const path = require('path');

module.exports = {
  entry: './src/index.jsx',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'ds-demo-lib',
    libraryTarget: 'umd'
  },

  externals: {
    "react": {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'react'
    }
  },

  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader' },
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  devtool: 'source-map'
};
