<template>
  <div :class="{
    icon,
  }">
    <input
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
      @input="$emit('input', $event.target.value)"
      ref="input"
    />
    <i v-if="icon" class="material-icons">{{ icon }}</i>
    <span v-if="charactercount">{{ charsRemaining }}</span>
  </div>
</template>

<script>
  export default {
    computed: {
      charsRemaining() {
        return this.maxlength - this.value.lenght;
      },
    },
    props: {
      type: String,
      autocomplete: String,
      max: Number,
      maxlength: Number,
      min: Number,
      minlength: Number,
      name: String,
      placeholder: String,
      readonly: Boolean,
      required: Boolean,
      spellcheck: Boolean,
      id: String,
      value: null,

      icon: String,
      valid: Boolean,
      charactercount: Boolean,
    }
  }
</script>

<style lang="scss" scoped>
div {
  position: relative;
}

input {
  width: 100%;
  border: var(--input-border-width) solid var(--lighter-gray);
  border-radius: var(--border-radius);
  color: var(--gray);
  padding: 10px;
  line-height: 1;
  transition: var(--fast) var(--transition);
  transition-property: color, border-color;

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
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover
  textarea:-webkit-autofill:focus {
    border: var(--input-border-width) solid var(--ligher-gray);
    background-color: var(--white);
    box-shadow: inset 0 0 0 2000px var(--white);
  }

}

.icon input {
  padding-left: 35px;
}

i {
  position: absolute;
  left: 10px;
  top: 50%;
  color: var(--light-gray);
  transform: translateY(-50%);
}
</style>
