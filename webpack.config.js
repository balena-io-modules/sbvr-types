const webpack = require('webpack')
const path = require('path')
const _ = require('lodash')

const root = path.resolve(__dirname)

let serverConfig = require('./build/node.config.js')
let browserConfig = require('./build/browser.config.js')

var commonConfig = {
  entry: [
    root + '/src/main.ts'
  ],
  devtool: 'source-map',
  output: {
    path: path.join(root, '/dist'),
    library: 'SBVRTypes',
    libraryTarget: 'umd', 
    umdNamedDefine: true
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.(sbvr)$/, loader: 'raw-loader', exclude: /node_modules/ }
    ]
  },
  resolve: {
    extensions: [ '.js', '.ts', '.jsx', '.tsx' ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
};

serverConfig = _.merge({}, commonConfig, serverConfig)
browserConfig = _.merge({}, commonConfig, browserConfig)

module.exports = [ serverConfig, browserConfig ]