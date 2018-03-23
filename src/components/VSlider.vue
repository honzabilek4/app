<template>
  <input
    :id="id"
    :value="value"
    :min="min"
    :max="max"
    :step="step"
    class="v-slider"
    type="range"
    @input="$emit('input', Number($event.target.value))">
</template>

<script>
export default {
  name: 'v-slider',
  props: {
    id: {
      type: String,
      default: null,
    },
    value: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    step: {
      type: [Number, String],
      default: 1,
    },
  },
};
</script>

<style lang="scss" scoped>
.v-slider {
  margin: 20px;
  appearance: none;

  &::-webkit-slider-runnable-track {
    height: 4px;
    background: var(--light-gray);
    box-shadow: none;
    border: none;
    border-radius: 3px;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    box-shadow: none;
    border: none;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: var(--primary);
    margin-top: -5px;
    cursor: ew-resize;
  }
}
</style>
