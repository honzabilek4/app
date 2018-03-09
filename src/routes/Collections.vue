<template>
  <div>
    <portal to="header-title">
      {{ $t('collections') }}
    </portal>
    <ul>
      <li
        v-for="name in collectionNames"
        :key="name"
      >
        <router-link :to="`/collections/${name}`">{{ $t(`cn-${name}`) }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    loading() {
      return this.$store.state.collections.loading;
    },
    collections() {
      return this.$store.state.collections.data;
    },
    collectionNames() {
      return this.collections && Object.keys(this.collections);
    },
  },
};
</script>
