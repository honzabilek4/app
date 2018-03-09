<template>
  <router-view
    v-if="publicRoute"
    class="root"
  />

  <div
    v-else-if="hydrating"
    class="root loading"
  >
    <transition name="fade"/>
    <div class="blocker"/>
    <header-bar />
    <nav-sidebar />
    <main>
      <spinner/>
    </main>
    <portal to="header-title"><span/></portal>
  </div>

  <div
    v-else
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
      <router-view class="page-root" />
      <info-sidebar
        v-if="infoSidebarHasContent"
        :active="infoActive"
        @toggleInfo="toggleInfo"
      />
    </main>
  </div>
</template>

<script>
import { Wormhole } from 'portal-vue';
import HeaderBar from './containers/HeaderBar.vue';
import NavSidebar from './containers/NavSidebar.vue';
import InfoSidebar from './components/InfoSidebar.vue';

export default {
  name: 'Directus',
  components: {
    HeaderBar, NavSidebar, InfoSidebar,
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
      return Wormhole.hasContentFor('info-sidebar');
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

.loading {
  opacity: 0.5;
}

.loading main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
