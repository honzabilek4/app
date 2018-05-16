<template>
  <transition name="slide">
    <div class="v-modal-base">
      <div class="mask" @click="$emit('cancel')" />
      <div class="wrapper">
        <aside class="modal">
          <focus-lock>
            <p>{{ message }}</p>
            <slot />
          </focus-lock>
        </aside>
      </div>
    </div>
  </transition>
</template>

<script>
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import FocusLock from "vue-focus-lock";

export default {
  name: "v-modal-base",
  components: {
    FocusLock
  },
  props: {
    message: {
      type: String,
      required: true
    }
  },
  mounted() {
    disableBodyScroll(this.$refs.modal);
  },
  beforeDestroy() {
    enableBodyScroll(this.$refs.modal);
  }
};
</script>

<style lang="scss" scoped>
.v-modal-base {
  display: table;
  position: fixed;
  z-index: 500;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: var(--black);
  opacity: 0.6;
  cursor: pointer;

  &.pointer {
    cursor: pointer;
  }
}

.wrapper {
  position: relative;
  display: table-cell;
  vertical-align: middle;
  pointer-events: none;
  opacity: 1;
  z-index: +1;
}

aside {
  position: relative;
  margin: 0 auto;
  width: 90%;
  max-width: 500px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  transition: inherit;
  pointer-events: painted;
  cursor: default;
  padding: 30px;
  overflow: auto;

  p {
    font-size: 16px;
  }
}

.slide-enter-active,
.slide-enter-active aside {
  transition: var(--slow) var(--transition-in);
}

.slide-leave-active,
.slide-leave-active aside {
  transition: var(--medium) var(--transition-out);
}

.slide-enter,
.slide-leave-to {
  opacity: 0;

  aside {
    transform: translateY(50px);
  }
}
</style>
