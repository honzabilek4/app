import api from '../api';
import { LATENCY } from './mutation-types';

export function latency({ commit }) { // eslint-disable-line
  const start = performance.now();
  const now = Date.now();

  api.request('get', '/server/ping', {}, {}, true)
    .then(() => {
      const end = performance.now();
      const delta = end - start;
      commit(LATENCY, {
        date: now,
        latency: delta,
      });
    })
    .catch((err) => {
      console.error(err); // eslint-disable-line
      commit(LATENCY, {
        date: now,
        latency: -1,
      });
    });
}
