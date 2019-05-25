const path = require('path');
const merge = require('webpack-merge');//用于合并两个配置文件的工具
const common = require('./webpack.base.config.js');//加载之前定义的配置文件

console.log(`
  \n=====================================================\n
  当前编译模式为: production
  \n=====================================================\n
`);

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'output'),
    publicPath: '/',
    filename: "js/[name]/js/[name].[hash:8].js",
    chunkFilename: "chunks/[name]/[name].[hash:8].js"
  }
});
