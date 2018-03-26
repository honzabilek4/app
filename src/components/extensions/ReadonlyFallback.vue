<template>
  <div class="readonly-fallback">{{ value }}</div>
</template>

<script>
export default {
  name: 'readonly-fallback',
  props: {
    value: {
      type: null,
      default: '',
    },
  },
};
</script>
