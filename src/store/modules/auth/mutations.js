export function login(state) {
  state.loading = true;
}

export function loginSuccess(state) {
  state.loading = false;
  state.loggedIn = true;
  state.error = null;
}

export function loginFailed(state, error) {
  state.loading = false;
  state.loggedIn = false;
  state.error = Object(error);
}

export function logout(state) {
  state.loading = false;
  state.loggedIn = false;
  state.error = null;
}
