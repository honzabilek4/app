import Vue from "vue";
import lodash from "lodash";
import VueDraggable from "vuedraggable";
import VTooltip from "v-tooltip";
import NProgress from "nprogress";
import VueTimeago from "vue-timeago";
import en from "date-fns/locale/en/";
import nl from "date-fns/locale/nl/";

import "./assets/global.scss";
import "./assets/tooltip.scss";
import "./assets/progressbar.scss";
import "./assets/notyf.scss";
import "./globals";
import "./helpers/handle-focus";

// import "./registerServiceWorker";
import App from "./app.vue";
import router from "./router";
import { i18n } from "./lang/";
import store from "./store/";
import api from "./api";
import helpers from "./helpers";
import notify from "./notify";
import events from "./events/";

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
NProgress.configure({ showSpinner: false });

Object.defineProperties(Vue.prototype, {
  $lodash: { value: lodash },
  $api: { value: api },
  $progress: { value: NProgress },
  $notify: { value: notify }
});

Vue.use(events);
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
Vue.component("draggable", VueDraggable);

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  router,
  i18n,
  store,
  api,
  helpers
}).$mount("#app");
