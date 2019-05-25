<!--
 * @fileoverview
 * @author haihan | haihan@kaochong.com
 * @version 1.0 | 2019-05-20 | haihan
-->

<template>
  <div class="container-bg">
    <div class="no-course-box">
      <img class="invalid-img" src="./imgs/img_nocourse.png">
      <p class="invalid-text">当前课程已失效</p>
    </div>
  </div>
</template>

<script>
  export default {};
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
      .invalid-img {
        display: block;
        height: 2.6rem;
        width: 2.6rem;
      }
      .invalid-text {
        color: #ccc;
        font-size: .3rem;
        margin-top: .4rem;
        text-align: center;
      }
    }
  }
</style>
