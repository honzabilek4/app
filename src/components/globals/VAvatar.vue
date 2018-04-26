<template>
  <div class="v-avatar">
    <img
      :src="src"
      :alt="alt"
      :style="{ borderColor: `var(--${color})` }">
    <div
      v-if="indicator"
      :style="{
        backgroundColor: `var(--${color})`
      }"
      class="indicator"/>
  </div>
</template>

<script>
export default {
  name: "v-avatar",
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    indicator: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "primary"
    },
    size: {
      type: Number,
      default: 40
    }
  }
};
</script>

<style scoped>
div {
  position: relative;
  width: 40px;
  height: 40px;
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid;
}

.indicator {
  position: absolute;
  bottom: 3%;
  right: 3%;
  border-radius: 50%;
  border: 2px solid white;
  width: 12px;
  height: 12px;
}
</style>
