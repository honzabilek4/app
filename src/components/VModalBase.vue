<template>
  <transition name="slide">
    <div class="v-alert">
      <div class="mask" />
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
.v-alert {
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
  max-width: 450px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  transition: inherit;
  pointer-events: painted;
  cursor: default;
  padding: 20px;
  overflow: auto;

  p {
    font-size: 16px;
    margin-bottom: 20px;
  }

  button {
    float: right;
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
