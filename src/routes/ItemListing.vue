<template>
  <div
    :class="{ 'no-results': noResults || emptyCollection }"
    class="item-listing">
    <portal to="header-title">
      <h1 class="style-1"><breadcrumb :links="links" /></h1>
      <button
        :class="currentBookmark ? 'active' : null"
        :disabled="currentBookmark"
        class="bookmark"
        @click="bookmarkModal = true">
        <i class="material-icons">
          {{ currentBookmark ? 'bookmark' : 'bookmark_border' }}
        </i>
      </button>
      <div
        v-if="currentBookmark"
        class="bookmark-name no-wrap">({{ currentBookmark.title }})</div>
    </portal>

    <portal to="header-custom">
      <search-filter
        v-if="selection.length === 0"
        :filters="preferences.filters || []"
        :search-query="preferences.search_query || ''"
        :fields="fieldNames"
        @filter="updateListingPreferences('filters', $event)"
        @search="updateListingPreferences('search_query', $event)"
      />
    </portal>

    <portal to="header-buttons">
      <header-button
        v-if="selection.length > 1"
        icon="mode_edit"
        bg="warning"
        @click="batchEdit">{{ $t('batch_edit') }}</header-button>
      <header-button
        v-if="selection.length"
        icon="close"
        bg="danger"
        @click="batchDelete">{{ $t('delete') }}</header-button>
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
        :value="viewType"
        name="listing"
        @input="updateListingPreferences('view_type', $event)" />
    </portal>

    <portal to="info-sidebar">
      <listing-options-extension
        v-if="hydrating === false"
        :id="viewType"
        :collection="collection"
        :primary-key-field="primaryKeyField"
        :fields="fields"
        :items="items"
        :options="viewOptions"
        :loading="loading"
        :query="preferences.view_query"
        :selection="selection"
        link="__link__"
        @query="updateListingPreferences('view_query', $event)"
        @select="selection = $event"
        @input="updateListingPreferences('view_options', $event)"
      />
    </portal>

    <v-error
      v-if="!hydrating && noResults"
      :title="$t('no_results')"
      :body="$t('no_results_body')"
      icon="search" />

    <v-error
      v-if="!hydrating && emptyCollection"
      :title="$t('empty_collection')"
      :body="$t('empty_collection_body')"
      icon="web_asset" />

    <listing-extension
      v-else-if="!hydrating && !noResults && items.length > 0"
      :id="viewType"
      :primary-key-field="primaryKeyField"
      :fields="fields"
      :items="items"
      :options="viewOptions"
      :selection="selection"
      :query="preferences.view_query || {}"
      link="__link__"
      @select="selection = $event"
      @input="updateListingPreferences('view_options', $event)"
      @query="updateListingPreferences('view_query', $event)" />

    <v-modal
      v-if="bookmarkModal"
      :title="$t('save_as_bookmark')"
      @confirm="saveBookmark"
      @close="bookmarkModal = false">
      <label for="bookmark">{{ $t('name_bookmark') }}</label>
      <v-input
        v-model="bookmarkTitle"
        type="text" />
    </v-modal>
  </div>
</template>

<script>
import formatFilters from '../helpers/format-filters';
import SearchFilter from '../components/SearchFilter.vue';
import VError from '../components/VError.vue';

