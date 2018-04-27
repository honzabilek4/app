<template>
  <div
    :class="{ icon }"
    class="v-select">
    <select
      v-if="other"
      :id="otherActive ? null : id"
      :value="value"
      @change="change($event.target.value)">
      <optgroup :label="$t('values')">
        <option
          v-for="(key, value) in parsedOptions"
          :key="key"
          :value="value"
        >{{ key }}</option>
      </optgroup>
      <optgroup :label="$t('other')">
        <option
          :value="customValue || '__other'"
          :selected="otherActive"
        >{{ customValue.length ? customValue : $t('enter_value') }}</option>
      </optgroup>
    </select>
    <select
      v-else
      ref="select"
      :id="otherActive ? null : id"
      :value="value"
      @change="change($event.target.value)">
      <option
        ref="default"
        selected
        disabled
        value="">
        {{ placeholder }}
      </option>
      <option
        v-for="(key, optionValue) in parsedOptions"
        :key="key"
        :value="optionValue"
      >{{ key }}</option>
    </select>
    <input
      v-if="otherActive"
      ref="input"
      :type="type"
      :value="customValue"
      :id="id"
      :placeholder="placeholder"
      autofocus
      @input="changeCustom">
    <div class="value">
      <i
        v-if="icon"
        class="material-icons">{{ icon }}</i>
      <span
        v-if="placeholder && !value"
        class="placeholder">{{ placeholder }}</span>
      {{ parsedOptions[value] }}
    </div>
    <i class="material-icons chevron">arrow_drop_down</i>
  </div>
</template>

<script>
export default {
  name: "v-select",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },

    other: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    options: {
      type: [Object, String],
      required: true
    },
    placeholder: {
      type: String,
      default: ""
    },

    defaultValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      otherActive: false,
      customValue: ""
    };
  },
  computed: {
    parsedOptions() {
      if (typeof this.options === "string") {
        return JSON.parse(this.options);
      }

      return this.options;
    }
  },
  methods: {
    change(value) {
      if (value === this.customValue || value === "__other") {
        this.$emit("input", this.customValue);
        this.otherActive = true;
        return;
      }

      this.otherActive = false;
      this.$emit("input", value);

      if (this.defaultValue === true) {
        this.$refs.default.setAttribute("selected", "selected");
        this.$refs.select.value = "";
      }
    },
    changeCustom(event) {
      this.customValue = event.target.value;
      this.$emit("input", this.customValue);
    }
  }
};
</script>

<style lang="scss" scoped>
.v-select {
  position: relative;
  margin: 10px 0;

  select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .value,
  input {
    background-color: var(--white);
    height: var(--input-height);
    border: var(--input-border-width) solid var(--lighter-gray);
    transition: var(--fast) var(--transition);
    transition-property: color, border-color;
  }

  .value {
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

    &::placeholder {
      color: var(--light-gray);
    }

    &:-webkit-autofill {
      box-shadow: inset 0 0 0 1000px var(--white) !important;
    }
  }

  select:focus ~ div,
  select:focus ~ input,
  input:focus + div,
  input:focus {
    color: var(--darker-gray);
    border-color: var(--accent);
    outline: 0;
  }

  i {
    position: absolute;
    left: 10px;
    top: 50%;
    color: var(--light-gray);
    transform: translateY(-50%);
    font-size: 18px;
  }

  i.chevron {
    left: auto;
    pointer-events: none;
    right: 10px;
  }

  &.icon {
    .value {
      padding-left: 33px;
    }

    input {
      width: calc(100% - 35px - 40px);
      left: 35px;
    }

    select:focus ~ div i,
    input:focus + div i,
    input:focus i {
      color: var(--accent);
    }
  }

  .placeholder {
    color: var(--light-gray);
  }
}
</style>
