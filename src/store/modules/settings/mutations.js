import { mapValues, keyBy } from 'lodash';
import { SETTINGS_PENDING, SETTINGS_SUCCESS, SETTINGS_FAILED } from '../../mutation-types';

const mutations = {
  [SETTINGS_PENDING](state) {
    state.loading = true;
  },

  [SETTINGS_SUCCESS](state, data) {
    state.data = mapValues(keyBy(data, 'key'), obj => obj.value);
    state.error = null;
    state.loading = false;
  },

  [SETTINGS_FAILED](state, error) {
    state.error = error;
    state.loading = false;
  },
};

export default mutations;
