import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';

export const state = {
  collection: null,
  primaryKey: null,
  values: {},
  savedValues: {},
};

export default {
  actions,
  mutations,
  state,
  getters,
};
