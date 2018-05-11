import Vue from "vue";
import { mapValues, keyBy, isEmpty } from "lodash";
import {
  STORE_HYDRATED,
  HYDRATING_FAILED,
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

const mutations = {
  [STORE_HYDRATED](state) {
    state.hydrating = false;
  },

  [HYDRATING_FAILED](state, error) {
    state.hydrating = false;
    state.hydratingError = error;
  },

  [LATENCY](state, info) {
    const latencies = [...state.latency];
    latencies.push(info);

    if (latencies.length > 200) {
      latencies.shift();
    }

    state.latency = latencies;
  },

  [SET_SETTINGS](state, data) {
    state.settings = mapValues(keyBy(data, "key"), obj => obj.value);
  },

  [SET_CURRENT_USER](state, data) {
    state.currentUser = data;
  },

  [UPDATE_CURRENT_USER](state, data) {
    state.currentUser = {
      ...state.currentUser,
      ...data
    };
  },

  [SET_FIELDS](state, { data, collection }) {
    if (isEmpty(state.fields[collection])) {
      Vue.set(state.fields, collection, {});
    }

    state.fields[collection] = keyBy(data, "field");
  },

  [SET_COLLECTIONS](state, data) {
    state.collections = keyBy(data, "collection");
  },

  [SET_BOOKMARKS](state, data) {
    state.bookmarks = data;
  },

  [ADD_BOOKMARK](state, bookmark) {
    state.bookmarks = [...state.bookmarks, bookmark];
  },

  [DELETE_BOOKMARK](state, id) {
    state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== id);
  },

  [UPDATE_PREFERENCE](state, { preference, collection }) {
    Vue.set(state.listingPreferences, collection, {
      ...(state.listingPreferences[collection] || {}),
      ...preference
    });
  },

  [SET_PREFERENCES](state, preferences) {
    state.listingPreferences = keyBy(preferences, "collection");
  },

  [SET_PREFERENCE](state, { collection, preference }) {
    if (isEmpty(state[collection])) {
      Vue.set(state, collection, {});
    }

    Vue.set(state, collection, preference);
  }
};

export default mutations;
