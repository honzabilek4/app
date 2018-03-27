import { isEmpty } from 'lodash';
import Vue from 'vue';
import {
  PREFERENCES_PENDING,
  PREFERENCES_SUCCESS,
  PREFERENCES_FAILED,
  SET_PREFERENCES,
} from '../../mutation-types';

const mutations = {
  [PREFERENCES_PENDING](state, collection) {
    if (isEmpty(state[collection])) {
      Vue.set(state, collection, {
        data: null,
        error: null,
        loading: false,
      });
    }

    state[collection].loading = true;
  },

  [PREFERENCES_SUCCESS](state, { data, collection }) {
    Vue.set(state[collection], 'data', data);
    state[collection].error = null;
    state[collection].loading = false;
  },

  [PREFERENCES_FAILED](state, { collection, error }) {
    state[collection].error = error;
    state[collection].loading = false;
  },

  [SET_PREFERENCES](state, { collection, preferences }) {
    Vue.set(state[collection], 'data', preferences);
  },
};

export default mutations;
