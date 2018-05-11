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
