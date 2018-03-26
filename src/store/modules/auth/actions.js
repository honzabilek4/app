import router from '../../../router';
import hydrateStore from '../../hydrate';
import api from '../../../api';
import extractHostname from '../../../helpers/extract-hostname';

const config = window.__DirectusConfig__; // eslint-disable-line

export function login({ commit }, credentials) {
  commit('LOGIN_PENDING');

  return new Promise((resolve, reject) => {
    api.login({
      ...credentials,
      persist: true,
    })
      .then(hydrateStore)
      .then(info => commit('LOGIN_SUCCESS', {
        ...info,
        projectName: config.api[info.url] || extractHostname(info.url),
      }))
      .then(resolve)
      .catch((error) => {
        commit('LOGIN_FAILED', error);
        reject();
      });
  });
}

export function refresh({ commit }, { token, url }) {
  commit('REFRESH_TOKEN', { token, url });
}

export function logout({ commit }, error) {
  api.logout();
  router.push('/login');
  commit('LOGOUT', error);
}

export function removeAuthError({ commit }) {
  commit('REMOVE_AUTH_ERROR');
}

export function clearAuth({ commit }) {
  commit('LOGOUT');
}
