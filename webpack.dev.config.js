const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.base.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log(`
  \n=====================================================\n
  当前编译模式为: development
  \n=====================================================\n
`);

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'output'),
    publicPath: '/',
    filename: "js/[name]/[name].js",
    chunkFilename: "chunks/[name]/[name].js"
  },
  devServer: {
    open: true,
    compress: true,
    contentBase: path.join(__dirname, "output"),
    proxy: {
      '/api': {
        // mock数据源
        target: 'http://easymock.xuanke.com/mock/5ce263f12d4e6024f5f9dd87/kc-magnet',
        changeOrigin: true
      }
    }
  },
  plugins: [
    // dev环境为多页面添加一个默认入口页
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './common-conf-files/default.html',
      chunks: [],
      favicon: path.resolve(__dirname, './assets/favicon.ico'),
      minify:{
        removeComments: true, // 删除注释
        collapseWhitespace: true // 删除空格
      }
    })
  ],
  devtool: 'inline-source-map'
});
