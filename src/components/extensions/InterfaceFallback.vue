<template>
  <v-input
    :value="value"
    class="interface-fallback"
    @input="$emit('input', $event)" />
</template>

<script>
export default {
  name: 'interface-fallback',
  props: {
    value: {
      type: null,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.interface-fallback {
  max-width: var(--width-normal);
}
</style>
