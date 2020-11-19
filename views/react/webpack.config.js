const path = require('path');

module.exports = {
  devServer: {
    // publicPath: '/react/slate/123',
    port: 3000,
    proxy: [{
//      // '/react/slate/123': 'http://localhost:3000/',
//      target: 'http://localhost:3000/',
//      pathRewrite: { '/react/slate/123':  '' }
      '/slate': 'http://localhost:8080/slate',
    }]
  },
  mode: 'development',
  // entry: './build/js/app.min.js',
  // entry: './src/billing.js',
  entry: './src/communication-tools.js',
  // does not work:
  // entry: './src',
  // entry: './build/js/src/app.min.js',
  module: {
    rules: [
      { 
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
           // Creates `style` nodes from JS strings
           "style-loader",
           // Translates CSS into CommonJS
           "css-loader",
           // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ]
  },
  output: {
//    path: path.resolve(__dirname, 'dist'),
    path: path.resolve(__dirname, '.'),
    publicPath: '/react/slate/',
    filename: 'main.js',
  }
};