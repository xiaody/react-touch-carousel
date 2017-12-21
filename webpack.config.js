'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const targetPages = process.env.PAGE || process.env.PAGES
const pages = targetPages.trim().split(/[\n\r]+/).filter(x => x !== '.')

const config = {
  entry: pages.reduce((ret, name) => {
    ret[name] = `./examples/${name}/index.js`
    return ret
  }, {}),

  output: {
    filename: '[name]/bundle.js',
    path: path.resolve(__dirname, './docs')
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'standard-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },

  plugins: pages.map((page) => {
    return new HtmlWebpackPlugin({
      title: page,
      chunks: [page],
      filename: `${page}.html`,
      template: `examples/${page}/index.html`,
      inject: 'head'
    })
  }).concat(
    new HtmlWebpackPlugin({
      chunks: [],
      filename: 'index.html',
      template: 'examples/index.html'
    })
  ),

  devServer: {
    contentBase: path.join(__dirname, 'examples'),
    compress: true,
    disableHostCheck: true, // see github.com/webpack/webpack-dev-server/releases/tag/v2.4.3
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 5000
  }
}

module.exports = config
