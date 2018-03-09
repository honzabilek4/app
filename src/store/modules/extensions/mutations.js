import { keyBy } from 'lodash';

export function INTERFACES_PENDING(state) {
  state.interfaces.loading = true;
}

export function INTERFACES_SUCCESS(state, interfaces) {
  state.interfaces.loading = false;
  state.interfaces.data = keyBy(interfaces, 'id');
  state.interfaces.error = null;
}

export function INTERFACES_FAILED(state, error) {
  state.interfaces.loading = false;
  state.interfaces.error = error;
}

export function LISTINGS_PENDING(state) {
  state.pages.loading = true;
}

export function LISTINGS_SUCCESS(state, listings) {
  state.listings.loading = false;
  state.listings.data = keyBy(listings, 'id');
  state.listings.error = null;
}

export function LISTINGS_FAILED(state, error) {
  state.listings.loading = false;
  state.listings.error = error;
}

export function PAGES_PENDING(state) {
  state.pages.loading = true;
}

export function PAGES_SUCCESS(state, pages) {
  state.pages.loading = false;
  state.pages.data = keyBy(pages, 'id');
  state.pages.error = null;
}

export function PAGES_FAILED(state, error) {
  state.pages.loading = false;
  state.pages.error = error;
}
