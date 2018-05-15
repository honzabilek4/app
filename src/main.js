import Vue from "vue";
import VueMQ from "vue-mq";
import PortalVue from "portal-vue";
import lodash from "lodash";
import Notifications from "vue-notification";
import VueDraggable from "vuedraggable";
import VTooltip from "v-tooltip";

import VueTimeago from "vue-timeago";
import en from "date-fns/locale/en/";
import nl from "date-fns/locale/nl/";

import "./assets/global.scss";
import "./assets/tooltip.scss";
import "./globals";
// import "./registerServiceWorker";
import App from "./App.vue";

import router from "./router";
import { i18n, loadLanguageAsync } from "./lang/";
import store from "./store/";
import api from "./api";
import helpers from "./helpers";
import hydrateStore from "./store/hydrate";

import "./helpers/handle-focus";

// Check if the global config is setup correctly. Panic if not.
if (!window.__DirectusConfig__) {
  // eslint-disable-line no-underscore-dangle
  const message = `

No Directus config found.

Please make sure to rename /static/config_example.js to /static/config.js and edit the config to match your project.

`;

  alert(message); // eslint-disable-line no-alert
  throw new Error(message);
}

Vue.config.productionTip = false;

Object.defineProperty(Vue.prototype, "$lodash", { value: lodash });
Object.defineProperty(Vue.prototype, "$api", { value: api });

Vue.use(PortalVue);
Vue.use(VueMQ, {
  breakpoints: {
    small: 800,
    medium: 1000,
    large: 1200,
    extraLarge: Infinity
  }
});
Vue.use(Notifications);
Vue.component("draggable", VueDraggable);
Vue.use(VTooltip, {
  defaultDelay: 500,
  defaultOffset: 2
});

Vue.use(VueTimeago, {
  name: "v-timeago",
  locale: "en-US",
  locales: {
    en,
    nl
  }
});

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  router,
  i18n,
  store,
  api,
  helpers
}).$mount("#app");

if (api.loggedIn) {
  hydrateStore().then(() => {
    loadLanguageAsync(store.state.currentUser.locale);
  });
}
