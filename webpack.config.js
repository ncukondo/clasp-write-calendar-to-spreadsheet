const path = require('path');
const GasPlugin = require("gas-webpack-plugin");

module.exports = {
  mode: 'none',
  devtool: false,
  module: {
    rules: [{
        test: /\.ts?$/,
        use: [{
            loader: "babel-loader"
          },
          {
            loader: "ts-loader"
          }
        ],
        exclude: /node_modules/
      }

    ],
  },
  resolve: {
    extensions: [
      '.ts',
      '.js'
    ]
  },
  plugins: [
    new GasPlugin()
  ]
};
