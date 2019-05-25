<!--
 * @fileoverview  营销课详情页
 * @author haihan | haihan@kaochong.com
 * @version 1.0 | 2019-05-20 | haihan
-->

<template>
  <div class="market-detail-box" v-if="!loading">
    <img class="index-banner" :src="courseIntro.banner">
    <div class="index-intro-box">
      <p class="index-title">{{courseIntro.title}}</p>
      <p class="index-time">{{courseIntro.period}}课时</p>
    </div>
    <div class="common-line"></div>
    <div class="index-img-box" v-html="courseIntro.content"></div>
    <div class="common-line"></div>
    <div class="intro-box" ref="introBox">
      <img :src="courseIntro.banner">
      <!--<img src="">-->
    </div>
    <div class="index-fix-hover" @click="slideToIntroBox">
      <img src="">
    </div>
    <div class="index-fix-btn" @click="jumpToCourseList">立即免费听课</div>
  </div>
</template>

<script>
  import Api from '@api/api';
  import Toast from "@common/components/toast";
  import { getQueryOfKey } from '@common/utils/util';
  import MShare from '@common/public-source/mobile-share';
  import HandleScroll from '@common/public-source/scrollTo';
  import WXAuthorize from '@common/public-source/wx-authorize';
  export default {
    name: 'CourseIndex',
    data () {
      return {
        loading: true,
        source: getQueryOfKey('source') || '',
        courseid: getQueryOfKey('courseid'),
        courseIntro: {}
      }
    },
    methods: {
      // 获取课程信息
      getCourseData() {
        this.$service.get(Api.getmarketdetail, {
          course_id: this.courseid,
          source: this.source
        })
          .then(res => {
            !res.data['is_auth'] && this.handleAuth(res.data.ext);
            if (!res.data.list.deleted) {
              this.loading = false;
              this.courseIntro = res.data.list;
              this.handleShare();
            } else {
              location.href = '/html/course-invalid/index.html?source=' + this.source;
            }
          }, error => {
            console.log(error);
            Toast('咦，网络开小差了，请重试');
          });
      },
      jumpToCourseList() {
        this.$kcLog.send({
          pagename: 'wxcourseDetailPage',
          name: 'wxcoursebuyClick',
          category: 'webClick',
          courseid: this.courseid,
          source: this.source
        });

        location.href = `/html/detail-course-list/index.html?courseid=${this.courseIntro.id}&source=${this.source}`;
      },
      slideToIntroBox() {
        // 点击滑到品宣介绍部分
        HandleScroll.scrollToEle(this.$refs.introBox);
        this.$kcLog.send({
          pagename: 'wxcourseDetailPage',
          name: 'wxcoursebrandClick',
          category: 'webClick',
          courseid: this.courseid
        });
      },
      // 处理授权
      handleAuth(authData) {
        WXAuthorize({
          appid: authData['app_id'],
          redirect_uri: authData.redirect + '&from=' + location.href,
          state: authData.state
        })
      },
      // 处理分享
      handleShare() {
        new MShare({
          url: location.href,
          source: this.source,
          content: '错过后悔的考虫四六级微信专属免费精品课程，一起来领取吧！',
          title: this.courseIntro.title
        });
      }
    },
    created() {
      this.getCourseData();
    },
    mounted() {
      let dotStr = 'pagename=wxcourseDetailPage&name=wxcourseDetailPageview&category=webPageView&courseid=' +
        this.courseid + '&source=' + this.source;
      document.querySelector('body').setAttribute('kc-log-page-show', dotStr);
    }
  };
</script>

<style lang="less" type="text/less" scoped>
  .market-detail-box {
    padding-bottom: 1rem;
    .common-line {
      height: .2rem;
      background-color: #F8F8F8;
    }
    .index-banner {
      display: block;
      width: 100%;
    }
    .index-intro-box {
      height: 1.6rem;
      padding: .4rem;
      box-sizing: border-box;
      .index-title {
        font-size: .32rem;
        font-weight: bold;
        color: #323232;
        margin-bottom: .2rem;
      }
      .index-time {
        font-size: .24rem;
        color: #A8A8A8;
      }
    }
    .index-img-box {
      padding: 0 .2rem;
      /deep/ img {
        width: 100%;
        display: block;
      }
    }
    .intro-box {
      padding: 0 .2rem;
      img {
        display: block;
        width: 100%;
      }
    }
    .index-fix-hover {
      position: fixed;
      right: .4rem;
      bottom: 2.07rem;
      width: 1.8rem;
      height: 1.8rem;
      border: 1px solid #ccc;
      img {
        display: block;
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }
    .index-fix-btn {
      position: fixed;
      width: 100%;
      bottom: 0;
      height: 1rem;
      line-height: 1rem;
      background-color: #FFDD00;
      color: #323232;
      font-size: .3rem;
      font-weight: bold;
      text-align: center;
    }
  }
</style>
