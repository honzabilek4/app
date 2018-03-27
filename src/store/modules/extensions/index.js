import * as actions from './actions';
import mutations from './mutations';

const state = {
  listings: {
    data: null,
    loading: false,
    error: null,
  },
  interfaces: {
    data: null,
    loading: false,
    error: null,
  },
  pages: {
    data: null,
    loading: false,
    error: null,
  },
};

export default {
  state,
  actions,
  mutations,
};
