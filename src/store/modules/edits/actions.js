import api from '../../../api';
import {
  DISCARD_CHANGES,
  START_EDITING,
  STAGE_VALUE,
  UNSTAGE_VALUE,
  ITEM_CREATED,
} from '../../mutation-types';

export function discardChanges({ commit }) {
  commit(DISCARD_CHANGES);
}

export function startEditing({ commit }, { collection, primaryKey, savedValues }) {
  commit(START_EDITING, { collection, primaryKey, savedValues });
}

export function stageValue({ commit, state }, { field, value }) {
  // NOTE: Don't check type here, since the original value can be a number, but the edited value
  //   might be a string if it comes from the fallback interface
  if (state.savedValues[field] == value) { // eslint-disable-line eqeqeq
    return commit(UNSTAGE_VALUE, { field });
  }
  return commit(STAGE_VALUE, { field, value });
}

export function save({ commit, state }, overrides) {
  function commitCreated(res) {
    commit(ITEM_CREATED);
    return res;
  }

  const info = {
    ...state,
    ...overrides,
  };

  if (info.primaryKey === '+') {
    return api.createItem(info.collection, info.values)
      .then(commitCreated);
  }

  return api.updateItem(info.collection, info.primaryKey, info.values)
    .then(commitCreated);
}
