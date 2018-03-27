import { keyBy, isEmpty } from 'lodash';
import Vue from 'vue';
import { FIELDS_PENDING, FIELDS_SUCCESS, FIELDS_FAILED } from '../../mutation-types';

const mutations = {
  [FIELDS_PENDING](state, collection) {
    if (isEmpty(state[collection])) {
      Vue.set(state, collection, {
        data: null,
        error: null,
        loading: false,
      });
    }

    state[collection].loading = true;
  },

  [FIELDS_SUCCESS](state, { data, collection }) {
    state[collection].data = keyBy(data, 'field');
    state[collection].error = null;
    state[collection].loading = false;
  },

  [FIELDS_FAILED](state, { collection, error }) {
    state[collection].error = error;
    state[collection].loading = false;
  },
};

export default mutations;
