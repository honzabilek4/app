<template>
  <router-view
    v-if="publicRoute"
    class="directus" />

  <div v-else-if="hydratingError">
    <v-error
      icon="warning"
      :title="$t('server_error')"
      :body="$t('server_error_copy')"
      color="danger" />
  </div>

  <div
    v-else
    class="directus">

    <loader
      v-if="hydrating"
      area="full-page" />

    <div v-else>
      <v-blocker
        v-if="navActive && $mq === 'small'"
        :z-index="25"
        @click="toggleNav" />
      <nav-sidebar
        v-show="navActive || $mq !== 'small'"
        @toggleNav="toggleNav" />

      <router-view class="page-root" />

      <v-confirm
        v-if="unsavedChanges"
        :message="$t('unsaved_changes_copy')"
        :confirm-text="$t('keep_editing')"
        :cancel-text="$t('discard_changes')"
        @confirm="keepEditing"
        @cancel="discardChanges" />
    </div>

    <notifications
      position="bottom right"
      classes="directus-notification" />
  </div>
</template>

<script>
import HeaderBar from "./components/header-bar/header-bar.vue";
import NavSidebar from "./components/sidebars/nav-sidebar.vue";
import VBlocker from "./components/blocker.vue";
import VError from "./components/error.vue";
import { TOGGLE_NAV } from "./store/mutation-types";

export default {
  name: "directus",
  components: {
    HeaderBar,
    NavSidebar,
    VBlocker,
    VError
  },
  data() {
    return {
      infoActive: false
    };
  },
  computed: {
    navActive() {
      return this.$store.state.sidebars.nav;
    },
    publicRoute() {
      return this.$route.meta.publicRoute || false;
    },
    hydrating() {
      return this.$store.state.hydrating;
    },
    hydratingError() {
      return this.$store.state.hydratingError;
    },
    unsavedChanges() {
      return this.$route.query.editing === true;
    }
  },
  watch: {
    $route() {
      this.bodyClass();
      this.$store.commit(TOGGLE_NAV, false);
      this.infoActive = false;
    },
    infoActive(visible) {
      const className =
        this.$route.meta && this.$route.meta.infoSidebarWidth === "wide"
          ? "info-wide-active"
          : "info-active";

      if (visible) {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove("info-wide-active");
        document.body.classList.remove("info-active");
      }
    },
    hydratingError(newVal) {
      if (newVal) {
        document.body.classList.add("no-padding");
      }
    }
  },
  created() {
    this.bodyClass();
  },
  methods: {
    bodyClass() {
      if (this.publicRoute) {
        document.body.classList.add("no-padding");
      } else {
        document.body.classList.remove("no-padding");
      }
    },
    toggleNav(visible = !this.navActive) {
      this.$store.commit(TOGGLE_NAV, visible);
    },
    toggleInfo(visible = !this.infoActive) {
      this.infoActive = visible;
    },
    keepEditing() {
      this.$router.push(
        `/collections/${this.$route.query.collection}/${
          this.$route.query.primaryKey
        }`
      );
    },
    discardChanges() {
      this.$store.dispatch("discardChanges");
      this.$router.push(this.$route.path);
    }
  }
};
</script>

<style lang="scss">
body:not(.no-padding) {
  @media (min-width: 50em) {
    padding-left: calc(
      var(--nav-sidebar-width) + 1px
    ); /* +1px = sidebar shadow */
  }

  @media (min-width: 62.5em) {
    transition: padding-right var(--medium) var(--transition-out);
  }
}
</style>
