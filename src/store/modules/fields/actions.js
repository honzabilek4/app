import { isEmpty, forEach } from 'lodash';
import { i18n, availableLanguages } from '../../../lang/';
import api from '../../../api';
import formatName from '../../../helpers/format-name';
import {
  FIELDS_PENDING,
  FIELDS_SUCCESS,
  FIELDS_FAILED,
} from '../../mutation-types';

export function getFields({ commit }, collection) { // eslint-disable-line
  commit(FIELDS_PENDING, collection);

  return api.getFields(collection)
    .then(res => res.data)
    .then((data) => {
      commit(FIELDS_SUCCESS, { data, collection });

      forEach(data, (field) => {
        if (!isEmpty(field.translation)) {
          forEach(field.translation, (value, locale) => {
            i18n.mergeLocaleMessage(locale, { [`fn-${field.field}`]: value });
          });
        } else {
          forEach(availableLanguages, (locale) => {
            i18n.mergeLocaleMessage(locale, { [`fn-${field.field}`]: formatName(field.field) });
          });
        }
      });
    })
    .catch(error => commit(FIELDS_FAILED, { error: Object(error), collection }));
}
