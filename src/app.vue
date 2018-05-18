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
      <main :class="{ 'info-active': infoActive }">
        <router-view class="page-root" />
        <v-blocker
          v-if="infoSidebarHasContent &&
            ((infoActive && $mq === 'small') || (infoActive && $mq === 'medium'))
          "
          :z-index="5"
          @click="toggleInfo(false)" />
        <info-sidebar
          v-show="infoSidebarHasContent && infoActive"
          :class="$route.meta && $route.meta.infoSidebarWidth"
          class="info-sidebar"
          @close="toggleInfo(false)" />
      </main>

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
import { Wormhole } from "portal-vue";
import HeaderBar from "./components/header-bar/header-bar.vue";
import NavSidebar from "./components/sidebars/nav-sidebar.vue";
import InfoSidebar from "./components/sidebars/info-sidebar.vue";
import VBlocker from "./components/blocker.vue";
import VError from "./components/error.vue";
import { TOGGLE_NAV } from "./store/mutation-types";

export default {
  name: "directus",
  components: {
    HeaderBar,
    NavSidebar,
    InfoSidebar,
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
    infoSidebarHasContent() {
      return (
        Wormhole.hasContentFor("info-sidebar") ||
        Wormhole.hasContentFor("info-sidebar-system")
      );
    },
    subHeaderHasContent() {
      return Wormhole.hasContentFor("sub-header");
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

    &.info-active {
      transition: padding-right var(--slow) var(--transition-in);
      padding-right: var(--nav-sidebar-width);
    }

    &.info-wide-active {
      transition: padding-right var(--slow) var(--transition-in);
      padding-right: var(--info-sidebar-width);
    }
  }
}
</style>

<style lang="scss" scoped>
main {
  width: 100%;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
}

.info-sidebar {
  max-width: var(--nav-sidebar-width);
}

.info-sidebar.wide {
  max-width: var(--info-sidebar-width);
}
</style>
