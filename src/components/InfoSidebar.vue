<template>
  <div>
    <blocker :active="active" @click="$emit('toggleInfo', false)"/>
    <aside :class="{ active }">
      <portal-target name="info-sidebar" />
    </aside>
  </div>
</template>

<script>
  import Blocker from './Blocker.vue';

  export default {
    props: {
      active: Boolean,
    },
    components: {
      Blocker,
    },
  }
</script>

<style lang="scss" scoped>
aside {
  position: fixed;
  right: 0;
  bottom: 0;
  height: calc(100% - var(--header-height));
  transform: translateX(100%);
  z-index: 5;
  transition: 250ms var(--transition-out);
  width: 100%;
  max-width: var(--info-sidebar-width);
  background-color: var(--white);
  border-left: 1px solid var(--lighter-gray);
}

aside.active {
  transform: translateX(0);
  transition: 200ms var(--transition-in);
}

@media (min-width: 62.5em) {
  .blocker {
    display: none;
  }
}
</style>
