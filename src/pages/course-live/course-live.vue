<!--
 * @fileoverview  营销课直播页
 * @author haihan | haihan@kaochong.com
 * @version 1.0 | 2018-12-03 | haihan（嵌入课中直播页的iframe）
-->

<template>
  <div class="live-box">
    <div class="header-box">
      <div class="header-back" @click="goBack">返回</div>
      <p class="header-title">{{lessonTitle}}</p>
    </div>
    <div class="iframe-box">
      <iframe :src="liveUrl" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
  import Api from '@api/api';
  import Toast from "@common/components/toast";
  import MShare from '@common/public-source/mobile-share';
  import { getQueryOfKey } from '@common/utils/util';
  export default {
    data() {
      return {
        lessonId: getQueryOfKey('lessonid'),
        lessonTitle: getQueryOfKey('lessontitle'),
        source: getQueryOfKey('source'),
        courseid: getQueryOfKey('courseid'),
        liveUrl: '',
        wxMes: {},
      }
    },
    methods: {
      goBack() {
        history.go(-1);
      },
      // 获取微信相关信息
      getNickName() {
        this.$service.get(Api.getnickname, {
          lesson_id: this.lessonId,
          source: this.source
        })
          .then(res => {
            if (!res.data.is_subscribe) {
              location.href = res.data.ext.header_ur;
              if (!res.data.list.deleted) {
                this.wxMes = res.data.list;
                this.handleShare();
                this.getLiveSrc();
              } else {
                location.href = '/html/course-invalid/index.html?source=' + this.source;
              }
            }
          }, error => {
            console.log(error);
            Toast('咦，网络开小差了，请重试');
          });
      },
      // 获取直播src
      getLiveSrc() {
        // [note] 因为调用课中api时跟微信域名不统一，通过后端判断后带上host返回后再请求.
        this.$service.get(this.wxMes.live_url, {
          lessonId: this.lessonId,
          nickname: this.wxMes.nickname,
          wxSource: this.source
        })
          .then(res => {
            this.liveUrl = '//www.kaochong.com' + res.live.url;
          },
            error => {
              console.log(error);
              Toast('咦，网络开小差了，请重试');
          });
      },
      // 处理分享
      handleShare() {
        new MShare({
          url: location.origin + `/html/market-detail/index.html?courseid=${this.courseid}&source=${this.source}`,
          source: this.source,
          content: '错过后悔的考虫四六级微信专属免费精品课程，一起来领取吧！',
          title: this.wxMes.course_title
        });
      }
    },
    created() {
      this.getNickName();
    },
    mounted() {
      let dotStr = 'pagename=wxplaybackPage&name=wxplaybackPageview&category=webPageView&lessonid=' +
        this.lessonid + '&source=' + this.source + '&courseid=' + this.courseid;
      document.querySelector('body').setAttribute('kc-log-page-show', dotStr);
    }
  };
</script>

<style lang="less" type="text/less" scoped>
  .live-box {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    .header-box {
      height: .88rem;
      line-height: .88rem;
      background-color: #13131F;
      color: #FFDD00;
      font-size: .3rem;
      text-align: center;
      position: relative;

      .header-back {
        position: absolute;
        top: 50%;
        left: .2rem;
        transform: translateY(-50%);
        padding-left: .3rem;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: .36rem;
          width: .2rem;
          background: url("./imgs/img_arrow.png") center no-repeat;
          background-size: contain;
        }
      }
    }

    .iframe-box {
      width: 100%;
      height: calc(100% - 0.88rem);

      iframe {
        width: 100%;
        height: 100%;
        border: 0;
        position: relative;
        z-index: 1;
      }
    }
  }
</style>
