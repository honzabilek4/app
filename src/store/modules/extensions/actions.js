import { forEach, mapKeys, isObject, mapValues } from 'lodash';
import api from '../../../api';
import { i18n } from '../../../lang/';

/**
 * Recursively loop over object values and replace each string value that starts with $t: with it's
 *   translation as managed by vue-i18n
 * @param  {Object} meta Object to loop over
 * @param  {String} type Extension type
 * @param  {String} id   Extension ID
 * @return {Object}      Formatted object
 */
function translateFields(meta, type, id) {
  const format = (value) => {
    if (value == null) return value;

    if (typeof value === 'string') {
      // split up the sentence into separate words to allow multiple translations in one value
      //   like $t:option $t:or $t:value
      return value
        .split(' ')
        .map(word => (word.startsWith('$t:') ? i18n.t(`${type}-${id}-${word.substring(3)}`) : word))
        .join(' ');
    }

    if (
      (isObject(value) && Object.keys(value).length > 0) ||
      (Array.isArray(value) && value.length > 0)
    ) {
      return translateFields(value, type, id);
    }

    return value;
  };

  return Array.isArray(meta) ? meta.map(format) : mapValues(meta, format);
}

/**
 * Get extensions by type
 * @param  {Function} commit Vuex Commit function
 * @param  {String} type     Extension type to fetch records of
 * @return {[type]}        [description
 */
export function getExtensions({ commit }, type) {
  const typeUpper = type.toUpperCase();

  let request = null;

  switch (type) {
    case 'interfaces':
      request = api.getInterfaces();
      break;
    case 'listings':
      request = api.getListings();
      break;
    case 'pages':
      request = api.getPages();
      break;
    default:
  }

  commit(`${typeUpper}_PENDING`);

  return request
    .then(res => res.data)

    /**
      Merge all available translations into vue-i18n

      Prefix by type and id
    */
    .then((extensions) => {
      extensions.forEach((extension) => {
        const { id, translation } = extension;

        if (translation) {
          forEach(translation, (messages, locale) => {
            i18n.mergeLocaleMessage(locale, mapKeys(messages, (value, key) => `${type}-${id}-${key}`));
          });
        }
      });

      return extensions;
    })

    /**
     * Replace all to-be-translated strings (prefixed with $t: )
     *   with previously registered translations
     */
    .then(extensions => extensions.map(extension => translateFields(extension, type, extension.id)))

    /**
     * Commit parsed extensions to the store
     */
    .then((extensions) => {
      commit(`${typeUpper}_SUCCESS`, extensions);
    })
    .catch((error) => {
      commit(`${typeUpper}_FAILED`, error);
    });
}

/**
 * Get all extensions
 * @param  {Function} dispatch Vuex dispatch function
 * @return {Promise}           Fires getExtensions for each extension type
 */
export function getAllExtensions({ dispatch }) {
  return Promise.all([
    dispatch('getExtensions', 'interfaces'),
    dispatch('getExtensions', 'listings'),
    dispatch('getExtensions', 'pages'),
  ]);
}
