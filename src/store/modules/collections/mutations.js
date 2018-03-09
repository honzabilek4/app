import { keyBy } from 'lodash';

export function COLLECTIONS_PENDING(state) {
  state.loading = true;
}

export function COLLECTIONS_SUCCESS(state, data) {
  state.data = keyBy(data, 'collection');
  state.error = null;
  state.loading = false;
}

export function COLLECTIONS_FAILED(state, error) {
  state.error = error;
  state.loading = false;
}
