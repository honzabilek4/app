import router from '../../../router';

export function logout({ commit }) { // eslint-disable-line
  router.push('/login');

  commit('logout');
}
