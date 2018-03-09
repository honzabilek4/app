<template>
  <button
    :style="{
      color: `var(--${color})`,
    }"
    :class="bg || 'no-bg'"
    @click="$emit('click', $event)"
  >
    <i class="material-icons">{{ icon }}</i>
    <span class="style-btn"><slot /></span>
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'white',
      validator: value => ['white', 'black'].includes(value),
    },
    bg: {
      type: [String, Boolean],
      default: false,
      validator: (value) => {
        if (value === false) return true;
        return ['primary', 'secondary', 'warning', 'danger'].includes(value);
      },
    },
  },
};
</script>

<style scoped lang="scss">
button {
  background-color: transparent;
  appearance: none;
  display: block;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--header-height);
  height: 100%;
  position: relative;
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

  &:hover span,
  &:focus span {
    opacity: 0.6;
    transform: translateY(0);
    transition: 100ms var(--transition-in);
  }

  &:active i {
    transform: scale(0.8);
    opacity: 0.8;
  }
}

button.primary { background-color: var(--primary); }
button.secondary { background-color: var(--secondary); }
button.warning { background-color: var(--warning); }
button.danger { background-color: var(--danger); }
button.no-bg { border-left: 1px solid #444444; }
</style>
