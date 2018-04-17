<template>
  <component
    :is="component"
    :collection="collection" />
</template>

<script>
import ItemListing from './ItemListing.vue';
import NotFound from './NotFound.vue';

export default {
  name: 'item-listing-guard',
  components: {
    ItemListing,
    NotFound,
  },
  props: {
    collection: {
      type: String,
      required: true,
    },
  },
  computed: {
    collections() {
      return Object.keys(this.$store.state.collections.data);
    },
    component() {
      return this.collections.includes(this.collection) ? 'item-listing' : 'not-found';
    },
  },
};
</script>
