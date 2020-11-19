const path = require('path');

module.exports = {
  watch: true,
  devServer: {
    port: 8085,
    proxy: [
      {
        context: ['/react/slate/123','/slate','/features'],
        target: 'http://localhost:8080/',
      },
    ],
    openPage: 'react/slate/123',
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