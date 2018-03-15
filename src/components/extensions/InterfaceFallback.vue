<template>
  <form-input
    :value="value"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: null,
      default: '',
    },
  },
};
</script>
