<template>
  <div class="collections">
    <portal to="header-title">
      {{ $t('collections') }}
    </portal>
    <v-table
      :items="items"
      :columns="fields"
      primary-key-field="collection"
      link="__link__"
      @select="select" />
  </div>
</template>

<script>
export default {
  name: 'collections',
  computed: {
    items() {
      const collections = this.$store.state.collections.data || {};

      return Object.keys(collections).map(collection => ({
        collection: this.$t(`collections-${collection}`),
        __link__: `/collections/${collection}`,
      }));
    },
    fields() {
      return [{
        field: 'collection',
        name: this.$t('collection'),
      }];
    },
  },
  methods: {
    select(selection) {
      this.selection = selection;
    },
  },
};
</script>
