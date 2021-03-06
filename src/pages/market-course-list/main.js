import Vue from 'vue'
import kcLog from 'kc-log'
import '@common/style/reset'
import App from './market-course-list'
import service from '@common/public-source/service'

Vue.prototype.$service = service;
Vue.prototype.$kcLog = kcLog;

Vue.config.productionTip = false;
new Vue({
  el: '#app',
  render: h => h(App)
});
