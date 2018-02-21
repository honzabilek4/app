export function toggleNav({ commit, state }, visible = !state.navActive) { // eslint-disable-line
  commit('toggleNav', visible);
}
