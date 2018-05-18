<template>
  <div class="collections">
    <v-header-bar :breadcrumb="[{
      name: $t('collections'),
      path: '/collections'
    }]" />
    <v-error
      v-if="items.length === 0"
      :title="$t('no_collections')"
      :body="$t('no_collections_body')"
      icon="error_outline" />
    <v-table
      v-else
      :items="items"
      :columns="fields"
      primary-key-field="collection"
      link="__link__"
      @select="select" />
  </div>
</template>

<script>
import VError from "../components/error.vue";

export default {
  name: "collections",
  components: {
    VError
  },
  computed: {
    items() {
      const collections = this.$store.state.collections || {};

      return Object.values(collections)
        .filter(collection => collection.hidden === false)
        .map(collection => ({
          collection: this.$t(`collections-${collection.collection}`),
          __link__: `/collections/${collection.collection}`
        }));
    },
    fields() {
      return [
        {
          field: "collection",
          name: this.$t("collection")
        }
      ];
    }
  },
  methods: {
    select(selection) {
      this.selection = selection;
    }
  }
};
</script>

<style lang="scss" scoped>
.collections {
  padding-bottom: (--page-padding-bottom);
}
</style>
