export function LOGIN_PENDING(state) {
  state.loading = true;
}

export function LOGIN_SUCCESS(state, info) {
  state.loading = false;
  state.error = null;
  state.token = info.token;
  state.env = info.env;
  state.url = info.url;
  state.projectName = info.projectName;
}

export function LOGIN_FAILED(state, error) {
  state.token = null;
  state.url = null;
  state.env = null;
  state.projectName = null;
  state.loading = false;
  state.error = error;
}

export function LOGOUT(state, error) {
  state.token = null;
  state.url = null;
  state.env = null;
  state.projectName = null;
  state.loading = false;
  state.error = error;
}

export function REFRESH_TOKEN(state, info) {
  state.loading = false;
  state.error = null;
  state.token = info.token;
  state.env = info.env;
  state.url = info.url;
}

export function REMOVE_AUTH_ERROR(state) {
  state.error = null;
}
