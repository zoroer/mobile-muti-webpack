const fs = require('fs');
const glob = require('glob');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let proHtmlPlugin = []; // HtmlWebpackPlugin暂存
let entryConf = {};     // 页面入口暂存

// 获取所有页面资源信息
const allPages = (function getPages() {
  // 匹配基础项
  const fileConfig = {
    entry: 'main.js',
    html: 'index.html',
    pattern: ['src/pages/*']
  };
  const _pages = {};
  const _pageEntries = fileConfig.pattern.map(e => {
    const _matches = glob.sync(path.resolve(__dirname, e));
    return _matches.filter(match => fs.existsSync(`${match}/${fileConfig.entry}`))
  });
  [].concat.apply([], _pageEntries).forEach(dir => {
    const _filename = dir.split('pages/')[1];
    const _pathName = `./src${dir.split('src')[1]}`;
    _pages[_filename] = {
      entry: `${_pathName}/${fileConfig.entry}`,
      filename: `html/${_filename}/${fileConfig.html}`,
      chunks: ['publicSource', 'nodeCommon', _filename]
    }
  });
  return _pages;
})();

for (let item in allPages) {
  if (allPages.hasOwnProperty(item)) {
    entryConf[item] = allPages[item].entry;
    proHtmlPlugin.push(setAllHtmlPlugin(allPages[item]));
  }
}

/**
 * 循环数组动态配置HtmlWebpackPlugin插件，输出一个数组
 * @param pageConf
 * @returns {HtmlWebpackPlugin|HtmlWebpackPlugin}
 */
function setAllHtmlPlugin(pageConf) {
  return (new HtmlWebpackPlugin({
      filename: pageConf.filename,
      template: './common-conf-files/index.html',
      inject: true,
      chunks: pageConf.chunks,
      favicon: path.resolve(__dirname, './assets/favicon.ico'),
      minify:{
        removeComments: true, // 删除注释
        collapseWhitespace: true // 删除空格
      }
    })
  )
}

module.exports = {
  entry: entryConf,
  module: {
    rules: [{
      test: /\.vue$/,
      exclude: /node_modules/,
      use: ['vue-loader?cacheDirectory']
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader?cacheDirectory']
    }, {
      test: /\.(le|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'less-loader',
      ]
    }, {
      test: /\.(png|jpeg|jpg|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/imgs/[name].[hash].[ext]'
      }
    },{
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/medias/[name].[hash].[ext]'
      }
    }]
  },
  plugins: [
    new VueLoaderPlugin(),
    new cleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name]/[name].[hash:8].css',
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        publicSource: {
          chunks: 'all',
          name: 'publicSource',
          // test: /[\\/]src[\\/]common[\\/]public-source[\\/]/,
          test: /[\\/]src[\\/]common[\\/]/,
          minSize: 0,
          minChunks: 2
        },
        nodeCommon: {
          name: 'nodeCommon',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'all'
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        }
        // 暂时去掉split默认处理的方式，自己匹配要分离的文件夹
        // vendor: {
        //   name: "vendor",
        //   minChunks: 2
        // }
      }
    }
  },
  resolve:{
    extensions: ['.js', '.css', '.vue', '.json', '.less'],
    alias:{
      vue: 'vue/dist/vue.js',
      '@': path.resolve('./src'),
      '@common': path.resolve('./src/common'),
      '@api': path.resolve('./src/api')
    }
  }
};
module.exports.plugins = (module.exports.plugins || []).concat(proHtmlPlugin);
