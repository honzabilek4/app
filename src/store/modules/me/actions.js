import api from "../../../api";
import helpers from "../../../helpers";

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

export function imAlive({ commit, state }, { page }) {
  const nowSQL = helpers.date.dateToSql(new Date());
  const data = {
    last_access: nowSQL,
    last_page: page
  };

  commit(ME_UPDATE, data);
  return api.updateUser(state.data.id, data);
}
