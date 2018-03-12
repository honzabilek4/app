import Vue from 'vue';
import api from '../api';
import prefixes from './prefixes';
import loadExtension from './load-extension';
import AsyncError from '../components/extensions/Error.vue';
import AsyncLoading from '../components/extensions/Loading.vue';

/**
 * Register an extension if it hasn't been registered yet
 * @param  {String} type interface || listing || page
 * @param  {Object} info The meta.json file of the interface (can be found in store)
 */
export default function (type, info) {
  const components = [];

  switch (type) {
    case 'interface':
      components.push(
        {
          path: info.path.replace('meta.json', 'Interface.js'),
          name: `${prefixes.interface}-${info.id}`,
        },
        {
          path: info.path.replace('meta.json', 'Readonly.js'),
          name: `${prefixes.interfaceReadonly}-${info.id}`,
        },
      );
      break;
    case 'listing':
      components.push(
        {
          path: info.path.replace('meta.json', 'Listing.js'),
          name: `${prefixes.listing}-${info.id}`,
        },
        {
          path: info.path.replace('meta.json', 'Options.js'),
          name: `${prefixes.listingOptions}-${info.id}`,
        },
      );
      break;
    default: break;
  }

  const registeredComponents = Object.keys(Vue.options.components);

  components.forEach((component) => {
    if (!registeredComponents.includes(component.name)) {
      Vue.component(component.name, () => ({
        component: loadExtension(`${api.url}/${component.path}`),
        error: AsyncError,
        loading: AsyncLoading,
      }));
    }
  });
}
