<template>
  <div class="v-slider">
    <div class="input">
      <input
        :id="id"
        :name="id"
        :value="value"
        :min="min"
        :max="max"
        :step="step"
        type="range"
        @input="$emit('input', Number($event.target.value))">
      <div
        ref="track"
        class="track-wrapper">
        <div
          :style="{ transform: `scaleX(${progress})` }"
          class="track-fill" />
      </div>
    </div>
    <output :for="id">{{ valueOrDefault }} {{ unit }}</output>
  </div>
</template>

<script>
export default {
  name: "v-slider",
  props: {
    id: {
      type: String,
      default: null
    },
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      required: true
    },
    step: {
      type: [Number, String],
      default: 1
    },
    unit: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      valuePos: 0
    };
  },
  computed: {
    valueOrDefault() {
      if (this.value == null) {
        return (this.max - this.min) / 2;
      }

      return this.value;
    },
    progress() {
      return (
        Math.round(this.valueOrDefault / (this.max - this.min) * 100) / 100
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.v-slider {
  position: relative;

  .input {
    padding: 10px;
    border: var(--input-border-width) solid var(--lighter-gray);
    border-radius: 15px;
    background-color: var(--white);

    flex-grow: 1;
    flex-shrink: 0;
    display: grid;
    grid-template-columns: 2;
    grid-template-rows: 1;
    grid-gap: 10px;
  }

  .track-wrapper {
    height: 4px;
    width: 100%;
    border-radius: 3px;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
    position: relative;

    .track-fill {
      background-color: var(--accent);
      width: 100%;
      height: 100%;
      transform-origin: left;
      transform: scaleX(0);
    }
  }

  input,
  .track-wrapper {
    grid-row: 1;
    grid-column: 1;
  }

  input {
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
      background: var(--accent);
      margin-top: -5px;
      cursor: ew-resize;
      box-shadow: 0 0 0 2px var(--white);
      z-index: +1;
      position: relative;
    }
  }

  output {
    position: absolute;
    left: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    color: var(--accent);
    opacity: 0;
    transition: var(--fast) var(--transition-out);
  }

  .input:hover ~ output,
  .input:active ~ output,
  .user-is-tabbing .input:focus ~ output,
  .user-is-tabbing .input:focus-within ~ output {
    opacity: 1;
    transition: var(--fast) var(--transition-in);
  }
}
</style>
