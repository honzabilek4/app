import api from "../../../api";

import {
  BOOKMARKS_PENDING,
  BOOKMARKS_SUCCESS,
  BOOKMARKS_FAILED,
  BOOKMARKS_NEW,
  BOOKMARKS_DELETE
} from "../../mutation-types";

export function getBookmarks({ commit }) {
  commit(BOOKMARKS_PENDING);
  return api
    .getMyBookmarks()
    .then(bookmarks => {
      commit(BOOKMARKS_SUCCESS, bookmarks);
      return bookmarks;
    })
    .catch(error => {
      commit(BOOKMARKS_FAILED, error);
      throw error;
    });
}

export function saveBookmark({ commit }, bookmark) {
  return api.createCollectionPreset(bookmark).then(res => {
    const savedBookmark = res.data;
    commit(BOOKMARKS_NEW, savedBookmark);
    return savedBookmark;
  });
}

export function deleteBookmark({ commit }, bookmarkID) {
  commit(BOOKMARKS_DELETE, bookmarkID);
  return api.deleteCollectionPreset(bookmarkID).catch(console.error);
}
