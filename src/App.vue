<template>
  <router-view
    v-if="publicRoute"
    class="root"
  />

  <div
    v-else
    class="root"
  >
    <div
      v-if="!hydrating"
      class="root"
    >
      <header-bar
        :show-info-button="infoSidebarHasContent"
        @toggleNav="toggleNav"
        @toggleInfo="toggleInfo"
      />
      <nav-sidebar
        :active="navActive"
        @toggleNav="toggleNav"
      />
      <main :class="{ infoActive }">
        <div class="page-root">
          <sub-header v-if="subHeaderHasContent" />
          <router-view />
        </div>
        <info-sidebar
          v-if="infoSidebarHasContent"
          :active="infoActive"
          @toggleInfo="toggleInfo"
        />
      </main>
    </div>

    <transition name="fade">
      <div
        v-if="hydrating"
        class="loader"
      >
        <spinner class="spinner" />
      </div>
    </transition>
  </div>
</template>

<script>
import { Wormhole } from 'portal-vue';
import HeaderBar from './containers/HeaderBar.vue';
import SubHeader from './components/SubHeader.vue';
import NavSidebar from './containers/NavSidebar.vue';
import InfoSidebar from './components/InfoSidebar.vue';

export default {
  name: 'Directus',
  components: {
    HeaderBar, NavSidebar, InfoSidebar, SubHeader,
  },
  data() {
    return {
      navActive: false,
      infoActive: false,
    };
  },
  computed: {
    publicRoute() {
      return this.$route.meta.publicRoute || false;
    },
    infoSidebarHasContent() {
      return Wormhole.hasContentFor('info-sidebar') || Wormhole.hasContentFor('info-sidebar-system');
    },
    subHeaderHasContent() {
      return Wormhole.hasContentFor('sub-header');
    },
    hydrating() {
      return this.$store.state.hydrating;
    },
  },
  methods: {
    toggleNav(visible = !this.navActive) {
      this.navActive = visible;
    },
    toggleInfo(visible = !this.infoActive) {
      this.infoActive = visible;
    },
  },
};
</script>

<style lang="scss" scoped>
.root, .page-root {
  height: 100%;
}

.flex {
  display: flex;
  align-items: stretch;
  height: 100%;
}

.page-root {
  flex-grow: 1;
}

main {
  min-width: 100%;
  min-height: 100%;
  padding-top: var(--header-height);

  @media (min-width: 50em) {
    padding-left: calc(var(--nav-sidebar-width) + 1px); /* sidebar shadow */
  }

  @media (min-width: 62.5em) {
    display: flex;
    align-items: stretch;
    padding-right: 0;
    transition: padding-right var(--slow) var(--transition-out);

    &.infoActive {
      transition: padding-right var(--medium) var(--transition-in);
      padding-right: var(--info-sidebar-width);
    }
  }
}

.loader {
  background-color: #f9f9f9;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;

  .spinner {
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity var(--medium) var(--transition-in);
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
