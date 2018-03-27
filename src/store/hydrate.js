import store from './index';
import {
  STORE_HYDRATED,
  HYDRATING_FAILED,
} from './mutation-types';

export default function hydrateStore() {
  return Promise.all([
    store.dispatch('getCollections'),
    store.dispatch('getMe'),
    store.dispatch('getSettings'),
    store.dispatch('getAllExtensions'),
  ])
    .then(() => {
      store.commit(STORE_HYDRATED);
    })
    .catch((error) => {
      store.commit(HYDRATING_FAILED, error);
      throw error;
    });
}
