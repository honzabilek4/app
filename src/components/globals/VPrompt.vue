<template>
  <v-modal-base :message="message">
    <v-textarea v-if="multiline" class="input multiline" @input="$emit('input', $event)" :value="value" />
    <v-input v-else class="input" @input="$emit('input', $event)" :value="value" />
    <div class="buttons">
      <button class="cancel" @click="$emit('cancel')">{{ cancelText || $t('cancel') }}</button>
      <v-button class="confirm" @click="$emit('confirm')">{{ confirmText || $t('ok') }}</v-button>
    </div>
  </v-modal-base>
</template>

<script>
import VModalBase from "../VModalBase.vue";

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
    }
  },
  components: {
    VModalBase
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
