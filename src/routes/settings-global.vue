<template>
  <div class="settings-global">
    <v-header-bar :breadcrumb="links" />

    <edit-form
      v-if="!hydrating"
      :fields="fields"
      :values="settings"
      @stageValue="stageValue" />
  </div>
</template>

<script>
import EditForm from "../components/edit-form/edit-form.vue";

export default {
  name: "settings-global",
  components: {
    EditForm
  },
  data() {
    return {
      hydrating: false,
      saving: false,
      deleting: false
    };
  },
  computed: {
    settings() {
      return this.$store.state.settings;
    },
    links() {
      return [
        {
          name: this.$t("settings"),
          path: "/settings",
          color: "warning"
        },
        {
          name: this.$t("settings_global"),
          path: "/settings/global"
        }
      ];
    },
    fields() {
      return (
        this.$store.state.fields.directus_settings &&
        this.$store.state.fields.directus_settings
      );
    }
  },
  created() {
    this.hydrate();
  },
  methods: {
    stageValue(field, value) {
      return value;
    },
    hydrate() {
      this.hydrating = true;

      Promise.all([
        this.$store.dispatch("getFields", "directus_settings"),
        this.$store.dispatch("getSettings")
      ])
        .then(() => {
          this.hydrating = false;
        })
        .catch(console.error);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.editing) {
      this.confirmNavigation = true;
      this.toPath = to.fullPath;
      return next(false);
    }
    return next();
  }
};
</script>

<style lang="scss" scoped>
.settings-global {
  padding: 20px;
}
</style>
