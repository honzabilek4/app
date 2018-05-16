<template>
  <v-input
    :value="value"
    class="v-interface-fallback"
    @input="$emit('input', $event)" />
</template>

<script>
export default {
  name: "v-interface-fallback",
  props: {
    value: {
      type: null,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
.v-interface-fallback {
  max-width: var(--width-normal);
}
</style>
