<template>
  <div class="nav-sidebar">
    <v-blocker
      v-show="active"
      class="blocker"
      @click="disableNav" />
    <transition name="nav">
      <aside :class="{ active }">
        <button
          class="a11y-close"
          @click="disableNav">Close nav</button>

        <v-logo class="logo" />

        <section class="content">
          <project-switcher />

          <nav-menu
            :title="$t('collections')"
            :links="collectionNames.map(name => ({
              path: `/collections/${name}`,
              name: $t(`collections-${name}`)
            }))"
            no-border />

          <nav-bookmarks :bookmarks="bookmarks" />
        </section>
        <user-menu />
      </aside>
    </transition>
  </div>
</template>

<script>
import VLogo from "./logo.vue";
import ProjectSwitcher from "./project-switcher.vue";
import NavMenu from "./nav-menu.vue";
import UserMenu from "./user-menu.vue";
import NavBookmarks from "./nav-bookmarks.vue";
import VBlocker from "../../blocker.vue";
import { TOGGLE_NAV } from "../../../store/mutation-types";

export default {
  name: "nav-sidebar",
  components: {
    VLogo,
    ProjectSwitcher,
    NavMenu,
    UserMenu,
    NavBookmarks,
    VBlocker
  },
  computed: {
    collectionNames() {
      const collections = this.$store.state.collections;

      if (collections == null) return [];

      return Object.values(collections)
        .filter(collection => collection.hidden === false)
        .map(collection => collection.collection);
    },
    bookmarks() {
      return this.$store.state.bookmarks;
    },
    projectName() {
      return this.$store.state.auth.projectName;
    },
    active() {
      return this.$store.state.sidebars.nav;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
    deleteBookmark(id) {
      this.$store.dispatch("deleteBookmark", id);
    },
    toBookmark(bookmark) {
      /* eslint-disable camelcase */
      const {
        collection,
        search_query,
        filters,
        view_options,
        view_type,
        view_query
      } = bookmark;

      this.$store
        .dispatch("setListingPreferences", {
          collection,
          updates: {
            search_query,
            filters,
            view_options,
            view_type,
            view_query
          }
        })
        .then(() => {
          this.$router.push(`/collections/${collection}`);
        });
    },
    disableNav() {
      this.$store.commit(TOGGLE_NAV, false);
    }
  }
};
</script>

<style lang="scss" scoped>
aside {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 30;
  width: 100%;
  max-width: 80%;
  background-color: var(--white);

  transform: translateX(-100%);
  visibility: hidden;
  transition: transform var(--slow) var(--transition-out),
    visibility 0ms var(--transition-out) var(--slow);

  &.active {
    transform: translateX(0);
    transition: transform var(--slow) var(--transition-in);
    visibility: visible;
  }

  @media (min-width: 800px) {
    transform: translateX(0);
    transition: none;
    visibility: visible;
    max-width: var(--nav-sidebar-width);
  }

  > div {
    height: 100%;
  }

  & .a11y-close {
    position: absolute;
    z-index: 15;
    left: -999px;
    background-color: yellow;
    padding: 5px;

    .user-is-tabbing &:focus {
      top: 13px;
      left: 13px;
    }

    @media (min-width: 800px) {
      display: none;
    }
  }
}

.content {
  position: relative;
  padding: 20px;
  padding-top: 0;
  height: calc(100% - var(--header-height) - var(--header-height));
  overflow: scroll;
  -webkit-overflow-scrolling: touch;

  @media (min-width: 800px) {
    box-shadow: 1px 0 0 0 var(--lightest-gray);
  }
}
</style>

<style>
@media (min-width: 800px) {
  body {
    padding-left: var(--nav-sidebar-width);
  }
}
</style>
