const webpack = require('webpack');

const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const HtmlWebPackPlugin = require('html-webpack-plugin');

const clientPath = path.join(__dirname, 'client');
const appPath = path.join(clientPath, 'app');
const buildPath = path.join(__dirname, 'build');

const styles = require('./webpack/styles');
const scripts = require('./webpack/scripts');

module.exports = (env, params) => {
  const isProduction = params.mode === 'production';

  const config = merge([
    {
      context: appPath,
      entry: {
        app: `${appPath}/index.jsx`,
      },
      output: {
        path: buildPath,
        filename: 'js/bundle.js',
        publicPath: '/',
      },
      resolve: {
        modules: [appPath, 'node_modules'],
        extensions: ['.js', '.jsx', '.json'],
      },
      plugins: [
        new CleanWebpackPlugin(buildPath),
        new CopyWebpackPlugin([{
          from: `${clientPath}/static/**/*`,
          to: buildPath,
          context: `${clientPath}/static`,
        }]),
        new ImageminPlugin({ disable: !isProduction }),
        new HtmlWebPackPlugin({
          template: `${clientPath}/index.html`,
        }),
        new webpack.HotModuleReplacementPlugin(),
      ],
      devServer: {
        contentBase: appPath,
        port: 3000,
        historyApiFallback: true,
        hot: true,
      },
    },
    scripts(isProduction),
    styles(isProduction),
  ]);

  if (!isProduction) {
    config.devtool = 'source-map';
  }

  return config;
};
