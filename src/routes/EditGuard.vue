<template>
  <div class="edit-guard">
    <component
      v-if="!loading"
      :is="component"
      :collection="collection"
      :primary-key="primaryKey" />
    <v-confirm
      v-if="confirmNavigation"
      :message="$t('navigate_changes')"
      :confirm-text="$t('keep_editing')"
      :cancel-text="$t('discard_changes')"
      @confirm="confirmNavigation = false"
      @cancel="discardChanges" />
  </div>
</template>

<script>
import Edit from "./Edit.vue";
import NotFound from "./NotFound.vue";

export default {
  name: "edit-guard",
  components: {
    Edit,
    NotFound
  },
  props: {
    collection: {
      type: String,
      required: true
    },
    primaryKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      exists: null,
      loading: false,
      confirmNavigation: false,
      toPath: ""
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
        return "edit";
      }

      return "not-found";
    },
    editing() {
      return this.$store.getters.editing;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.editing) {
      this.confirmNavigation = true;
      this.toPath = to.fullPath;
      return next(false);
    }
    return next();
  },
  watch: {
    $route() {
      this.checkExistence();
    }
  },
  created() {
    this.checkExistence();
  },
  methods: {
    checkExistence() {
      if (this.primaryKey === "+") {
        this.exists = true;
        return;
      }

      this.exists = null;
      this.loading = true;

      const params = {
        fields: "-"
      };

      this.$api
        .getItem(this.collection, this.primaryKey, params)
        .then(() => {
          this.exists = true;
          this.loading = false;
        })
        .catch(() => {
          this.exists = false;
          this.loading = false;
        });
    }
  }
};
</script>
