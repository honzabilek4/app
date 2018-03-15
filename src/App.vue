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
      <blocker
        v-if="navActive && $mq === 'small'"
        :z-index="25"
        @click="toggleNav(false)"
      />
      <nav-sidebar
        v-show="navActive || $mq !== 'small'"
        @toggleNav="toggleNav"
      />
      <main :class="{ infoActive }">
        <div class="page-root">
          <sub-header v-if="subHeaderHasContent" />
          <router-view />
        </div>
        <blocker
          v-if="infoSidebarHasContent &&
            ((infoActive && $mq === 'small') || (infoActive && $mq === 'medium'))
          "
          :z-index="5"
          @click="toggleInfo(false)"
        />
        <info-sidebar
          v-show="infoSidebarHasContent && infoActive"
          @close="toggleInfo(false)"
        />
      </main>

      <modal
        v-if="unsavedChanges"
        :action-required="true"
        :title="$t('unsaved_changes')"
      >
        <p>
          {{ $t('unsaved_changes_copy') }}
        </p>
        <template slot="footer">
          <form-button
            bg="danger"
            @click="discardChanges"
          >{{ $t('discard_changes') }}</form-button>
          <form-button
            @click="keepEditing"
          >{{ $t('keep_editing') }}</form-button>
        </template>
      </modal>
    </div>

    <loader
      v-if="hydrating"
      :full-page="true"
    />
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
    unsavedChanges() {
      return this.$route.query.editing === true;
    },
  },
  methods: {
    toggleNav(visible = !this.navActive) {
      this.navActive = visible;
    },
    toggleInfo(visible = !this.infoActive) {
      this.infoActive = visible;
    },
    keepEditing() {
      this.$router.push(`/collections/${this.$route.query.collection}/${this.$route.query.primaryKey}`);
    },
    discardChanges() {
      this.$store.dispatch('discardChanges');
      this.$router.push(this.$route.path);
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
    transition: padding-right var(--medium) var(--transition-out);

    &.infoActive {
      transition: padding-right var(--slow) var(--transition-in);
      padding-right: var(--info-sidebar-width);
    }
  }
}
</style>
