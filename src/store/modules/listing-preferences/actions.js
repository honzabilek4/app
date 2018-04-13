import api from '../../../api';
import {
  PREFERENCES_PENDING,
  PREFERENCES_SUCCESS,
  PREFERENCES_FAILED,
  SET_PREFERENCES,
} from '../../mutation-types';

export function getListingPreferences({ commit }, collection) {
  commit(PREFERENCES_PENDING, collection);

  return api.getMyListingPreferences(collection)
    .then((data) => {
      commit(PREFERENCES_SUCCESS, { data, collection });
    })
    .catch(error => commit(PREFERENCES_FAILED, { error: Object(error), collection }));
}

export function setListingPreferences({ commit, state, rootState }, { collection, updates }) {
  const preferences = state[collection].data;
  const userPreferencesExist = Boolean(preferences.id) && Boolean(preferences.user);

  // Call setter without waiting for the api to respond with local data, so the view updates
  //   right away
  commit(SET_PREFERENCES, { collection, preferences: { ...preferences, ...updates } });

  if (userPreferencesExist) {
    return api.updateCollectionPreset(preferences.id, updates)
      .then(res => res.data)
      // Commit the view options in case the local options got out of sync with the API's
      .then(savedPreferences => commit(SET_PREFERENCES, {
        collection, preferences: savedPreferences,
      }))
      .catch(console.error);
  }

  return api.createCollectionPreset({
    ...preferences,
    ...updates,
    collection,
    group: rootState.me.data.group,
    user: rootState.me.data.id,
  })
    .then(res => res.data)
  // Commit the view options to add the missing fields to the local version
    .then(savedPreferences => commit(SET_PREFERENCES, {
      collection, preferences: savedPreferences,
    }))
    .catch(console.error);
}
