export function STORE_HYDRATED(state) {
  state.hydrating = false;
}

export function HYDRATING_FAILED(state, error) {
  state.hydrating = false;
  state.hydratingError = error;
}
