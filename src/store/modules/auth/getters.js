import jwtPayload from "@rijk/jwt-payload";

export function tokenPayload(state) {
  if (state.token) {
    const payload = jwtPayload(state.token);
    if (payload.exp && Number.isInteger(payload.exp)) {
      payload.exp = new Date(payload.exp * 1000);
    }
    return payload;
  }

  return null;
}

export function loggedIn(state) {
  if (
    state.token &&
    state.token.length > 0 &&
    state.url &&
    state.url.length > 0 &&
    tokenPayload(state).exp > new Date()
  ) {
    return true;
  }

  return false;
}
