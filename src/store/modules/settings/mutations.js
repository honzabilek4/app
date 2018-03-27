import { set } from 'lodash';
import { SETTINGS_PENDING, SETTINGS_SUCCESS, SETTINGS_FAILED } from '../../mutation-types';

const mutations = {
  [SETTINGS_PENDING](state) {
    state.loading = true;
  },

  [SETTINGS_SUCCESS](state, data) {
    const settings = {};
    data.forEach(({
      scope, group, key, value,
    }) => {
      if (group.length) {
        set(settings, [scope, group, key], value);
        return;
      }

      set(settings, [scope, key], value);
    });

    state.data = settings;
    state.error = null;
    state.loading = false;
  },

  [SETTINGS_FAILED](state, error) {
    state.error = error;
    state.loading = false;
  },
};

export default mutations;
