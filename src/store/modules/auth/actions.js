import jwtPayload from "@rijk/jwt-payload";
import api from "../../../api";
import router from "../../../router";
import extractHostname from "../../../helpers/extract-hostname";
import { resetState } from "../../index";
import {
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  REFRESH_TOKEN,
  REMOVE_AUTH_ERROR,
  LOGOUT
} from "../../mutation-types";
import { stopPolling } from "../../../polling";

const config = window.__DirectusConfig__; // eslint-disable-line

export function login({ commit }, credentials) {
  commit(LOGIN_PENDING);

  return api
    .login({
      ...credentials,
      persist: true
    })
    .then(info => {
      commit(LOGIN_SUCCESS, {
        ...info,
        projectName: config.api[info.url] || extractHostname(info.url)
      });
    })
    .catch(error => {
      commit(LOGIN_FAILED, error);
      throw error;
    });
}

export function loginSSO({ commit }, request_token) {
  commit(LOGIN_PENDING);

  /**
   * Yes this is a very hacky way of achieving this. It's just an alpha okay, take it easy.
   *
   * I have to refactor the auth flow quite a bit to accomodate for the project switcher modal too
   *   so I'm not too worried about hacking in this as a proof of concept.
   */
  const { url, env } = jwtPayload(request_token);
  api.url = url;
  api.env = env;

  return api
    .request(
      "POST",
      "/auth/access_token",
      {},
      {
        request_token
      }
    )
    .then(res => res.data)
    .then(({ token }) => {
      api.token = token;

      commit(LOGIN_SUCCESS, {
        env,
        url,
        token,
        projectName: config.api[url] || extractHostname(url)
      });
    });
}

export function refresh({ commit }, { token, url }) {
  commit(REFRESH_TOKEN, { token, url });
}

export function logout({ commit }, error) {
  stopPolling();
  api.logout();
  resetState();
  router.push("/login");
  commit(LOGOUT, error);
}

export function removeAuthError({ commit }) {
  commit(REMOVE_AUTH_ERROR);
}

export function clearAuth({ commit }) {
  commit(LOGOUT);
}
