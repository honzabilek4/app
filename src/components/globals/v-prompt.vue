<template>
  <v-modal-base :message="message" @cancel="$emit('cancel')">
    <div class="v-prompt" @keydown.esc="$emit('cancel')">
      <v-textarea
        v-if="multiline"
        class="input multiline"
        :value="value"
        @input="$emit('input', $event)" />
      <v-input
        v-else
        class="input"
        :value="value"
        @input="$emit('input', $event)" />
      <div class="buttons">
        <button class="cancel" @click="$emit('cancel')">{{ cancelText || $t('cancel') }}</button>
        <v-button
          class="confirm"
          :disabled="required && disabled"
          @click="$emit('confirm')">{{ confirmText || $t('ok') }}</v-button>
      </div>
    </div>
  </v-modal-base>
</template>

<script>
import VModalBase from "../v-modal-base.vue";

export default {
  name: "v-prompt",
  props: {
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: null
    },
    cancelText: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    multiline: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VModalBase
  },
  computed: {
    disabled() {
      return this.value == null || this.value.length === 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}
.input {
  margin-top: 20px;

  &.multiline {
    min-height: 100px;
  }
}

.cancel {
  color: var(--gray);
  transition: color var(--fast) var(--transition);

  &:hover {
    color: var(--darker-gray);
  }
}
</style>
