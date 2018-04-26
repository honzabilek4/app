import {
  BOOKMARKS_PENDING,
  BOOKMARKS_SUCCESS,
  BOOKMARKS_FAILED,
  BOOKMARKS_NEW,
  BOOKMARKS_DELETE
} from "../../mutation-types";

export default {
  [BOOKMARKS_PENDING](state) {
    state.loading = true;
  },
  [BOOKMARKS_SUCCESS](state, bookmarks) {
    state.loading = false;
    state.data = bookmarks;
  },
  [BOOKMARKS_FAILED](state, error) {
    state.loading = false;
    state.error = error;
  },
  [BOOKMARKS_NEW](state, bookmark) {
    const bookmarks = [...state.data];
    bookmarks.push(bookmark);
    state.data = bookmarks;
  },
  [BOOKMARKS_DELETE](state, bookmarkID) {
    state.data = state.data.filter(bookmark => bookmark.id !== bookmarkID);
  }
};
