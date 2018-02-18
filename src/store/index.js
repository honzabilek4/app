import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import auth from './modules/auth/';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  strict: debug,
  modules: {
    auth,
  },
  plugins: [
    createPersistedState({
      key: 'directus',
      paths: ['auth.accessToken', 'auth.url'],
    }),
  ],
});

export default store;
