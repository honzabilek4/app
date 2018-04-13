import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import auth from './modules/auth/';
import collections from './modules/collections';
import me from './modules/me';
import settings from './modules/settings';
import fields from './modules/fields';
import listingPreferences from './modules/listing-preferences';
import extensions from './modules/extensions';
import edits from './modules/edits';
import bookmarks from './modules/bookmarks';

import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  state: {
    hydrating: true,
    hydratingError: null,
    latency: [],
  },
  actions,
  getters,
  mutations,
  strict: debug,
  modules: {
    auth,
    collections,
    me,
    settings,
    fields,
    listingPreferences,
    extensions,
    edits,
    bookmarks,
  },
  plugins: [
    createPersistedState({
      key: 'directus',
      paths: [
        'auth.token',
        'auth.url',
        'auth.projectName',
        'edits.collection',
        'edits.primaryKey',
        'edits.values',
      ],
    }),
  ],
});

export default store;
