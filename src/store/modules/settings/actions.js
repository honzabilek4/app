import api from '../../../api';

export function getSettings({ commit }) { // eslint-disable-line
  commit('SETTINGS_PENDING');

  return api.getSettings()
    .then(res => res.data)
    .then(data => commit('SETTINGS_SUCCESS', data))
    .catch(error => commit('SETTINGS_FAILED', Object(error)));
}
