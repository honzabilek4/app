import Directus from 'directus-sdk-javascript/remote';
import Vue from 'vue';

import store from './store';

const API = new Directus({
  accessToken: store.state.auth.accessToken,
  url: store.state.auth.url,
});

API.install = function install(Vue) { // eslint-disable-line no-shadow
  Vue.prototype.$api = API;
};

API.on('login', () => store.dispatch('login'));

API.on('login:success', () => store.dispatch('loginSuccess', {
  accessToken: API.accessToken,
  url: API.url,
}));

API.on('refresh:success', () => store.dispatch('refreshSuccess', {
  accessToken: API.accessToken,
  url: API.url,
}));

API.on('login:failed', err => store.dispatch('loginFailed', err));

API.on('logout', () => store.dispatch('logout'));

Vue.use(API);

export default API;
