<template>
  <div class="v-logo">
    <transition name="fade">
      <img
        v-show="customLogoPath && customLogoLoaded"
        :src="customLogoPath"
        :alt="projectName"
        @load="customLogoLoaded = true">
    </transition>
    <transition name="fade">
      <img
        v-show="directusLogoLoaded && !customLogoExists"
        src="../../../assets/logo.svg"
        alt="Directus Logo"
        @load="directusLogoLoaded = true">
    </transition>
  </div>
</template>

<script>
export default {
  name: "v-logo",
  data() {
    return {
      customLogoPath: "",
      customLogoLoaded: false,
      directusLogoLoaded: false
    };
  },
  computed: {
    customLogoExists() {
      return Boolean(this.$store.state.settings.logo);
    },
    projectName() {
      return this.$store.state.auth.projectName;
    }
  },
  created() {
    if (this.customLogoExists) {
      const logoID = this.$store.state.settings.logo;
      // NOTE: The api should return the logo relational from directus_settings. See directus/api#121
      this.$api
        .getItem("directus_files", logoID)
        .then(res => res.data.storage.full_url)
        .then(url => (this.customLogoPath = url))
        .catch(console.error);
    }
  }
};
</script>

<style lang="scss" scoped>
.v-logo {
  height: var(--header-height);
  background-color: var(--accent);
  padding: 10px;
  display: grid;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    grid-column: 1;
    grid-row: 1;
  }
}
</style>
