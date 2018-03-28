import Vue from 'vue';
import formatTitle from '@directus/format-title';
import gravatar from './gravatar';
import prefixes from './prefixes';
import date from './date';

const helpers = {
  formatTitle,
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
