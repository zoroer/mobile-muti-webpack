<!--
 * @fileoverview  微信关注落地页
 * @author haihan | haihan@kaochong.com
 * @version 1.0 | 2019-05-20 | haihan
-->

<template>
  <div class="container-bg">
    <div class="no-course-box">
      <img class="invalid-img" :src="qrcodeUrl" @click="handleClick">
      <p class="invalid-text">赶紧关注服务号观看课程吧</p>
    </div>
  </div>
</template>

<script>
  import { getQueryOfKey } from '@common/utils/util';
  import MShare from '@common/public-source/mobile-share';
  export default {
    data() {
      return {
        source: getQueryOfKey('source') || '',
        courseid: getQueryOfKey('courseid'),
        qrcodeUrl: decodeURIComponent(getQueryOfKey('url'))
      }
    },
    methods: {
      handleClick() {
        this.$kcLog.send({
          pagename: 'wxattentionpromptPage',
          name: 'wxqrcodeclick',
          category: 'webClick',
          courseid: this.courseid,
          source: this.source
        });
      }
    },
    mounted: function () {
      let dotStr = 'pagename=wxattentionpromptPage&name=wxattentionpromptPageview&category=webPageView' +
        '&source=' + this.source + '&courseid=' + this.courseid;
      document.querySelector('body').setAttribute('kc-log-page-show', dotStr);

      new MShare({
        url: location.href,
        content: '错过后悔的微信专属免费精品课程，一起来领取吧！',
        title: '快来领取考虫四六级免费干货'
      });
    }
  };
</script>

<style lang="less" type="text/less" scoped>
  .container-bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    .no-course-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      text-align: center;
      .invalid-img {
        height: 2.52rem;
        width: 2.52rem;
      }
      .invalid-text {
        color: #323232;
        font-size: .3rem;
        margin-top: .2rem;
        text-align: center;
        line-height: 1.5;
      }
    }
  }
</style>
