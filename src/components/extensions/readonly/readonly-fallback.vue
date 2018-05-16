<template>
  <div class="v-readonly-fallback">{{ value }}</div>
</template>

<script>
export default {
  name: "v-readonly-fallback",
  props: {
    value: {
      type: null,
      default: ""
    }
  }
};
</script>
