const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var APP_DIR = path.resolve(__dirname, 'app/');

module.exports = {
  entry: APP_DIR + '/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" }
    ])
  ],
  module: {
    // rules: [
    //   {
    //   test: /\.css$/,
    //   use: [ 'style-loader', 'css-loader' ]
    //   }
    // ],
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.json$/, use: 'json-loader' },
      { test: /\.css$/, include: [APP_DIR, /node_modules/], loader: 'style-loader!css-loader' }
    ]
  }
}
