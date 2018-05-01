<template>
  <v-modal-base :message="message">
    <v-button class="confirm" @click="$emit('confirm')">{{ confirmText || $t('ok') }}</v-button>
  </v-modal-base>
</template>

<script>
import VModalBase from "../VModalBase.vue";

export default {
  name: "v-alert",
  props: {
    message: {
      type: String,
      required: true
    },
    confirmText: {
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
.confirm {
  float: right;
}
</style>
