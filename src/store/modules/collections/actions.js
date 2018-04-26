import formatTitle from "@directus/format-title";
import { isEmpty, forEach } from "lodash";
import { i18n, availableLanguages } from "../../../lang/";
import api from "../../../api";
import {
  COLLECTIONS_PENDING,
  COLLECTIONS_SUCCESS,
  COLLECTIONS_FAILED
} from "../../mutation-types";

export function getCollections({ commit }) {
  // eslint-disable-line
  commit(COLLECTIONS_PENDING);

  return api
    .getCollections()
    .then(res => res.data)
    .then(data => {
      commit(COLLECTIONS_SUCCESS, data);

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
    })
    .catch(error => commit(COLLECTIONS_FAILED, Object(error)));
}
