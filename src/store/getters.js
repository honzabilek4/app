export function signalStrength(state) { // eslint-disable-line
  let lastLatency = state.latency[state.latency.length - 1];

  if (!lastLatency) {
    return 0;
  }

  lastLatency = lastLatency.latency;

  if (lastLatency > 0 && lastLatency < 100) {
    return 4;
  }

  if (lastLatency >= 100 && lastLatency < 150) {
    return 3;
  }

  if (lastLatency >= 150 && lastLatency < 200) {
    return 2;
  }

  if (lastLatency >= 200) {
    return 1;
  }

  return 0;
}
