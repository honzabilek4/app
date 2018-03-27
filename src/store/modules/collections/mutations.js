import { keyBy } from 'lodash';
import {
  COLLECTIONS_PENDING,
  COLLECTIONS_SUCCESS,
  COLLECTIONS_FAILED,
} from '../../mutation-types';

const mutations = {
  [COLLECTIONS_PENDING](state) {
    state.loading = true;
  },

  [COLLECTIONS_SUCCESS](state, data) {
    state.data = keyBy(data, 'collection');
    state.error = null;
    state.loading = false;
  },

  [COLLECTIONS_FAILED](state, error) {
    state.error = error;
    state.loading = false;
  },
};

export default mutations;
