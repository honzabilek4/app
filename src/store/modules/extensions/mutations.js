import { keyBy } from 'lodash';
import {
  INTERFACES_PENDING,
  INTERFACES_SUCCESS,
  INTERFACES_FAILED,
  LISTINGS_PENDING,
  LISTINGS_SUCCESS,
  LISTINGS_FAILED,
  PAGES_PENDING,
  PAGES_SUCCESS,
  PAGES_FAILED,
} from '../../mutation-types';

const mutations = {
  [INTERFACES_PENDING](state) {
    state.interfaces.loading = true;
  },

  [INTERFACES_SUCCESS](state, interfaces) {
    state.interfaces.loading = false;
    state.interfaces.data = keyBy(interfaces, 'id');
    state.interfaces.error = null;
  },

  [INTERFACES_FAILED](state, error) {
    state.interfaces.loading = false;
    state.interfaces.error = error;
  },

  [LISTINGS_PENDING](state) {
    state.pages.loading = true;
  },

  [LISTINGS_SUCCESS](state, listings) {
    state.listings.loading = false;
    state.listings.data = keyBy(listings, 'id');
    state.listings.error = null;
  },

  [LISTINGS_FAILED](state, error) {
    state.listings.loading = false;
    state.listings.error = error;
  },

  [PAGES_PENDING](state) {
    state.pages.loading = true;
  },

  [PAGES_SUCCESS](state, pages) {
    state.pages.loading = false;
    state.pages.data = keyBy(pages, 'id');
    state.pages.error = null;
  },

  [PAGES_FAILED](state, error) {
    state.pages.loading = false;
    state.pages.error = error;
  },
};

export default mutations;
