const nodeExternals = require('webpack-node-externals')

var config = {
  output: {
    filename: 'SBVRTypes.node.min.js',
  },
  target: 'node',
  externals: [nodeExternals()],
}
 
module.exports = config;