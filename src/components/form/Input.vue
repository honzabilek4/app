<template>
  <div
    :class="{icon}"
    class="form-input">
    <input
      ref="input"
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
      @input="$emit('input', $event.target.value)">
    <i
      v-if="icon"
      class="material-icons">{{ icon }}</i>
    <span v-if="charactercount">{{ charsRemaining }}</span>
  </div>
</template>

<script>
export default {
  name: 'form-input',
  props: {
    type: {
      type: String,
      default: 'text',
    },
    autocomplete: {
      type: String,
      default: 'on',
    },
    max: {
      type: [Number, Boolean],
      default: false,
    },
    maxlength: {
      type: [Number, Boolean],
      default: false,
    },
    min: {
      type: [Number, Boolean],
      default: false,
    },
    minlength: {
      type: [Number, Boolean],
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    spellcheck: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      default: '',
    },
    value: {
      type: null,
      default: '',
    },

    icon: {
      type: String,
      default: '',
    },
    valid: {
      type: Boolean,
      default: true,
    },
    charactercount: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    charsRemaining() {
      return this.maxlength - this.value.length;
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  position: relative;
  margin: 10px 0;
  display: flex;
  align-items: center;
}

input {
  flex-grow: 1;
  width: 100%;
  border: var(--input-border-width) solid var(--lighter-gray);
  border-radius: var(--border-radius);
  color: var(--gray);
  padding: 10px;
  line-height: 1.5;
  transition: var(--fast) var(--transition);
  transition-property: color, border-color;
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

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover
  textarea:-webkit-autofill:focus {
    border: var(--input-border-width) solid var(--lighter-gray);
    background-color: var(--white);
    box-shadow: inset 0 0 0 2000px var(--white);
  }

}

span {
  margin: 0 10px;
  opacity: 0;
  transition: var(--fast) var(--transition);
  flex-shrink: 0;
  flex-basis: 30px;
}

input:focus + span {
  opacity: 1;
}

.icon input {
  padding-left: 33px;
}

i {
  position: absolute;
  left: 10px;
  top: 50%;
  color: var(--light-gray);
  transform: translateY(-50%);
  font-size: 18px;
}
</style>
