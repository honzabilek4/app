import api from '../../../api';

export function getMe({ commit }) { // eslint-disable-line
  commit('ME_PENDING');

  return api.getMe()
    .then(res => res.data)
    .then(data => commit('ME_SUCCESS', data))
    .catch(error => commit('ME_FAILED', Object(error)));
}
