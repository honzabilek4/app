import Directus from 'directus-sdk-javascript/remote';
import Vue from 'vue';

const API = {
  install(Vue) { // eslint-disable-line no-shadow
    Vue.prototype.$api = new Directus();
  },
};

Vue.use(API);

export default API;
