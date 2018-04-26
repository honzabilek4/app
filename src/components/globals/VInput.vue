<template>
  <div
    :class="{ 'icon-left': iconLeft, 'icon-right': iconRight }"
    class="v-input">
    <i
      v-if="iconLeft"
      :class="iconLeftColor"
      class="material-icons">{{ iconLeft }}</i>
    <input
      ref="input"
      :class="{charactercount}"
      :type="type"
      :autocomplete="autocomplete"
      :max="max"
      :maxlength="maxlength"
      :min="min"
      :minlength="minlength"
      :name="name"
      :placeholder="placeholder"
      :readonly="readonly"
      :required="required"
      :spellcheck="spellcheck"
      :value="value"
      :id="id"
      @keydown="$emit('keydown', $event)"
      @input="$emit('input', $event.target.value)">
    <i
      v-if="iconRight"
      :class="iconRightColor"
      class="material-icons">{{ iconRight }}</i>
    <span v-if="charactercount">{{ charsRemaining }}</span>
  </div>
</template>

<script>
export default {
  name: "v-input",
  props: {
    type: {
      type: String,
      default: "text"
    },
    autocomplete: {
      type: String,
      default: "on"
    },
    max: {
      type: [Number, Boolean],
      default: false
    },
    maxlength: {
      type: [Number, Boolean],
      default: false
    },
    min: {
      type: [Number, Boolean],
      default: false
    },
    minlength: {
      type: [Number, Boolean],
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    spellcheck: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: ""
    },
    value: {
      type: null,
      default: ""
    },

    iconLeft: {
      type: String,
      default: ""
    },
    iconLeftColor: {
      type: String,
      default: null,
      validator(val) {
        return [
          "primary",
          "secondary",
          "success",
          "warning",
          "danger"
        ].includes(val);
      }
    },
    iconRight: {
      type: String,
      default: ""
    },
    iconRightColor: {
      type: String,
      default: "primary",
      validator(val) {
        return [
          "primary",
          "secondary",
          "success",
          "warning",
          "danger"
        ].includes(val);
      }
    },
    valid: {
      type: Boolean,
      default: true
    },
    charactercount: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    charsRemaining() {
      return this.maxlength - this.value.length;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-input {
  position: relative;

  input {
    width: 100%;
    border: var(--input-border-width) solid var(--lighter-gray);
    border-radius: var(--border-radius);
    color: var(--gray);
    padding: 10px;
    line-height: 1.5;
    transition: var(--fast) var(--transition);
    transition-property: color, border-color, padding;
    height: var(--input-height);

    &::placeholder {
      color: var(--light-gray);
    }

    &:focus {
      color: var(--darker-gray);
      border-color: var(--primary);
      outline: 0;
    }

    &:focus + i {
      color: var(--primary);
    }

    &:-webkit-autofill {
      box-shadow: inset 0 0 0 1000px var(--white) !important;
      color: var(--dark-gray) !important;
      -webkit-text-fill-color: var(--dark-gray) !important;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      border: var(--input-border-width) solid var(--lighter-gray);
      background-color: var(--white);
      box-shadow: inset 0 0 0 2000px var(--white);
    }
  }

  span {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: var(--fast) var(--transition);
    color: var(--gray);
  }

  input.charactercount:focus {
    padding-right: 30px;
  }

  input:focus + span {
    opacity: 1;
  }

  &.icon-left input {
    padding-left: 33px;
  }

  &.icon-right input {
    padding-right: 33px;
  }

  &.icon-left i,
  &.icon-right i {
    position: absolute;
    top: 50%;
    color: var(--light-gray);
    transform: translateY(-50%);
    font-size: 18px;

    &.primary {
      color: var(--primary);
    }

    &.secondary {
      color: var(--secondary);
    }

    &.success {
      color: var(--success);
    }

    &.warning {
      color: var(--warning);
    }

    &.danger {
      color: var(--danger);
    }
  }

  &.icon-left i:first-of-type {
    left: 10px;
  }

  &.icon-right i:last-of-type {
    right: 10px;
  }
}
</style>
