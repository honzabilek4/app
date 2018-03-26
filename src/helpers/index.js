import Vue from 'vue';
import formatName from './format-name';
import gravatar from './gravatar';
import prefixes from './prefixes';
import date from './date';

const helpers = {
  formatName,
  gravatar,
  prefixes,
  date,
};

const helpersPlugin = {
  install(Vue) { // eslint-disable-line no-shadow
    Vue.prototype.$helpers = helpers;
  },
};

Vue.use(helpersPlugin);

export default helpers;
