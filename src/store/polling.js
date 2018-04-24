import store from './index';
import router from '../router';

let fastInterval = null;

export function startPolling() {
  fastInterval = setInterval(() => {
    store.dispatch('latency');
    store.dispatch('imAlive', { page: router.currentRoute.path });
  }, 5000);
}

export function stopPolling() {
  clearInterval(fastInterval);
}
