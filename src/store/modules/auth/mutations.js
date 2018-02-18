export function login(state) {
  state.loading = true;
}

export function loginSuccess(state, { accessToken, url }) {
  state.loading = false;
  state.error = null;
  state.accessToken = accessToken;
  state.url = url;
}

export function loginFailed(state, error) {
  state.loading = false;
  state.error = Object(error);
  state.accessToken = null;
  state.url = null;
}

export function refreshSuccess(state, { accessToken, url }) {
  state.loading = false;
  state.error = null;
  state.accessToken = accessToken;
  state.url = url;
}

export function logout(state) {
  state.loading = false;
  state.error = null;
  state.accessToken = null;
  state.url = null;
}
