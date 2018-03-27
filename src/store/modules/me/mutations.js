import { ME_PENDING, ME_SUCCESS, ME_FAILED } from '../../mutation-types';

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
};

export default mutations;
