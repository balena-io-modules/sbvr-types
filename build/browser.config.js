var config = {
  output: {
    filename: 'SBVRTypes.browser.min.js',
  },
  resolve: {
    modules: ['bower_components', 'node_modules'],
    alias: {
        bcrypt: 'bcryptjs'
    }
  }
};
 
module.exports = config;