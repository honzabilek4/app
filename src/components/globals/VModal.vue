<template>
  <transition name="slide">
    <div class="v-modal">
      <div
        :class="actionRequired ? null : 'pointer'"
        class="modal-mask"
        @click="actionRequired ? null : $emit('close')" />
      <div class="modal-wrapper">
        <aside
          ref="modal"
          :class="{ simple }"
          class="modal-container"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          role="dialog"
          @keydown.esc="actionRequired ? null : $emit('close')">
          <focus-lock>
            <div role="document">
              <div
                id="modal-description"
                class="screen-reader-offscreen">
                {{ $t('dialog_beginning') }} {{ actionRequired ? null : $t('esc_cancel') }}
              </div>
              <header>
                <h1
                  id="modal-title"
                  class="style-1">{{ title }}</h1>
                <button
                  v-if="!actionRequired && !simple"
                  @click="$emit('close')"><i class="material-icons">close</i></button>
              </header>
              <div
                v-if="!simple"
                class="body">
                <slot />
              </div>
              <div class="footer">
                <slot name="footer">
                  <button
                    v-if="!actionRequired"
                    @click="$emit('close')">{{ cancel || $t('cancel') }}</button>
                  <v-button
                    :bg="okBg"
                    :color="okColor"
                    class="confirm"
                    @click="$emit('confirm')">{{ ok || $t('ok') }}</v-button>
                </slot>
              </div>
            </div>
          </focus-lock>
        </aside>
      </div>
    </div>
  </transition>
</template>

<script>
import FocusLock from "vue-focus-lock";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

export default {
  name: "v-modal",
  components: {
    FocusLock
  },
  props: {
    actionRequired: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    cancel: {
      type: String,
      default: ""
    },
    ok: {
      type: String,
      default: ""
    },
    okBg: {
      type: String,
      default: "accent"
    },
    okColor: {
      type: String,
      default: "white"
    },
    simple: {
      type: Boolean,
      default: false
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
.v-modal {
  display: table;
  position: fixed;
  z-index: 500;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-mask {
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

.modal-wrapper {
  position: relative;
  display: table-cell;
  vertical-align: middle;
  pointer-events: none;
  opacity: 1;
  z-index: +1;
}

.modal-container {
  position: relative;
  margin: 0 auto;
  width: 90%;
  max-width: 600px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  transition: inherit;
  pointer-events: painted;
  cursor: default;

  h1 {
    color: var(--darker-gray);
    line-height: 24px; /* match close icon */
  }

  header,
  .footer {
    padding: 20px 30px;
  }

  header,
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  header {
    border-bottom: 1px solid var(--lightest-gray);
    position: sticky;
    top: 0;
  }

  .body {
    padding: 30px;
  }

  .footer {
    border-top: 1px solid var(--lightest-gray);
  }

  button:not(.confirm) {
    transition: var(--fast) var(--transition);
    color: var(--gray);

    &:hover {
      color: var(--darkest-gray);
    }
  }

  &.simple {
    max-width: 500px;

    header,
    .footer {
      border: 0;
    }
  }
}

.screen-reader-offscreen {
  position: absolute;
  left: -99999px;
}

.slide-enter-active,
.slide-enter-active .modal-container {
  transition: var(--slow) var(--transition-in);
}

.slide-leave-active,
.slide-leave-active .modal-container {
  transition: var(--medium) var(--transition-out);
}

.slide-enter,
.slide-leave-to {
  opacity: 0;

  .modal-container {
    transform: translateY(50px);
  }
}
</style>
