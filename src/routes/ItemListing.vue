<template>
  <div class="item-listing">
    <portal to="header-title">
      <breadcrumb :links="links" />
    </portal>

    <loader
      v-if="hydrating"
      area="content"
    />

    <portal to="header-custom">
      <search-filter
        v-if="selection.length === 0"
        :filters="listingPreferences.filters || []"
        :search-query="listingPreferences.search_query || ''"
        :fields="fieldNames"
        @filter="updateListingPreferences('filters', $event)"
        @search="updateListingPreferences('search_query', $event)"
      />
    </portal>

    <portal to="header-buttons">
      <header-button
        v-if="selection.length > 1"
        :disabled="true"
        title="This feature hasn't been build yet"
        icon="mode_edit"
        bg="warning">{{ $t('batch_edit') }}</header-button>
      <header-button
        v-if="selection.length"
        icon="close"
        bg="danger">{{ $t('delete') }}</header-button>
      <header-button
        icon="add"
        bg="primary"
        @click="add"
      >{{ $t('new') }}</header-button>
    </portal>

    <portal to="info-sidebar-system">
      <label for="listing">{{ $t('view_type') }}</label>
      <v-select
        id="listing"
        :options="listingNames"
        :value="listing"
        name="listing"
        @input="updateListingPreferences('view_type', $event)" />
    </portal>

    <portal to="info-sidebar">
      <listing-options-extension
        v-if="hydrating === false"
        :id="listing"
        :collection="collection"
        :primary-key-field="primaryKeyField"
        :fields="fields"
        :items="itemsWithLinks"
        :options="viewOptions"
        :loading="loading"
        :query="listingPreferences.view_query"
        :selection="selection"
        link="__link__"
        @query="updateListingPreferences('view_query', $event)"
        @select="value => { selection = value }"
        @input="updateListingPreferences('view_options', $event)"
      />
    </portal>

    <listing-extension
      v-if="hydrating === false"
      :id="listing"
      :collection="collection"
      :primary-key-field="primaryKeyField"
      :fields="fields"
      :items="itemsWithLinks"
      :options="viewOptions"
      :loading="loading"
      :query="listingPreferences.view_query"
      :selection="selection"
      link="__link__"
      @query="updateListingPreferences('view_query', $event)"
      @select="value => { selection = value }"
      @input="updateListingPreferences('view_options', $event)"
    />
  </div>
</template>

<script>
import { diff } from 'deep-object-diff';
import SearchFilter from '../components/SearchFilter.vue';
import formatFilters from '../helpers/format-filters';
import prefixes from '../helpers/prefixes';

export default {
  name: 'listing',
  components: {
    SearchFilter,
  },
  props: {
    collection: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selection: [],
      items: [],
      loading: false,
      error: null,
      hydrating: false,
    };
  },
  computed: {
    fields() {
      return this.$store.state.fields &&
        this.$store.state.fields[this.collection] &&
        this.$store.state.fields[this.collection].data;
    },
    fieldNames() {
      if (!this.fields) return {};
      const translatedNames = {};
      Object.keys(this.fields).forEach((name) => {
        translatedNames[name] = this.$t(`fields-${this.collection}-${name}`);
      });
      return translatedNames;
    },
    prefixes() {
      return prefixes;
    },
    primaryKeyField() {
      return this.$lodash.find(
        this.fields,
        { interface: 'primary-key' },
      ).field;
    },
    listingPreferences() {
      return (this.$store.state.listingPreferences &&
        this.$store.state.listingPreferences[this.collection] &&
        this.$store.state.listingPreferences[this.collection].data) || {};
    },
    viewOptions() {
      return (this.listingPreferences.view_options &&
        this.listingPreferences.view_options[this.listing]) || {};
    },
    listing() {
      return (this.listingPreferences && this.listingPreferences.view_type) || 'tabular';
    },
    listingNames() {
      if (!this.$store.state.extensions.listings.data) return {};
      const translatedNames = {};
      Object.keys(this.$store.state.extensions.listings.data).forEach((id) => {
        translatedNames[id] = this.$store.state.extensions.listings.data[id].name;
      });
      return translatedNames;
    },
    itemsWithLinks() {
      return this.items.map(item => ({
        ...item,
        __link__: `/collections/${this.collection}/${item[this.primaryKeyField]}`,
      }));
    },
    links() {
      return [
        {
          name: this.$t('collections'),
          path: '/collections',
        },
        {
          name: this.$t(`collections-${this.collection}`),
          path: `/collections/${this.collection}`,
        },
      ];
    },
  },
  watch: {
    collection() {
      this.hydrate();
    },
    listingPreferences: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.$lodash.isEmpty(oldVal)) return;
        const changedKeys = Object.keys(diff(oldVal, newVal));
        if (
          changedKeys.includes('search_query') ||
          changedKeys.includes('filters') ||
          changedKeys.includes('view_query')
        ) {
          this.getItems();
        }
      },
    },
  },
  created() {
    this.hydrate();
  },
  methods: {
    hydrate() {
      this.hydrating = true;
      this.items = [];
      this.selection = [];
      this.error = null;

      Promise.all([
        this.$store.dispatch('getFields', this.collection),
        this.$store.dispatch('getListingPreferences', this.collection),
      ])
        .then(() => {
          this.hydrating = false;
          this.getItems();
        })
        .catch(console.error);
    },
    getItems() {
      this.loading = true;
      let params = this.listingPreferences.view_query || {};
      if (this.listingPreferences.search_query) {
        params.q = this.listingPreferences.search_query;
      }
      if (this.listingPreferences.filters && this.listingPreferences.filters.length > 0) {
        params = {
          ...params,
          ...formatFilters(this.listingPreferences.filters),
        };
      }

      this.$api.getItems(this.collection, params)
        .then(res => res.data)
        .then((items) => {
          this.loading = false;
          this.error = null;
          this.items = items;
        })
        .catch((error) => {
          this.loading = false;
          this.error = error;
        });
    },
    updateListingPreferences(field, value) {
      let val = value;
      if (Array.isArray(value) && value.length === 0) val = null;

      let info = null;

      /*
       * If the view options are saved, nest them in the currently-in-use view_type to prevent
       *   the settings of other view types to be overriden. This allows the user to switch back and
       *   forth between list views, without losing settings between them.
       */
      if (field === 'view_options') {
        info = {
          collection: this.collection,
          updates: {
            view_options: {
              ...this.listingPreferences.view_options || {},
              [this.listing]: val,
            },
          },
        };
      } else {
        info = {
          collection: this.collection,
          updates: {
            [field]: val,
          },
        };
      }

      this.$store.dispatch('setListingPreferences', info);
    },
    add() {
      this.$router.push(`/collections/${this.collection}/+`);
    },
  },
};
</script>
