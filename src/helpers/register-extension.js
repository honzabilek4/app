import Vue from 'vue';
import api from '../api';
import store from '../store';
import prefixes from './prefixes';
import loadExtension from './load-extension';
import InterfaceFallback from '../components/extensions/InterfaceFallback.vue';
import InterfaceReadonlyFallback from '../components/extensions/InterfaceReadonlyFallback.vue';
import InterfaceLoading from '../components/extensions/InterfaceLoading.vue';
import InterfaceReadonlyLoading from '../components/extensions/InterfaceReadonlyLoading.vue';
import ListingFallback from '../components/extensions/ListingFallback.vue';
import ListingOptionsFallback from '../components/extensions/ListingOptionsFallback.vue';
import ListingLoading from '../components/extensions/ListingLoading.vue';
import ListingOptionsLoading from '../components/extensions/ListingOptionsLoading.vue';

export function registerInterface(name) {
  const extensionExists = Boolean(store.state.extensions.interfaces.data[name]);

  if (extensionExists === false) {
    Vue.component(`${prefixes.interface}-${name}`, InterfaceFallback);
    Vue.component(`${prefixes.interfaceReadonly}-${name}`, InterfaceReadonlyFallback);
    return;
  }

  const info = store.state.extensions.interfaces.data[name];

  Vue.component(`${prefixes.interface}-${info.id}`, () => ({
    component: loadExtension(`${api.url}/${info.path.replace('meta.json', 'Interface.js')}`),
    error: InterfaceFallback,
    loading: InterfaceLoading,
  }));

  Vue.component(`${prefixes.interfaceReadonly}-${info.id}`, () => ({
    component: loadExtension(`${api.url}/${info.path.replace('meta.json', 'Readonly.js')}`),
    error: InterfaceReadonlyFallback,
    loading: InterfaceReadonlyLoading,
  }));
}

export function registerListing(name) {
  const extensionExists = Boolean(store.state.extensions.listings.data[name]);

  if (extensionExists === false) {
    Vue.component(`${prefixes.listing}-${name}`, ListingFallback);
    Vue.component(`${prefixes.listingOptions}-${name}`, ListingOptionsFallback);
    return;
  }

  const info = store.state.extensions.listings.data[name];

  Vue.component(`${prefixes.listing}-${name}`, () => ({
    component: loadExtension(`${api.url}/${info.path.replace('meta.json', 'Listing.js')}`),
    error: ListingFallback,
    loading: ListingLoading,
  }));

  Vue.component(`${prefixes.listingOptions}-${name}`, () => ({
    component: loadExtension(`${api.url}/${info.path.replace('meta.json', 'Options.js')}`),
    error: ListingOptionsFallback,
    loading: ListingOptionsLoading,
  }));
}

/**
 * Register an extension if it hasn't been registered yet
 * @param  {String} type interfaces || listings || pages
 * @param  {String} name The extensions unique name
 */
export default function (type, name) {
  switch (type) {
    case 'interfaces':
      return registerInterface(name);
    case 'listings':
      return registerListing(name);
    default:
  }
  return null;
}
