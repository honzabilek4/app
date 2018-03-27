import { STORE_HYDRATED, HYDRATING_FAILED } from './mutation-types';

const mutations = {
  [STORE_HYDRATED](state) {
    state.hydrating = false;
  },

  [HYDRATING_FAILED](state, error) {
    state.hydrating = false;
    state.hydratingError = error;
  },
};

export default mutations;
