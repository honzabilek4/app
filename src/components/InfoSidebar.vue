<template>
  <div>
    <blocker
      :active="active"
      @click="$emit('toggleInfo', false)"/>
    <aside :class="{ active }">
      <portal-target
        v-if="hasSystemContent"
        name="info-sidebar-system"
        class="system"
      />
      <portal-target name="info-sidebar" />
    </aside>
  </div>
</template>

<script>
import { Wormhole } from 'portal-vue';
import Blocker from './Blocker.vue';

export default {
  components: {
    Blocker,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasSystemContent() {
      return Wormhole.hasContentFor('info-sidebar-system');
    },
  },
};
</script>

<style lang="scss" scoped>
aside {
  position: fixed;
  right: 0;
  bottom: 0;
  height: calc(100% - var(--header-height));
  transform: translateX(100%);
  z-index: 5;
  transition: var(--slow) var(--transition-out);
  width: 100%;
  max-width: var(--info-sidebar-width);
  background-color: var(--white);
  border-left: 1px solid var(--lightest-gray);
  padding: 20px;
}

aside.active {
  transform: translateX(0);
  transition: var(--medium) var(--transition-in);
}

@media (min-width: 62.5em) {
  .blocker {
    display: none;
  }
}

.system {
  padding-bottom: 30px;
  border-bottom: 1px solid var(--lightest-gray);
  margin-bottom: 30px;
}
</style>
