<template>
  <router-view
    v-if="publicRoute"
    class="directus" />

  <div
    v-else
    class="directus">

    <loader
      v-if="hydrating"
      area="full-page" />

    <div v-else-if="hydratingError">
      Oops... something went terribly wrong. Please try refreshing the page.

      <pre>{{ hydratingError }}</pre>
    </div>

    <div v-else>
      <header-bar
        :show-info-button="infoSidebarHasContent"
        @toggleNav="toggleNav"
        @toggleInfo="toggleInfo" />
      <v-blocker
        v-if="navActive && $mq === 'small'"
        :z-index="25"
        @click="toggleNav(false)" />
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

      <v-modal
        v-if="unsavedChanges"
        :action-required="true"
        :title="$t('unsaved_changes')">
        <p>
          {{ $t('unsaved_changes_copy') }}
        </p>
        <template slot="footer">
          <v-button
            bg="danger"
            @click="discardChanges">{{ $t('discard_changes') }}</v-button>
          <v-button
            @click="keepEditing">{{ $t('keep_editing') }}</v-button>
        </template>
      </v-modal>

    </div>

    <notifications
      position="bottom right"
      classes="directus-notification" />

  </div>
</template>

<script>
import { Wormhole } from "portal-vue";
import HeaderBar from "./containers/HeaderBar.vue";
import NavSidebar from "./containers/NavSidebar.vue";
import InfoSidebar from "./components/InfoSidebar.vue";
import VBlocker from "./components/VBlocker.vue";

export default {
  name: "directus",
  components: {
    HeaderBar,
    NavSidebar,
    InfoSidebar,
    VBlocker
  },
  data() {
    return {
      navActive: false,
      infoActive: false
    };
  },
  computed: {
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
      this.navActive = false;
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
    }
  },
  created() {
    this.bodyClass();
  },
  methods: {
    bodyClass() {
      if (this.publicRoute) {
        document.body.classList.add("public");
      } else {
        document.body.classList.remove("public");
      }
    },
    toggleNav(visible = !this.navActive) {
      this.navActive = visible;
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
body:not(.public) {
  padding-top: var(--header-height);

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
