<template>
  <v-modal-base :message="message" @cancel="$emit('cancel')">
    <div class="buttons" @keydown.esc="$emit('cancel')">
      <button class="cancel" @click="$emit('cancel')">{{ cancelText || $t('cancel') }}</button>
      <v-button class="confirm" @click="$emit('confirm')">{{ confirmText || $t('ok') }}</v-button>
    </div>
  </v-modal-base>
</template>

<script>
import VModalBase from "./modal-base.vue";

export default {
  name: "v-confirm",
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

.cancel {
  color: var(--gray);
  transition: color var(--fast) var(--transition);

  &:hover {
    color: var(--darker-gray);
  }
}
</style>
