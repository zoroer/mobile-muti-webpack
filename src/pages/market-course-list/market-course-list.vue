<!--
 * @fileoverview  营销课列表页
 * @author haihan | haihan@kaochong.com
 * @version 1.0 | 2019-05-20 | haihan
-->

<template>
  <div>
    <div class="course-box" v-if="courseList.length">
      <div class="market-course-list" v-for="item in courseList" @click="jumpToCourseDetail(item.id)">
        <img class="market-course-img" :src="item.banner">
        <div class="market-course-mes">
          <p class="market-course-title">{{item.title}}</p>
          <p class="market-course-duration">{{item.period}}课时</p>
        </div>
      </div>
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
    name: 'MarketCourseList',
    data() {
      return {
        courseList: [],
        source: getQueryOfKey('source') || ''
      }
    },
    methods: {
      // 获取list
      getMarketList() {
        this.$service.get(Api.getmarketlist, {
          source: this.source
        })
          .then(res => {
            !res.data['is_auth'] && this.handleAuth(res.data.ext);
            this.courseList = res.data.list;
          }, error => {
            console.log(error);
            Toast('咦，网络开小差了，请重试');
          });
      },
      jumpToCourseDetail (courseid) {
        location.href = `/html/market-detail/index.html?courseid=${courseid}&source=${this.source}`;
      },
      // 处理授权
      handleAuth(authData) {
        WXAuthorize({
          appid: authData['app_id'],
          redirect_uri: authData.redirect + '&from=' + location.href,
          state: authData.state
        }, 0.2);
      }
    },
    created() {
      this.getMarketList();
      new MShare({
        url: location.href,
        source: this.source,
        content: '错过后悔的微信专属免费精品课程，一起来领取吧！',
        title: '快来领取考虫四六级免费干货'
      });
    }
  };
</script>

<style lang="less" type="text/less" scoped>
  .course-box {
    .market-course-list {
      margin: .4rem .4rem 0 .4rem;

      .market-course-img {
        display: block;
        height: 3.11rem;
        width: 100%;
        border-radius: .1rem .1rem 0 0;
      }

      .market-course-mes {
        padding: .3rem;
        border: 1px solid #eee;
        border-radius: 0 0 .1rem .1rem;
        border-top: 0;
        box-sizing: border-box;

        .market-course-title {
          font-size: .3rem;
          color: #323232;
          font-weight: bold;
        }

        .market-course-duration {
          font-size: .24rem;
          color: #A8A8A8;
          margin-top: .1rem;
        }
      }
    }
  }
</style>
