import Vue from 'vue';

export function DISCARD_CHANGES(state) {
  state.saving = false;
  state.error = null;
  state.collection = null;
  state.primaryKey = null;
  state.values = {};
}

export function ITEM_CREATED(state) {
  state.saving = false;
  state.error = null;
  state.collection = null;
  state.primaryKey = null;
  state.values = {};
}

export function START_EDITING(state, { collection, primaryKey, savedValues }) {
  state.collection = collection;
  state.primaryKey = primaryKey;
  state.savedValues = savedValues;
}

export function UNSTAGE_VALUE(state, { field }) {
  Vue.delete(state.values, field);
}

export function STAGE_VALUE(state, { field, value }) {
  Vue.set(state.values, field, value);
}
