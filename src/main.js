import Vue from 'vue';
import PortalVue from 'portal-vue';
import lodash from 'lodash';

import './assets/global.css';
import './globals';
import App from './App.vue';

import router from './router';
import { i18n } from './lang/';
import store from './store/';
import api from './api';
import helpers from './helpers';
import hydrateStore from './store/hydrate';

import './helpers/handle-focus';

Vue.config.productionTip = false;

Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });
Object.defineProperty(Vue.prototype, '$api', { value: api });

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

if (api.loggedIn) {
  hydrateStore();
}
