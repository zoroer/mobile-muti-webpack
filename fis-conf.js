/**
 * Copyright (c) 2018-2019 kaochong, All rights reserved.
 * @fileoverview fis3配置文件
 * @author haihan | haihan@kaochong.com
 * @version 1.0 | 2019-05-16 | haihan
 * @description 用到fis部署文件到测试环境
 */

fis.set('namespace', 'wechat');

fis.set('project.ignore', [
  'node_modules/**',
  '.git/**',
  '.svn/**'
]);

// 将output目录内容上传到测试环境
fis.media('rd')
  .match('output/(**)', {
    release: '/$1',
    deploy: fis.plugin('http-push', {
      receiver: 'http://kctools.rdtest.xuanke.com/fis/',
      to: '/home/kaochong/app/kc_wechat_fe' // 注意这个是指的是测试机器的路径，而非本地机器
    })
  });

// 将output目录内容上传到沙箱环境
fis.media('sandbox')
.match('output/(**)', {
  release: '/$1',
  deploy: fis.plugin('http-push', {
    receiver: 'http://kctools.rdtest.xuanke.com/fis/',
    to: '/home/kaochong/app/kc_wechat_fe'
  })
});
