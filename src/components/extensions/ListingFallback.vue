<template>
  <v-table
    v-if="items && columns && primaryKeyField"
    :items="items"
    :columns="columns"
    :primaryKeyField="primaryKeyField"
    link="__link__"
    :use-interfaces="true" />
</template>

<script>
export default {
  name: "listing-fallback",
  props: {
    fields: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    primaryKeyField: {
      type: String,
      required: true
    }
  },
  computed: {
    columns() {
      return Object.values(this.fields).map(field => {
        return { field: field.field, name: field.name, fieldInfo: field };
      });
    }
  }
};
</script>
