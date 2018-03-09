export function ME_PENDING(state) {
  state.loading = true;
}

export function ME_SUCCESS(state, data) {
  state.data = data;
  state.error = null;
  state.loading = false;
}

export function ME_FAILED(state, error) {
  state.error = error;
  state.loading = false;
}
