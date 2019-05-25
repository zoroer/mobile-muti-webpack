<!--
 * @fileoverview  微信手动授权页(暂时不用)
 * @author haihan | haihan@kaochong.com
 * @version 1.0 | 2019-05-20 | haihan
-->

<template>
  <div class="container-bg">
    <div class="no-course-box">
      <img class="invalid-img" src="./imgs/img_kaochong_icon.png">
      <div class="line"></div>
      <p class="invalid-text">微信授权后即可体验课程哦</p>
      <button class="auth-btn" @click="getAuth">微信一键授权登录</button>
    </div>
  </div>
</template>

<script>
  import Api from '@api/api';
  export default {
    methods: {
      getAuth (){
      }
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
      .line {
        width: 6.3rem;
        height: 1px;
        background-color: #eee;
        margin: .4rem 0;
      }
      .invalid-img {
        height: 1.34rem;
        width: 1.34rem;
      }
      .invalid-text {
        color: #323232;
        font-size: .3rem;
        text-align: center;
        line-height: 1.5;
      }
      .auth-btn {
        width: 5.6rem;
        height: .9rem;
        line-height: .9rem;
        background-color: #02C160;
        color: #fff;
        font-size: .3rem;
        font-weight: bold;
        margin-top: .8rem;
        border-radius: .1rem;
      }
    }
  }
</style>
