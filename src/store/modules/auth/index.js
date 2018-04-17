import * as actions from './actions';
import mutations from './mutations';
import * as getters from './getters';

const state = {
  token: null,
  url: null,
  env: '_',
  error: null,
  loading: false,
  projectName: null,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
