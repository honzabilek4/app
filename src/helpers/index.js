import Vue from 'vue';
import formatName from './format-name';

const helpers = {
  formatName,
};

const helpersPlugin = {
  install(Vue) { // eslint-disable-line no-shadow
    Vue.prototype.$helpers = helpers;
  },
};

Vue.use(helpersPlugin);

export default helpers;
