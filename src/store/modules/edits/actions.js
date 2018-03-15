import api from '../../../api';

export function discardChanges({ commit }) {
  commit('DISCARD_CHANGES');
}

export function startEditing({ commit }, { collection, primaryKey, savedValues }) {
  commit('START_EDITING', { collection, primaryKey, savedValues });
}

export function stageValue({ commit, state }, { field, value }) {
  // NOTE: Don't check type here, since the original value can be a number, but the edited value
  //   might be a string if it comes from the fallback interface
  if (state.savedValues[field] == value) { // eslint-disable-line eqeqeq
    return commit('UNSTAGE_VALUE', { field });
  }
  return commit('STAGE_VALUE', { field, value });
}

export function save({ commit, state }) {
  function commitCreated(res) {
    commit('ITEM_CREATED');
    return res;
  }

  if (state.primaryKey === '+') {
    return api.createItem(state.collection, state.values)
      .then(commitCreated);
  }

  return api.updateItem(state.collection, state.primaryKey, state.values)
    .then(commitCreated);
}
