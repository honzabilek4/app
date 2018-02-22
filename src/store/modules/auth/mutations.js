export function loginSuccess(state, { accessToken, url }) {
  state.accessToken = accessToken;
  state.url = url;
}

export function refreshSuccess(state, { accessToken, url }) {
  state.accessToken = accessToken;
  state.url = url;
}

export function logout(state) {
  state.accessToken = null;
  state.url = null;
}
