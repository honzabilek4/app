<template>
  <button
    :class="[bg || 'no-bg', { fullwidth, loading }, color]"
    :type="type"
    :disabled="disabled || loading"
    class="style-btn"
  >
    <i
      v-if="icon && !loading"
      class="material-icons">{{ icon }}</i>
    <spinner
      v-if="loading"
      :line-size="2"
      size="13"
      line-foreground-color="#fff"
      line-background-color="var(--primary)"
      class="spinner" />
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    fullwidth: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'white',
      validator: value => ['white', 'black'].includes(value),
    },
    bg: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'warning', 'danger'].includes(value),
    },
  },
};
</script>

<style lang="scss" scoped>
button.primary {
  background-color: var(--primary);
  &:hover {
    background-color: var(--primary-dark);
  }
}
button.secondary {
  background-color: var(--secondary);
  &:hover {
    background-color: var(--secondary-dark);
  }
}
button.warning {
  background-color: var(--warning);
  &:hover {
    background-color: var(--warning-dark);
  }
}
button.danger {
  background-color: var(--danger);
  &:hover {
    background-color: var(--danger-dark);
  }
}
button.black { color: var(--black); }
button.white { color: var(--white); }

button {
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--fast) var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--input-height);

  &:disabled:not(.loading) {
    background-color: var(--lightest-gray);
    border: var(--input-border-width) solid var(--lighter-gray);
    color: var(--gray);
    cursor: not-allowed;
  }

  &.loading {
    cursor: progress;
  }

  &.fullwidth {
    width: 100%;
  }
}

.spinner {
  margin-right: 10px;
}
</style>
