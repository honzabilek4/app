import { keyBy, isEmpty } from 'lodash';
import Vue from 'vue';

export function FIELDS_PENDING(state, collection) {
  if (isEmpty(state[collection])) {
    Vue.set(state, collection, {
      data: null,
      error: null,
      loading: false,
    });
  }

  state[collection].loading = true;
}

export function FIELDS_SUCCESS(state, { data, collection }) {
  state[collection].data = keyBy(data, 'field');
  state[collection].error = null;
  state[collection].loading = false;
}

export function FIELDS_FAILED(state, { collection, error }) {
  state[collection].error = error;
  state[collection].loading = false;
}
