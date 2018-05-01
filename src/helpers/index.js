import Vue from "vue";
import convertRange from "convert-range";
import gravatar from "@rijk/gravatar";
import formatTitle from "@directus/format-title";
import prefixes from "./prefixes";
import date from "./date";

const helpers = {
  formatTitle,
  gravatar,
  prefixes,
  date,
  convertRange
};

const helpersPlugin = {
  install(Vue) {
    // eslint-disable-line no-shadow
    Vue.prototype.$helpers = helpers;
  }
};

Vue.use(helpersPlugin);

export default helpers;
