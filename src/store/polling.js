import store from './index';

let fastInterval = null;

export function startPolling() {
  fastInterval = setInterval(() => {
    store.dispatch('latency');
  }, 5000);
}

export function stopPolling() {
  clearInterval(fastInterval);
}
