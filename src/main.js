import Vue from 'vue';
import './assets/global.css';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
});
