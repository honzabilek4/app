import api from "../api";
import { forEach, isEmpty } from "lodash";
import formatTitle from "@directus/format-title";
import { i18n, availableLanguages } from "../lang/";
import {
  LATENCY,
  SET_SETTINGS,
  SET_CURRENT_USER,
  UPDATE_CURRENT_USER,
  SET_FIELDS,
  SET_COLLECTIONS,
  SET_BOOKMARKS,
  ADD_BOOKMARK,
  DELETE_BOOKMARK,
  UPDATE_PREFERENCE,
  SET_PREFERENCES,
  SET_PREFERENCE
} from "./mutation-types";

export function latency({ commit }) {
  const start = performance.now();
  const now = Date.now();

  api
    .request("get", "/server/ping", {}, {}, true)
    .then(() => {
      const end = performance.now();
      const delta = end - start;
      commit(LATENCY, {
        date: now,
        latency: delta
      });
    })
    .catch(() => {
      commit(LATENCY, {
        date: now,
        latency: -1
      });
    });
}

export function getSettings({ commit }) {
  return api
    .getSettings()
    .then(res => res.data)
    .then(data => commit(SET_SETTINGS, data));
}

export function getCurrentUser({ commit }) {
  return api
    .getMe()
    .then(res => res.data)
    .then(data => commit(SET_CURRENT_USER, data));
}

export function track({ commit, state }, { page }) {
  const currentUserID = state.currentUser.id;

  const data = {
    last_page: page
  };

  commit(UPDATE_CURRENT_USER, data);
  return api.request(
    "PATCH",
    `/users/${currentUserID}/tracking/page`,
    {},
    data
  );
}

export function getFields({ commit }, collection) {
  return api
    .getFields(collection)
    .then(res => res.data)
    .then(data => {
      commit(SET_FIELDS, { data, collection });

      forEach(data, field => {
        // TODO: Move this to a function of the /lang/index.js file
        if (!isEmpty(field.translation)) {
          forEach(field.translation, (value, locale) => {
            i18n.mergeLocaleMessage(locale, {
              [`fields-${collection}-${field.field}`]: value
            });
          });
        } else {
          forEach(availableLanguages, locale => {
            i18n.mergeLocaleMessage(locale, {
              [`fields-${collection}-${field.field}`]: formatTitle(field.field)
            });
          });
        }
      });
    });
}

export function getCollections({ commit }) {
  return api
    .getCollections()
    .then(res => res.data)
    .then(data => {
      forEach(data, collection => {
        if (!isEmpty(collection.translation)) {
          forEach(collection.translation, (value, locale) => {
            i18n.mergeLocaleMessage(locale, {
              [`collections-${collection.collection}`]: value
            });
          });
        } else {
          forEach(availableLanguages, locale => {
            i18n.mergeLocaleMessage(locale, {
              [`collections-${collection.collection}`]: formatTitle(
                collection.collection
              )
            });
          });
        }
      });

      commit(SET_COLLECTIONS, data);
    });
}

export function getBookmarks({ commit }) {
  return api.getMyBookmarks().then(bookmarks => {
    commit(SET_BOOKMARKS, bookmarks);
    return bookmarks;
  });
}

export function saveBookmark({ commit }, bookmark) {
  return api.createCollectionPreset(bookmark).then(res => {
    const savedBookmark = res.data;
    commit(ADD_BOOKMARK, savedBookmark);
    return savedBookmark;
  });
}

export function deleteBookmark({ commit }, bookmarkID) {
  commit(DELETE_BOOKMARK, bookmarkID);
  return api.deleteCollectionPreset(bookmarkID).catch(console.error);
}

export function getAllUserListingPreferences({ commit, getters }) {
  return api
    .getItems("directus_collection_presets", {
      "filter[title][null]": 1,
      "filter[user][eq]": getters.tokenPayload.id
    })
    .then(res => res.data)
    .then(preferences => {
      commit(SET_PREFERENCES, preferences);
    });
}

export function getListingPreferences({ commit }, collection) {
  return api.getMyListingPreferences(collection).then(preference => {
    commit(SET_PREFERENCE, { preference, collection });
  });
}

export function setListingPreferences(
  { commit, state },
  { collection, updates }
) {
  const preferences = state.listingPreferences[collection];

  const userPreferencesExist =
    preferences && Boolean(preferences.id) && Boolean(preferences.user);

  // Call setter without waiting for the api to respond with local data, so the view updates
  //   right away
  commit(UPDATE_PREFERENCE, {
    collection,
    preference: updates
  });

  if (userPreferencesExist) {
    return api.updateCollectionPreset(preferences.id, updates);
  }

  return (
    api
      .createCollectionPreset({
        ...preferences,
        ...updates,
        collection,
        group: state.currentUser.group,
        user: state.currentUser.id
      })
      .then(res => res.data)
      // Commit the view options to add the missing fields to the local version
      .then(savedPreferences =>
        commit(UPDATE_PREFERENCE, {
          collection,
          preference: savedPreferences
        })
      )
  );
}

export function resetPreferences({ dispatch, state }, { collection }) {
  const preference = state[collection];

  if (!preference) return Promise.reject();

  const isUserPreference = preference.user != null;

  if (isUserPreference === false) return Promise.reject();

  return api
    .deleteCollectionPreset(preference.id)
    .then(() => dispatch("getListingPreferences", collection));
}
