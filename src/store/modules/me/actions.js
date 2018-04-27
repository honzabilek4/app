import api from "../../../api";

import {
  ME_PENDING,
  ME_SUCCESS,
  ME_FAILED,
  ME_UPDATE
} from "../../mutation-types";

export function getMe({ commit }) {
  // eslint-disable-line
  commit(ME_PENDING);

  return api
    .getMe()
    .then(res => res.data)
    .then(data => commit(ME_SUCCESS, data))
    .catch(error => commit(ME_FAILED, Object(error)));
}

export function track({ commit, state }, { page }) {
  const currentUserID = state.data.id;

  const data = {
    last_page: page
  };

  commit(ME_UPDATE, data);
  return api.request(
    "PATCH",
    `/users/${currentUserID}/tracking/page`,
    {},
    data
  );
}
