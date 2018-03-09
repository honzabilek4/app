import router from '../../../router';
import hydrateStore from '../../hydrate';
import api from '../../../api';

export function login({ commit }, credentials) {
  commit('LOGIN_PENDING');

  return new Promise((resolve, reject) => {
    api.login({
      ...credentials,
      persist: true,
    })
      .then(info => commit('LOGIN_SUCCESS', info))
      .then(hydrateStore)
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
