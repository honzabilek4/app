<template>
  <component
    v-if="!loading"
    :is="component"
    :collection="collection"
    :primary-key="primaryKey" />
</template>

<script>
import Edit from './Edit.vue';
import NotFound from './NotFound.vue';

export default {
  name: 'edit-guard',
  components: {
    Edit,
    NotFound,
  },
  props: {
    collection: {
      type: String,
      required: true,
    },
    primaryKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      exists: null,
      loading: false,
    };
  },
  computed: {
    collections() {
      return Object.keys(this.$store.state.collections.data);
    },
    component() {
      const collectionExists = this.collections.includes(this.collection);
      const itemExists = this.exists;

      if (collectionExists && itemExists) {
        return 'edit';
      }

      return 'not-found';
    },
  },
  watch: {
    $route() {
      this.checkExistence();
    },
  },
  created() {
    this.checkExistence();
  },
  methods: {
    checkExistence() {
      if (this.primaryKey === '+') {
        this.exists = true;
        return;
      }

      this.exists = null;
      this.loading = true;

      const params = {
        fields: '-',
      };

      this.$api.getItem(this.collection, this.primaryKey, params)
        .then(() => {
          this.exists = true;
          this.loading = false;
        })
        .catch(() => {
          this.exists = false;
          this.loading = false;
        });
    },
  },
};
</script>
