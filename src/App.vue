<template>
  <router-view class="root" v-if="public" />

  <div class="root" v-else>
    <header-bar @toggleNav="toggleNav" @toggleInfo="toggleInfo" :showInfoButton="infoSidebarHasContent" />
    <nav-sidebar @toggleNav="toggleNav" :active="navActive" />
    <main :class="{ infoActive }">
      <router-view class="page-root" />
      <info-sidebar :active="infoActive" @toggleInfo="toggleInfo" v-if="infoSidebarHasContent" />
    </main>
  </div>
</template>

<script>
  import { Wormhole } from 'portal-vue';
  import HeaderBar from './containers/HeaderBar.vue';
  import NavSidebar from './containers/NavSidebar.vue';
  import InfoSidebar from './components/InfoSidebar.vue';

  export default {
    data() {
      return {
        navActive: false,
        infoActive: false,
      };
    },
    computed: {
      public() {
        return this.$route.meta.public || false;
      },
      infoSidebarHasContent() {
        return Wormhole.hasContentFor('info-sidebar');
      },
    },
    components: {
      HeaderBar, NavSidebar, InfoSidebar,
    },
    methods: {
      toggleNav(visible = !this.navActive) {
        this.navActive = visible;
      },
      toggleInfo(visible = !this.infoActive) {
        this.infoActive = visible;
      },
    },
  }
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
  border-top: 1px solid var(--lighter-gray);
}

main {
  background-color: #f9f9f9;
  min-width: 100%;
  min-height: 100%;
  padding-top: var(--header-height);

  @media (min-width: 50em) {
    padding-left: calc(var(--nav-sidebar-width) + 1px); /* sidebar shadow */
  }

  @media (min-width: 62.5em) {
    display: flex;
    align-items: stretch;

    &.infoActive {
      padding-right: var(--info-sidebar-width);
    }
  }
}
</style>
