<template>
  <transition name="fade">
    <div
      :class="{'full-page': fullPage}"
      class="loader"
    >
      <transition name="fade">
        <spinner
          v-show="active"
          class="spinner"
        />
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    fullPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: false,
    };
  },
  created() {
    setTimeout(() => {
      this.active = true;
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
.loader {
  background-color: #f9f9f9;
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: calc(100% - var(--header-height));
  z-index: 500;

  @media (min-width: 800px) {
    width: calc(100% - var(--nav-sidebar-width));
  }

  .spinner {
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
  }
}

.loader.full-page {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity var(--medium) var(--transition-in);
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
