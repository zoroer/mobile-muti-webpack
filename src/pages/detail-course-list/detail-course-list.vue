<!--
 * @fileoverview  营销课课次列表页
 * @author haihan | haihan@kaochong.com
 * @version 1.0 | 2019-05-20 | haihan
-->

<template>
  <div v-if="!loading">
    <div class="course-list-title-box">
      <p class="course-list-title">{{courseData.course_title}}</p>
    </div>
    <div class="course-list-item" v-for="(item, index) in courseData.lessons">
      <p class="list-num">{{index + 1}}</p>
      <div class="course-mes-box">
        <p class="list-name">{{item.lesson_title}}</p>
        <p class="list-duration">{{item.duration | handleDuration}}分钟</p>
      </div>
      <p class="list-listen-btn" @click="jumpToLive(item, index)">免费听课</p>
    </div>
  </div>
</template>

<script>
  import Api from '@api/api';
  import Toast from "@common/components/toast";
  import { getQueryOfKey } from '@common/utils/util';
  import MShare from '@common/public-source/mobile-share';
  import WXAuthorize from '@common/public-source/wx-authorize';
  export default {
    name: "DetailCourseList",
    data () {
      return {
        loading: true,
        source: getQueryOfKey('source') || '',
        courseid: getQueryOfKey('courseid'),
        courseData: {}
      }
    },
    filters: {
      handleDuration(duration) {
        return (duration / (60 * 1000)).toFixed(0);
      }
    },
    methods: {
      // 获取课程信息
      getCourseList() {
        this.$service.get(Api.getdetailcourselist, {
          course_id: this.courseid,
          source: this.source
        })
          .then(res => {
            !res.data['is_auth'] && this.handleAuth(res.data.ext);
            if (!res.data.list.deleted) {
              this.loading = false;
              this.courseData = res.data.list;
              this.handleShare();
            } else {
              location.href = '/html/course-invalid/index.html?source=' + this.source;
            }
          }, error => {
            console.log(error);
            Toast('咦，网络开小差了，请重试');
          });
      },
      jumpToLive(lesson, index) {
        this.$kcLog.send({
          pagename: 'wxcourseListPage',
          name: 'wxcourseClick',
          category: 'webClick',
          courseid: this.courseid,
          lessonid: lesson.lesson_id,
          position: index + 1,
          source: this.source
        });

        location.href = encodeURI('/html/course-live/index.html?courseid=' + this.courseData['course_id'] +
          '&source=' + this.source + '&lessonid=' + lesson['lesson_id'] + '&lessontitle=' + lesson['lesson_title']);
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
          url: location.origin + `/html/market-detail/index.html?courseid=${this.courseid}&source=${this.source}`,
          source: this.source,
          content: '错过后悔的考虫四六级微信专属免费精品课程，一起来领取吧！',
          title: this.courseData.course_title
        });
      }
    },
    created() {
      this.getCourseList();
    },
    mounted() {
      let dotStr = 'pagename=wxcourseListPage&name=wxcourseListPageview&category=webPageView&courseid=' +
        this.courseid + '&source=' + this.source;
      document.querySelector('body').setAttribute('kc-log-page-show', dotStr);
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .course-list-title-box{
    padding: .4rem;
    border-bottom: 1px solid #eee;
    .course-list-title {
      font-size: .36rem;
      color: #323232;
      position: relative;
      padding-left: .2rem;
      font-weight: bold;
      &::before {
        content: '';
        position: absolute;
        width: .06rem;
        height: .36rem;
        background-color: #FFDD00;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
  }
  .course-list-item {
    font-size: 0;
    padding: .4rem 0 0 .4rem;
    box-sizing: border-box;
    position: relative;
    .list-num {
      display: inline-block;
      width: .55rem;
      height: .32rem;
      line-height: .32rem;
      border-radius: .16rem;
      font-size: .24rem;
      background-color: #eee;
      color: #323232;
      font-weight: bold;
      text-align: center;
      vertical-align: top;
      margin-right: .25rem;
    }
    .course-mes-box {
      width: calc(100% - .8rem);
      display: inline-block;
      border-bottom: 1px solid #eee;
      padding-bottom: .4rem;
      box-sizing: border-box;
      .list-name {
        font-size: .3rem;
        color: #323232;
        max-width: 65%;
        line-height: 1.2;
      }
      .list-duration {
        margin-top: .15rem;
        font-size: .24rem;
        color: #A8A8A8;
      }
    }
    .list-listen-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: .4rem;
      width: 1.5rem;
      height: .56rem;
      line-height: .56rem;
      text-align: center;
      border-radius: .28rem;
      background-color: #FFDD00;
      font-size: .24rem;
      color: #323232;
      font-weight: bold;
    }
  }
</style>
