# 多页面项目

## 安装使用
``` bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 正式打包
npm run build
```

## 目录结构
```
|-- common-conf-files // 打包的公共模板文件
    |-- index.html   所有页面打包的基础html
    |-- default.html dev环境打包的默认入口
|-- assets // 静态文件文件
|   |-- favicon.ico 
|-- src // 项目代码
    |-- api // 项目的api接口声明，通过 import Api from '@api/api' 可直接调用
    |   |-- api.js // 接口export
    |   |-- yourModule
    |   |   |-- yourModule.js
    |-- common // 公用资源文件夹
    |   |-- public-source  // 业务相关js
    |   |-- components     // 公共组件
    |   |-- style          // 跟css相关
    |   |-- utils          // 工具库
    |-- pages  // 所有页面
        |-- yourpage // 项目一
        |   |-- App.vue // 项目根vue文件
        |   |-- main.js // 命名不能改！！！
        |   |-- img     // 项目的图片等静态资源
```  


