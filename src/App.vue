<template>
  <router-view
    v-if="publicRoute"
    class="directus" />

  <div
    v-else
    class="directus">
    <div v-if="!hydrating">
      <header-bar
        :show-info-button="infoSidebarHasContent"
        @toggleNav="toggleNav"
        @toggleInfo="toggleInfo" />
      <blocker
        v-if="navActive && $mq === 'small'"
        :z-index="25"
        @click="toggleNav(false)" />
      <nav-sidebar
        v-show="navActive || $mq !== 'small'"
        @toggleNav="toggleNav" />
      <main :class="{ 'info-active': infoActive }">
        <router-view class="page-root" />
        <blocker
          v-if="infoSidebarHasContent &&
            ((infoActive && $mq === 'small') || (infoActive && $mq === 'medium'))
          "
          :z-index="5"
          @click="toggleInfo(false)" />
        <info-sidebar
          v-show="infoSidebarHasContent && infoActive"
          @close="toggleInfo(false)" />
      </main>

      <modal
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
      </modal>
    </div>

    <notifications
      position="bottom right"
      classes="directus-notification" />

    <loader
      v-if="hydrating"
      area="full-page" />
  </div>
</template>

<script>
import { Wormhole } from 'portal-vue';
import HeaderBar from './containers/HeaderBar.vue';
import NavSidebar from './containers/NavSidebar.vue';
import InfoSidebar from './components/InfoSidebar.vue';

export default {
  name: 'directus',
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

      if (visible) {
        document.body.classList.add('info-active');
      } else {
        document.body.classList.remove('info-active');
      }
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

<style lang="scss">
body {
  padding-top: var(--header-height);

  @media (min-width: 50em) {
    padding-left: calc(var(--nav-sidebar-width) + 1px); /* +1px = sidebar shadow */
  }

  @media (min-width: 62.5em) {
    transition: padding-right var(--medium) var(--transition-out);

    &.info-active {
      transition: padding-right var(--slow) var(--transition-in);
      padding-right: var(--info-sidebar-width);
    }
  }
}
</style>

<style lang="scss" scoped>
.directus, .page-root, .directus > div:first-child {
  height: 100%;
}

main {
  height: 100%;
  width: 100%;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
