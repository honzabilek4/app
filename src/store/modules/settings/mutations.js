import { set } from 'lodash';

export function SETTINGS_PENDING(state) {
  state.loading = true;
}

export function SETTINGS_SUCCESS(state, data) {
  const settings = {};

  data.forEach(({
    scope, group, key, value,
  }) => {
    if (group.length) {
      set(settings, [scope, group, key], value);
      return;
    }

    set(settings, [scope, key], value);
  });

  state.data = settings;
  state.error = null;
  state.loading = false;
}

export function SETTINGS_FAILED(state, error) {
  state.error = error;
  state.loading = false;
}
