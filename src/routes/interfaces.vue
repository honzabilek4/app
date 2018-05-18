<template>
  <div class="interfaces">
    <v-header-bar title="Interfaces" />
    <v-table
      :columns="columns"
      :items="items"
      link="__link"
      primary-key-field="id" />
  </div>
</template>

<script>
export default {
  computed: {
    items() {
      return Object.keys(this.$store.state.extensions.interfaces).map(id => ({
        ...this.$store.state.extensions.interfaces[id],
        __link: `/interfaces/${id}`
      }));
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
