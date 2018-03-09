import { isEmpty } from 'lodash';
import Vue from 'vue';

export function PREFERENCES_PENDING(state, collection) {
  if (isEmpty(state[collection])) {
    Vue.set(state, collection, {
      data: null,
      error: null,
      loading: false,
    });
  }

  state[collection].loading = true;
}

export function PREFERENCES_SUCCESS(state, { data, collection }) {
  Vue.set(state[collection], 'data', data);
  state[collection].error = null;
  state[collection].loading = false;
}

export function PREFERENCES_FAILED(state, { collection, error }) {
  state[collection].error = error;
  state[collection].loading = false;
}

export function SET_PREFERENCES(state, { collection, preferences }) {
  Vue.set(state[collection], 'data', preferences);
}
