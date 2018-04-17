import store from './index';
import {
  STORE_HYDRATED,
  HYDRATING_FAILED,
} from './mutation-types';
import { startPolling } from './polling';

export default function hydrateStore() {
  return Promise.all([
    store.dispatch('latency'),
    store.dispatch('getAllUserListingPreferences'),
    store.dispatch('getCollections'),
    store.dispatch('getMe'),
    store.dispatch('getSettings'),
    store.dispatch('getAllExtensions'),
    store.dispatch('getBookmarks'),
  ])
    .then(() => {
      store.commit(STORE_HYDRATED);
      startPolling();
    })
    .catch((error) => {
      store.commit(HYDRATING_FAILED, error);
    });
}
