import Vue from 'vue';
import PortalVue from 'portal-vue';
import './assets/global.css';
import './globals';
import App from './App.vue';

import router from './router';
import { i18n } from './lang/';
import store from './store/';
import api from './api';
import helpers from './helpers';

Vue.config.productionTip = false;

Vue.use(PortalVue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  i18n,
  store,
  api,
  helpers,
});
