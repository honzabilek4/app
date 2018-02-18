import * as actions from './actions';
import * as mutations from './mutations';

const state = {
  loading: false,
  error: null,
  accessToken: null,
  url: null,
};

export default {
  state,
  actions,
  mutations,
};
