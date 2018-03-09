import { forEach, mapKeys } from 'lodash';
import api from '../../../api';
import { i18n } from '../../../lang/';

// NOTE: These functions are indeed pretty similar, but it wouldn't surprise me if some of these
//   will be getting more exceptions in the future.

// NOTE: The translations are prefixed with the above type prefix plus the identifier of the
//   extensions:
// in-checkboxes-choices

export function getInterfaces({ commit }) {
  commit('INTERFACES_PENDING');
  return api.getInterfaces()
    .then(res => res.data)
    .then((interfaces) => {
      commit('INTERFACES_SUCCESS', interfaces);
      return interfaces;
    })
    .then((interfaces) => {
      interfaces.forEach((inter) => {
        if (inter.translation) {
          forEach(inter.translation, (messages, locale) => {
            i18n.mergeLocaleMessage(locale, mapKeys(messages, (value, key) => `in-${inter.id}-${key}`));
          });
        }
      });
    })
    .catch((error) => {
      commit('INTERFACES_FAILED', error);
    });
}

export function getListings({ commit }) {
  commit('LISTINGS_PENDING');
  return api.getListings()
    .then(res => res.data)
    .then((listings) => {
      commit('LISTINGS_SUCCESS', listings);
      return listings;
    })
    .then((listings) => {
      listings.forEach((listing) => {
        if (listing.translation) {
          forEach(listing.translation, (messages, locale) => {
            i18n.mergeLocaleMessage(locale, mapKeys(messages, (value, key) => `ls-${listing.id}-${key}`));
          });
        }
      });
    })
    .catch((error) => {
      commit('LISTINGS_FAILED', error);
    });
}

export function getPages({ commit }) {
  commit('PAGES_PENDING');
  return api.getPages()
    .then(res => res.data)
    .then((pages) => {
      commit('PAGES_SUCCESS', pages);
      return pages;
    })
    .then((pages) => {
      pages.forEach((page) => {
        if (page.translation) {
          forEach(page.translation, (messages, locale) => {
            i18n.mergeLocaleMessage(locale, mapKeys(messages, (value, key) => `pg-${page.id}-${key}`));
          });
        }
      });
    })
    .catch((error) => {
      commit('PAGES_FAILED', error);
    });
}

export function getExtensions({ dispatch }) {
  return Promise.all([
    dispatch('getInterfaces'),
    dispatch('getPages'),
    dispatch('getListings'),
  ]);
}
