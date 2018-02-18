<template>
  <div>
    <h1>Directus 7</h1>
    <button @click="logout">Log out</button>
  </div>
</template>

<script>
  export default {
    methods: {
      logout() {
        this.$api.logout();
      },
    },
  };
</script>
