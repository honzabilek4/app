<template>
  <component
    v-if="component === 'edit' && !loading"
    :is="component"
    :primary-key="primaryKey"
    :collection="collection" />
  <div v-else-if="loading" />
  <component
    v-else
    :is="component"
    :collection="collection" />
</template>

<script>
import ItemListing from "./ItemListing.vue";
import Edit from "./Edit.vue";
import NotFound from "./NotFound.vue";

export default {
  name: "item-listing-guard",
  components: {
    ItemListing,
    Edit,
    NotFound
  },
  props: {
    collection: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    collections() {
      return this.$store.state.collections.data;
    },
    collectionNames() {
      return Object.keys(this.collections);
    },
    component() {
      const collectionExists = this.collectionNames.includes(this.collection);

      if (collectionExists === false) return "not-found";

      const collectionInfo = this.collections[this.collection];

      if (collectionInfo.single === true) return "edit";

      return "item-listing";
    },
    fields() {
      const stateFields =
        (this.$store.state.fields &&
          this.$store.state.fields[this.collection] &&
          this.$store.state.fields[this.collection].data) ||
        {};

      return this.$lodash.keyBy(
        Object.values(stateFields)
          .filter(field => {
            if (field.interface === "primary-key") return true;

            if (field.hidden_list === true || field.hidden_list === 1) {
              return false;
            }

            return true;
          })
          .map(field => ({
            ...field,
            name: this.$t(`fields-${this.collection}-${field.field}`)
          })),
        "field"
      );
    },
    primaryKeyField() {
      const primaryKeyField = this.$lodash.find(
        this.fields,
        { interface: "primary-key" } // TODO: check for data type instead of interface
      );

      return primaryKeyField && primaryKeyField.field;
    }
  },
  created() {
    if (this.component === "edit") {
      this.loading = true;

      this.$store
        .dispatch("getFields", this.collection)
        .then(() => {
          return this.$api.getItems(this.collection, {
            limit: 1,
            fields: [this.primaryKeyField]
          });
        })
        .then(res => res.data)
        .then(data => {
          this.primaryKey = String(data[0][this.primaryKeyField]);
          this.loading = false;
        })
        .catch(console.error);
    }
  }
};
</script>
