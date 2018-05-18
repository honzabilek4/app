<template>
  <div>
    <v-blocker :z-index="9" v-show="active" @click="disableSidebar" />
    <transition name="info">
      <aside class="info-sidebar" :class="{ wide }" v-show="active">
        <div class="system">
          <slot name="system" />
        </div>
        <slot />
      </aside>
    </transition>
  </div>
</template>

<script>
import VBlocker from "../blocker.vue";
import { TOGGLE_INFO } from "../../store/mutation-types";

export default {
  name: "info-sidebar",
  components: {
    VBlocker
  },
  props: {
    wide: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    active() {
      return this.$store.state.sidebars.info;
    }
  },
  methods: {
    disableSidebar() {
      this.$store.commit(TOGGLE_INFO, false);
    }
  }
};
</script>

<style lang="scss" scoped>
.info-sidebar {
  position: fixed;
  right: 0;
  bottom: 0;
  height: calc(100% - var(--header-height));
  z-index: 10;
  transition: var(--slow) var(--transition-out);
  width: 90%;
  background-color: var(--white);
  border-left: 1px solid var(--lightest-gray);
  padding: 20px;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;

  & .system:not(:empty) {
    padding-bottom: 30px;
    border-bottom: 1px solid var(--lightest-gray);
    margin-bottom: 30px;
  }

  @media (min-width: 800px) {
    max-width: var(--nav-sidebar-width);

    &.wide {
      max-width: var(--info-sidebar-width);
    }
  }
}

.info-enter-active {
  transition: var(--slow) var(--transition-in);
}

.info-leave-active {
  transition: var(--medium) var(--transition-out);
}

.info-enter,
.info-leave-to {
  transform: translateX(100%);
}
</style>
