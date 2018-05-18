<template>
  <component
    :is="componentName"
    :name="name"
    :value="value"
    :type="type"
    :length="length"
    :readonly="readonly"
    :required="required"
    :loading="loading"
    :options="optionsWithDefaults"
    class="v-readonly" />
</template>

<script>
import Vue from "vue";
import loadExtension from "../../../helpers/load-extension";
import componentExists from "../../../helpers/component-exists";
import VReadonlyFallback from "./readonly-fallback.vue";
import VReadonlyLoading from "./readonly-loading.vue";

export default {
  name: "v-readonly",
  props: {
    interface: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: null,
      default: null
    },
    type: {
      type: String,
      required: true
    },
    length: {
      type: [String, Number],
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
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
    }
  },
  computed: {
    interfaces() {
      return this.$store.state.extensions.interfaces;
    },
    interfaceInfo() {
      return this.interfaces && this.interfaces[this.interface];
    },
    componentName() {
      return `readonly-${this.interface}`;
    },
    optionsWithDefaults() {
      if (!this.interfaceInfo) return {};

      const defaults = this.$lodash.mapValues(
        this.interfaceInfo.options,
        settings => settings.default || null
      );

      return {
        ...defaults,
        ...this.options
      };
    }
  },
  watch: {
    id() {
      this.registerReadonly();
    }
  },
  created() {
    this.registerReadonly();
  },
  methods: {
    /**
     * Register the extension as component (if it hasn't been registered before yet)
     */
    registerReadonly() {
      // If component already exists, do nothing
      if (componentExists(this.componentName)) return;

      // If the extension isn't known by the API (e.g. it's not in the store), register it with the
      //   fallback immediately
      if (!this.interfaceInfo) {
        Vue.component(this.componentName, VReadonlyFallback);
        return;
      }

      const filePath = `${this.$api.url}/${this.interfaceInfo.path.replace(
        "meta.json",
        "Readonly.js"
      )}`;

      Vue.component(this.componentName, () => ({
        component: loadExtension(filePath),
        error: VReadonlyFallback,
        loading: VReadonlyLoading
      }));
    }
  }
};
</script>
