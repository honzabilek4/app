<template>
  <component
    :is="componentName"
    :primary-key-field="primaryKeyField"
    :fields="fields"
    :items="items"
    :options="options"
    :loading="loading"
    :query="query"
    :selection="selection"
    class="listing-options-extension"
    @query="$emit('query', $event)"
    @select="$emit('select', $event)"
    @input="$emit('input', $event)" />
</template>

<script>
import Vue from "vue";
import loadExtension from "../../helpers/load-extension";
import componentExists from "../../helpers/component-exists";
import ListingOptionsFallback from "./v-listing-options-fallback.vue";
import ListingOptionsLoading from "./v-listing-options-loading.vue";

export default {
  name: "listing-options-extension",
  props: {
    id: {
      type: String,
      required: true
    },
    primaryKeyField: {
      type: String,
      required: true
    },
    fields: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    },
    query: {
      type: Object,
      default: () => ({})
    },
    selection: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    listings() {
      return this.$store.state.extensions.listings;
    },
    listing() {
      return this.listings && this.listings[this.id];
    },
    componentName() {
      return `listing-options-${this.id}`;
    }
  },
  watch: {
    id() {
      this.registerListingOptions();
    }
  },
  created() {
    this.registerListingOptions();
  },
  methods: {
    /**
     * Register the extension as component (if it hasn't been registered before yet)
     */
    registerListingOptions() {
      // If component already exists, do nothing
      if (componentExists(this.componentName)) return;

      // If the extension isn't known by the API (e.g. it's not in the store), register it with the
      //   fallback immediately
      if (!this.listing) {
        Vue.component(this.componentName, ListingOptionsFallback);
        return;
      }

      const filePath = `${this.$api.url}/${this.listing.path.replace(
        "meta.json",
        "Options.js"
      )}`;

      Vue.component(this.componentName, () => ({
        component: loadExtension(filePath),
        error: ListingOptionsFallback,
        loading: ListingOptionsLoading
      }));
    }
  }
};
</script>
