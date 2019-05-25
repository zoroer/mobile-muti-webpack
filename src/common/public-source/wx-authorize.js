/*
 * Copyright (c) kaochong, All rights reseved.
 * @fileoverview 微信授权组件
 * @author haihan | haihan@kaochong.com
 * @version 1.0 | 2019-05-22 | haihan
 *【note1】组件只处理拉起微信授权弹窗部分！
 *【note2】redirect_uri 授权成功后固定跳转到后端接口，再由后端跳回url中from地址完成授权！
 *【note3】refuse_auth_time 为用户拒绝授权后 refuse_auth_time 分钟再重新拉起授权!
 *
 *  调用示例:
 *  1. 引入分享组件
 *  import WXAuthorize from '@common/public-source/wx-authorize.js';
 *  2.1 微信营销课调用
     WXAuthorize({
       appid: 微信公众号的唯一id,     // 微信唯一id
       redirect_uri: location.href // 授权成功跳转url
       state: state                // 授权成功跳转携带自定义参数
     });
    2.2 wap站页面调用
     WXAuthorize({
       appid: 微信公众号的唯一id, // 微信唯一id
       from: location.href     // 授权成功跳转url
     });
 *
 */

import { Cookie } from '@common/utils/util';
let env = location.host.indexOf('wechat') > 0 ? 'market' : 'wap';

function WXAuthorize(param, refuse_auth_time = 24 * 60) {
  let authTime = Number(localStorage.getItem('wx_auth_time')) || 0;
  let refusePastTime = (new Date().getTime() - authTime) / (60 * 1000);
  if (!authTime || refusePastTime >= refuse_auth_time) {
    // 没有授权过 或者 授权超过限定的时间，拉起授权并缓存授权时间
    localStorage.setItem('wx_auth_time', new Date().getTime().toString());
    preAuth(param);
  } else {
    console.log('拉起过授权且用户拒绝，等待限定时间后重新拉起！');
  }
}

/**
 * 不同环境拉起授权
 * @param param
 */
function preAuth(param) {
  if (env === 'wap') {
    if (!Cookie.get('kc_wx')) {
      handleAuth(param);
    }
  } else {
    handleAuth(param);
  }
}

/**
 * 拉起微信授权
 * @param param
 */
function handleAuth(param) {
  let baseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?';
  // 区别是公众号还是wap
  let redirectUrlTemp = (param.from === undefined)
    ? param.redirect_uri
    : `${location.origin}/api/wechat/oauth&from=${param.from}`;
  let authorizeConf = {
    appid: param.appid,
    redirect_uri: encodeURIComponent(redirectUrlTemp),
    response_type: 'code',
    scope: 'snsapi_userinfo',
    state: param.state || ''
  };
  location.href = baseUrl + parseParams(authorizeConf) + '#wechat_redirect';
}


// url转query
function parseParams(data) {
  let tempArr = [];
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      tempArr.push(key + '=' + data[key]);
    }
  }
  return tempArr.join('&');
}

export default WXAuthorize;
