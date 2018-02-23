<template>
  <div :class="{ icon }">
    <select
      :id="otherActive ? null : id"
      @change="change($event.target.value)"
      :value="value"
      v-if="other"
    >
      <optgroup :label="$t('values')">
        <option :value="value" v-for="(key, value) in options">
          {{ key }}
        </option>
      </optgroup>
      <optgroup :label="$t('other')">
        <option
          :value="customValue || '__other'"
          :selected="otherActive"
        >
          {{ customValue.length ? customValue : $t('enter_value') }}
        </option>
      </optgroup>
    </select>
    <select
      :id="otherActive ? null : id"
      @change="change($event.target.value)"
      :value="value"
      v-else
    >
      <option :value="value" v-for="(key, value) in options">
        {{ key }}
      </option>
    </select>
    <input
      v-if="otherActive"
      :type="type"
      :value="customValue"
      @input="changeCustom"
      :id="id"
      autofocus
      ref="input"
    />
    <div>
      <i v-if="icon" class="material-icons">{{ icon }}</i>
      {{ options[value] }}
    </div>
    <i class="material-icons chevron">arrow_drop_down</i>
  </div>
</template>

<script>
  export default {
    props: {
      disabled: Boolean,
      name: String,
      id: String,
      required: Boolean,
      value: String,

      other: Boolean,
      icon: String,
      type: String,
      options: Object,
    },
    data() {
      return {
        otherActive: false,
        customValue: '',
      };
    },
    methods: {
      change(value) {
        if (value === this.customValue || value === '__other') {
          this.$emit('input', this.customValue);
          this.otherActive = true;
          return;
        }

        this.otherActive = false;
        this.$emit('input', value);
      },
      changeCustom(event) {
        this.customValue = event.target.value;
        this.$emit('input', this.customValue);
      },
    },
  }
</script>

<style lang="scss" scoped>
div {
  position: relative;

  select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  & > div, input {
    background-color: var(--white);
    height: var(--input-height);
    border: var(--input-border-width) solid var(--lighter-gray);
    transition: var(--fast) var(--transition);
  }

  & > div {
    z-index: -1;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: var(--border-radius);
    position: relative;
  }

  input {
    position: absolute;
    left: 0;
    height: 100%;
    top: 0;
    width: calc(100% - 40px);
    border-left: 0;
    border-right: 0;
  }

  select:focus ~ div,
  select:focus ~ input,
  input:focus + div,
  input:focus {
    color: var(--darker-gray);
    border-color: var(--primary);
    outline: 0;
  }

  i {
    position: absolute;
    left: 10px;
    top: 50%;
    color: var(--light-gray);
    transform: translateY(-50%);
  }

  i.chevron {
    left: auto;
    pointer-events: none;
    right: 10px;
  }

  .icon {
    & > div {
      padding-left: 35px;
    }

    input {
      width: calc(100% - 35px - 40px);
      left: 35px;
    }

    select:focus ~ div i,
    input:focus + div i,
    input:focus i {
      color: var(--primary);
    }
  }
}
</style>