export default {
  name: 'item-listing',
  components: {
    SearchFilter, VError,
  },
  props: {
    collection: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      items: [],
      meta: null,
      error: null,
      loading: false,
      hydrating: true,
      selection: [],
      bookmarkTitle: '',
      bookmarkModal: false,
    };
  },
  computed: {
    noResults() {
      return (
        this.meta &&
        (this.meta.result_count !== null) &&
        this.meta.result_count === 0 &&
      this.meta.total_count !== 0) || false;
    },
    emptyCollection() {
      return (
        this.meta &&
        (this.meta.total_count !== null) &&
        this.meta.total_count === 0) || false;
    },
    currentBookmark() {
      const bookmarks = this.$store.state.bookmarks.data;
      const preferences = {
        collection: this.preferences.collection,
        search_query: this.preferences.search_query,
        filters: this.preferences.filters,
        view_options: this.preferences.view_options,
        view_type: this.preferences.view_type,
        view_query: this.preferences.view_query,
      };

      const currentBookmark = bookmarks.filter((bookmark) => {
        const bookmarkPreferences = {
          collection: bookmark.collection,
          search_query: bookmark.search_query,
          filters: bookmark.filters,
          view_options: bookmark.view_options,
          view_type: bookmark.view_type,
          view_query: bookmark.view_query,
        };

        return this.$lodash.isEqual(bookmarkPreferences, preferences);
      })[0];

      return currentBookmark || null;
    },
    fields() {
      return this.$lodash.mapValues(
        (this.$store.state.fields &&
          this.$store.state.fields[this.collection] &&
          this.$store.state.fields[this.collection].data) || {},
        field => ({
          ...field,
          name: this.$t(`fields-${this.collection}-${field.field}`),
        }),
      );
    },
    fieldNames() {
      if (!this.fields) return {};
      const translatedNames = {};
      Object.keys(this.fields).forEach((name) => {
        translatedNames[name] = this.$t(`fields-${this.collection}-${name}`);
      });
      return translatedNames;
    },
    links() {
      if (this.collection === 'directus_users') {
        return [{
          name: this.$t('user_directory'),
          path: '/users',
        }];
      }
      if (this.collection === 'directus_files') {
        return [{
          name: this.$t('file_library'),
          path: '/files',
        }];
      }
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
    listingNames() {
      if (!this.$store.state.extensions.listings.data) return {};
      const translatedNames = {};
      Object.keys(this.$store.state.extensions.listings.data).forEach((id) => {
        translatedNames[id] = this.$store.state.extensions.listings.data[id].name;
      });
      return translatedNames;
    },
    itemParams() {
      let params = {
        fields: '*.*', // by default, we fetch all items + 1 level of relational items
        meta: 'result_count,total_count',
      };

      Object.assign(params, this.preferences.view_query || {});

      if (this.preferences.search_query) {
        params.q = this.preferences.search_query;
      }

      if (this.preferences.filters && this.preferences.filters.length > 0) {
        params = {
          ...params,
          ...formatFilters(this.preferences.filters),
        };
      }

      return params;
    },
    preferences() {
      return (this.$store.state.listingPreferences[this.collection] &&
        this.$store.state.listingPreferences[this.collection].data) || {};
    },
    primaryKeyField() {
      return this.$lodash.find(
        this.fields,
        { interface: 'primary-key' },
      ).field;
    },
    viewType() {
      return this.preferences.view_type || 'tabular';
    },
    viewOptions() {
      return (this.preferences.view_options &&
        this.preferences.view_options[this.viewType]) || {};
    },
  },
  watch: {
    collection: 'hydrate',

    /**
     * If the search_query, filters, or view_query changes: fetch the fresh items
     */
    preferences: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.$lodash.isEmpty(oldVal) || this.$lodash.isEmpty(newVal)) return;

        if (
          newVal.search_query !== oldVal.search_query ||
          newVal.filters !== oldVal.filters ||
          newVal.view_query !== oldVal.view_query
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
    /**
     * Fetch component crucial information before rendering
     */
    hydrate() {
      this.hydrating = true;
      this.error = null;
      this.items = [];
      this.meta = null;

      Promise.all([
        this.$store.dispatch('getFields', this.collection),
        this.$store.dispatch('getListingPreferences', this.collection),
      ])
        .then(() => {
          this.getItems();
        })
        .then(() => {
          this.hydrating = false;
        })
        .catch((error) => {
          this.error = error;
          this.hydrating = false;
        });
    },

    /**
     * Fetch (new) items
     */
    getItems() {
      this.error = null;
      this.loading = true;

      return this.$api.getItems(this.collection, this.itemParams)
        .then((res) => {
          this.meta = res.meta;
          return res.data;
        })
        .then((items) => {
          if (this.collection === 'directus_users' || this.collection === 'directus_files') {
            this.items = items.map(item => ({
              ...item,
              __link__: `/${this.collection.substring(9)}/${item[this.primaryKeyField]}`,
            }));
            return;
          }

          this.items = items.map(item => ({
            ...item,
            __link__: `/collections/${this.collection}/${item[this.primaryKeyField]}`,
          }));
        })
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.error = error;
          this.loading = false;
        });
    },

    /**
     * Update a single column in directus_collection_presets mapped to the current collection
     */
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
              ...this.preferences.view_options || {},
              [this.viewType]: val,
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

    batchEdit() {
      let route = `/collections/${this.collection}/${this.selection.join()}`;
      if (this.collection === 'directus_users' || this.collection === 'directus_files') {
        route = `/${this.collection.substring(9)}/${this.selection.join()}`;
      }
      this.$router.push(route);
    },

    batchDelete() {
      console.log('DELETE BATCH');
      // TODO:
      //   - show modal "are you sure"
      //   - fire delete request for items through store on yes
    },

    add() {
      let route = `/collections/${this.collection}/+`;
      if (this.collection === 'directus_users' || this.collection === 'directus_files') {
        route = `/${this.collection.substring(9)}/+`;
      }
      this.$router.push(route);
    },

    saveBookmark() {
      const preferences = { ...this.preferences };
      preferences.user = this.$store.state.me.data.id;
      preferences.title = this.bookmarkTitle;
      delete preferences.id;
      delete preferences.group;
      this.$store.dispatch('saveBookmark', preferences)
        .then(() => {
          this.bookmarkModal = false;
        })
        .catch(console.error);
    },
  },
};
</script>

<style lang="scss" scoped>
.item-listing:not(.no-results) {
  padding-bottom: var(--page-padding-bottom);
}

.no-results {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bookmark {
  margin-left: 10px;
  opacity: 0.4;
  transition: opacity var(--fast) var(--transition);

  &:hover {
    opacity: 1;
  }

  i {
    font-size: 24px;
    height: 20px;
  }
}

.bookmark.active {
  opacity: 1;

  i {
    color: var(--primary);
  }
}

.bookmark-name {
  color: var(--primary);
  margin-left: 5px;
  margin-top: 3px;
  font-size: 0.77em;
  line-height: 1.1;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
