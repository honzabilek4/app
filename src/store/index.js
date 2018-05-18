import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import { set } from "lodash";

import auth from "./modules/auth/";
import extensions from "./modules/extensions";
import edits from "./modules/edits";

import state from "./state";
import * as actions from "./actions";
import * as getters from "./getters";
import mutations from "./mutations";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

const persistedPaths = [
  "auth.token",
  "auth.url",
  "auth.projectName",
  "edits.collection",
  "edits.primaryKey",
  "edits.values"
];

const store = new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  strict: debug,
  modules: {
    auth,
    extensions,
    edits
  },
  plugins: [
    createPersistedState({
      key: "directus",
      paths: persistedPaths
    })
  ]
});

export default store;

const initialStateCopy = JSON.parse(JSON.stringify(store.state));

/* Delete the persisted data from the initial state, so the app won't reset back to the persisted
     data */
persistedPaths.forEach(path => {
  /**
   * NOTE: The last used URL is the only thing we want to keep, seeing it can auto-populate the API select dropdown on the login form.
   */
  if (path !== "auth.url") {
    set(initialStateCopy, path, null);
  }
});

export function resetState() {
  store.replaceState(JSON.parse(JSON.stringify(initialStateCopy)));
}
