<template>
  <div>
    <blocker :zIndex="15" :active="active" @click="$emit('toggleNav', false)" />
    <aside :class="{ active }">
      <button v-if="active" class="close" @click="$emit('toggleNav', false)">Close nav</button>
      <div class="logo">
        <img src="@/assets/logo.svg" alt="Directus Logo" />
      </div>
      <div class="content">

      </div>
    </aside>
  </div>
</template>

<script>
  import Blocker from '../components/Blocker.vue';

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
  width: var(--nav-sidebar-width);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  transform: translateX(-100%);
  z-index: 15;
  transition: 250ms var(--transition-out);
}

.logo {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary);
  height: var(--header-height);

  img {
    height: 80%;
  }
}

.content {
  background-color: var(--white);
  box-shadow: 1px 0 0 -0px var(--lighter-gray);
  min-height: calc(100% - var(--header-height));
}

aside.active {
  transform: translateX(0);
  transition: 200ms var(--transition-in);
}

aside .close {
  position: absolute;
  z-index: 15;
  left: -999px;

  &:focus {
    top: var(--normal);
    left: var(--normal);
  }
}

@media (min-width: 50em) {
  aside {
    transition: none;
    transform: translateX(0);
  }

  .blocker, .close {
    display: none;
  }
}
</style>
