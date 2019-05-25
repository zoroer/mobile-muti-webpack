/*
 * Copyright (c) kaochong, All rights reseved.
 * @fileoverview 分享组件
 * @author haihan | haihan@kaochong.com
 * @version 1.0 | 2019-05-08 | haihan  // 初始版本（支持微信和QQ为出口的自定义分享）
 *
 *  调用示例:
 *  1. 引入分享组件
 *  import MShare from '@common/public-source/m-share.js';
 *  2. 设置分享参数
    new MShare({
      source: 'cet', // 公众号的来源
      url: location.origin + location.pathname + query, // 分享链接，一般为当前页面的链接
      content: '这是分享的内容', // 分享内容
      title: '这是分享的title', // 分享标题
      pic: 'https:////cdn.bos.kaochong.com/web/66-6123659537891842605.png',  // 分享缩略图
    });
 *
 */

function MShare(params, successCb) {
  let shareParams = {
    source: params.source || 'cet',
    title: params.title || '考虫_大学生备考一站式服务平台 四六级、考研、雅思、托福、专四专八在线系统班',
    content: params.content || '考虫、考虫网、考虫英语、考虫四六级、考虫四六级系统班、考虫考研、考虫雅思、考虫托福、考虫专四专八 、考虫实用英语、公考、考虫公考',
    pic: params.pic || window.location.protocol + '//cdn.bos.kaochong.com/web/66-6123659537891842605.png',
    url: params.url || window.location.href
  };

  // 是微信或者qq发送请求
  if (getTerminalType() === "micromessenger" || getTerminalType().indexOf('qq') > -1) {

    // 引入微信为出口的分享
    (function writeJWeiXinInDom(shareCb) {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js';
      let rootScript = document.getElementsByTagName('script')[0];
      rootScript.parentNode.insertBefore(script, rootScript);
      script.onload = function () {
        shareCb();
      };
    })(handleShare);

    // 引入QQ为出口的分享
    importQQShare();
  }

  // 设置分享
  function handleShare() {
    ajaxGet('/api/jssdk', {
      url: encodeURIComponent(window.location.href),
      source: shareParams.source
    }, function(res) {
      if (res) {
        wx.config({
          debug: false,
          appId: res.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.nonceStr, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名，见附录1
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'showMenuItems', 'showOptionMenu'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function() {
          wx.checkJsApi({
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'showMenuItems', 'showOptionMenu'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
              // 以键值对的形式返回，可用的api值true，不可用为false
              // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            }
          });
          //朋友圈
          wx.onMenuShareTimeline({
            title: shareParams.title, // 分享标题
            link: shareParams.url || location.href, // 分享链接
            imgUrl: shareParams.pic, // 分享图标
            success: function() {
              // 用户确认分享后执行的回调函数
              successCb && successCb();
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            },
            fail: function() {}
          });
          //朋友
          wx.onMenuShareAppMessage({
            title: shareParams.title, // 分享标题
            desc: shareParams.content, // 分享描述
            link: shareParams.url || location.href, // 分享链接
            imgUrl: shareParams.pic, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
              // 用户确认分享后执行的回调函数
              successCb && successCb();
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            },
            fail: function() {}
          });
          //qq
          wx.onMenuShareQQ({
            title: shareParams.title, // 分享标题
            desc: shareParams.content, // 分享描述
            link: shareParams.url || location.href, // 分享链接
            imgUrl: shareParams.pic, // 分享图标
            success: function() {
              // 用户确认分享后执行的回调函数
              successCb && successCb();
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          });
          //qq空间
          wx.onMenuShareQZone({
            title: shareParams.title, // 分享标题
            desc: shareParams.content, // 分享描述
            link: shareParams.url || location.href, // 分享链接
            imgUrl: shareParams.pic, // 分享图标
            success: function() {
              // 用户确认分享后执行的回调函数
              successCb && successCb();
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          });
          //显示分享按钮
          wx.showOptionMenu();
        });
      }
    });
  }

  function importQQShare() {
    let qqScript = document.createElement('script');
    qqScript.type = 'text/javascript';
    qqScript.async = true;
    qqScript.src = '//qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js';
    const rootScript = document.getElementsByTagName('script')[0];
    rootScript.parentNode.insertBefore(qqScript, rootScript);
    qqScript.onload = () => {
      window.setShareInfo && window.setShareInfo({
        title: shareParams.title,
        summary: shareParams.content,
        pic: shareParams.pic,
        url: shareParams.url
      })
    };
  }

  function ajaxGet(url, query, cb) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        cb(JSON.parse(xhr.responseText).data);
      }
    };
    xhr.open('get', url + objToQuery(query));
    xhr.send();
  }

  // 获取客户端类型
  function getTerminalType() {
    return /(MicroMessenger|WeiBo|QQ(?=[/_]))/i.test(navigator.userAgent) ? RegExp.$1.toLowerCase() : 'other';
  }

  function objToQuery(obj) {
    // 默认拼一个code来识别公众号(写死)
    let tempStr = '?code=kcncb&',
      tempObj = obj || {};
    for (let key in tempObj) {
      if (tempObj.hasOwnProperty(key)) {
        tempStr += (key + '=' + tempObj[key] + '&');
      }
    }
    return tempStr.slice(0, tempStr.length-1);
  }
}

export default MShare;
