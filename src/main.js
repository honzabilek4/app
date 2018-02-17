import Vue from 'vue';
import './assets/global.css';
import App from './App.vue';

import router from './router';
import { i18n } from './lang/';
import store from './store/';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  i18n,
  store,
});
