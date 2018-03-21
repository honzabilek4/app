<template>
  <div class="item-listing">
    <portal to="header-title">
      <breadcrumb :links="links" />
    </portal>

    <listing :collection="collection" />
  </div>
</template>

<script>
import Listing from '../containers/Listing.vue';

export default {
  name: 'item-listing',
  components: { Listing },
  props: {
    collection: {
      type: String,
      required: true,
    },
  },
  computed: {
    links() {
      return [
        {
          name: this.$t('collections'),
          path: '/collections',
        },
        {
          name: this.$t(`cn-${this.collection}`),
          path: `/collections/${this.collection}`,
        },
      ];
    },
  },
};
</script>
