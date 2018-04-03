import store from './index';
import {
  STORE_HYDRATED,
  HYDRATING_FAILED,
} from './mutation-types';
import { startPolling } from './polling';

export default function hydrateStore() {
  startPolling();

  return Promise.all([
    store.dispatch('latency'),
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
