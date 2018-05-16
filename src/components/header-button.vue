<template>
  <div class="header-button">
    <div
      v-if="Object.keys(options).length > 0"
      class="options">
      <select
        :disabled="disabled"
        v-model="choice"
        @change="emitChange">
        <option
          disabled
          selected
          value="">
          {{ $t('more_options') }}
        </option>
        <option
          v-for="(display, value) in options"
          :value="value"
          :key="value">
          {{ display }}
        </option>
      </select>
      <i class="material-icons">more_horiz</i>
    </div>
    <button
      :style="{
        color: `var(--${color})`,
      }"
      :class="[bg || 'no-bg', { 'attention': seekAttention }]"
      :disabled="disabled"
      @click="$emit('click', $event)">
      <i
        v-if="!loading"
        class="material-icons">{{ icon }}</i>
      <spinner
        v-else
        :size="24"
        line-fg-color="white"
        line-bg-color="transparent"/>
      <span class="style-btn"><slot /></span>
    </button>
  </div>
</template>

<script>
export default {
  name: "header-button",
  props: {
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: "white",
      validator: value => ["white", "black"].includes(value)
    },
    bg: {
      type: [String, Boolean],
      default: false,
      validator: value => {
        if (value === false) return true;
        return ["action", "success", "warning", "danger"].includes(value);
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({})
    },
    seekAttention: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      choice: null
    };
  },
  methods: {
    emitChange(event) {
      this.$emit("input", event.target.value);
      this.choice = null;
    }
  }
};
</script>

<style scoped lang="scss">
.header-button {
  position: relative;
  height: var(--header-height);
  width: var(--header-height);
}

button {
  position: relative;
  background-color: transparent;
  appearance: none;
  display: block;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 0;
  cursor: pointer;

  i {
    transition: 100ms var(--transition);
  }

  span {
    position: absolute;
    bottom: 2px;
    opacity: 0;
    transform: translateY(5px);
    transition: 100ms var(--transition-out);
    font-size: 10px;
  }

  &:hover:not([disabled]) span,
  .user-is-tabbing &:focus span {
    opacity: 0.6;
    transform: translateY(0);
    transition: 100ms var(--transition-in);
  }

  &:not([disabled]):active i {
    transform: scale(0.8);
    opacity: 0.8;
  }

  &::after {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    background-color: var(--warning);
    border-radius: 50%;
    position: absolute;
    top: 27%;
    right: 27%;
    border: 2px solid var(--darkest-gray);
    transform: scale(0);
    transition: transform var(--fast) var(--transition-out);
  }

  &.attention::after {
    transform: scale(1);
    transition: transform var(--fast) var(--transition-in);
  }
}

button.action {
  background-color: var(--action);
}

button.success {
  background-color: var(--success);
}

button.warning {
  background-color: var(--warning);
}

button.danger {
  background-color: var(--danger);
}

button.no-bg {
  border-left: 1px solid #444444;
}

button[disabled] {
  background-color: var(--darker-gray);
  color: var(--dark-gray);
  cursor: not-allowed;
  i {
    color: var(--gray);
  }
}

.options {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30%;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: +1;

  i {
    opacity: 0.6;
    transition: opacity var(--fast) var(--transition);
  }

  select {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    top: 0;
    left: 0;
    cursor: pointer;
    z-index: +2;

    &:hover:not([disabled]) + i {
      opacity: 1;
    }

    &[disabled] {
      cursor: not-allowed;

      & + i {
        opacity: 0.1;
      }
    }
  }
}
</style>
