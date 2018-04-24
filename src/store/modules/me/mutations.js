import { ME_PENDING, ME_SUCCESS, ME_FAILED, ME_UPDATE } from '../../mutation-types';

const mutations = {
  [ME_PENDING](state) {
    state.loading = true;
  },

  [ME_SUCCESS](state, data) {
    state.data = data;
    state.error = null;
    state.loading = false;
  },

  [ME_FAILED](state, error) {
    state.error = error;
    state.loading = false;
  },

  [ME_UPDATE](state, updates) {
    state.data = {
      ...state.data,
      ...updates,
    };
  },
};

export default mutations;
