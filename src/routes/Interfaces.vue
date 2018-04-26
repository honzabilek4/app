<template>
  <v-table
    :columns="columns"
    :items="items"
    link="__link"
    primary-key-field="id" />
</template>

<script>
export default {
  computed: {
    items() {
      return Object.keys(this.$store.state.extensions.interfaces.data).map(
        id => ({
          ...this.$store.state.extensions.interfaces.data[id],
          __link: `/interfaces/${id}`
        })
      );
    },
    columns() {
      return [
        {
          field: "name",
          name: "Name"
        },
        {
          field: "id",
          name: "id"
        },
        {
          field: "version",
          name: "Version"
        }
      ];
    }
  }
};
</script>
