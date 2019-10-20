const path = require('path');

module.exports = {
    mode: 'development',

//  entry: './build/js/app.min.js',
//  entry: './src/billing.js',
  entry: './src/communication-tools.js',
// does not work:
//    entry: './src',
//  entry: './build/js/src/app.min.js',
  module: {
    rules: [
      { 
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  output: {
//    path: path.resolve(__dirname, 'dist'),
    path: path.resolve(__dirname, '.'),
    filename: 'main.js'
  }
};