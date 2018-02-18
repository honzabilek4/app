import Directus from 'directus-sdk-javascript/remote';
import Vue from 'vue';

import store from './store';

const API = new Directus();

API.install = function install(Vue) { // eslint-disable-line no-shadow
  Vue.prototype.$api = API;
};

API.on('login', () => store.commit('login'));
API.on('login:success', () => store.commit('loginSuccess'));
API.on('login:failed', err => store.commit('loginFailed', err));
API.on('logout', () => store.dispatch('logout'));

Vue.use(API);

export default API;
