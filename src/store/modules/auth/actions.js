import router from '../../../router';

export function loginSuccess({ commit }, { accessToken, url }) {
  commit('loginSuccess', { accessToken, url });
}

export function refreshSuccess({ commit }, { accessToken, url }) {
  commit('refreshSuccess', { accessToken, url });
}

export function logout({ commit }, opt) {
  const defaults = {
    redirect: true,
  };

  const options = Object.assign({}, defaults, opt);

  if (options.redirect) {
    router.push('/login');
  }
  commit('logout');
}
