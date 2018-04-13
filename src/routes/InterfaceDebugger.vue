<template>
  <div class="interface-debugger">
    <portal to="header-title">
      <h1 class="style-1"><breadcrumb :links="links" /></h1>
    </portal>

    <div
      :style="{ width: width + 'px' }"
      class="box">
      <interface-extension
        v-model="value"
        :id="id"
        :name="id"
        :type="type"
        :length="length"
        :readonly="readonly"
        :required="required"
        :loading="loading"
        :options="options"
        :new-item="newItem" />
    </div>

    <v-input
      v-model="value"
      type="text" />

    <div
      :style="{ width: width + 'px' }"
      class="box">
      <readonly-extension
        v-model="value"
        :id="id"
        :name="id"
        :type="type"
        :length="length"
        :readonly="readonly"
        :required="required"
        :loading="loading"
        :options="options" />
    </div>

    <form @submit.prevent>
      <fieldset>
        <legend>Settings</legend>

        <label for="type">Type</label>
        <select
          id="type"
          v-model="type">
          <option
            v-for="(length, type) in extension.dataTypes"
            :key="type"
            :value="type"
          >{{ type }}</option>
        </select>

        <label for="length">Length</label>
        <input
          id="length"
          v-model="length"
          type="number"
          min="0">

        <label for="readonly">Read only</label>
        <input
          id="readonly"
          v-model="readonly"
          type="checkbox">


        <label for="required">Required</label>
        <input
          id="required"
          v-model="required"
          type="checkbox">

        <label for="loading">Loading</label>
        <input
          id="loading"
          v-model="loading"
          type="checkbox">
      </fieldset>
      <fieldset>
        <legend>Options</legend>
        <div
          v-for="(option, optionID) in extension.options"
          :key="optionID">
          <label :for="optionID">{{ option.name }}</label>
          <p>{{ option.comment }}</p>
          <interface-extension
            v-model="options[optionID]"
            :id="option.interface"
            :name="optionID"
            :type="option.type"
            :length="option.length"
            :readonly="option.readonly"
            :required="option.required"
            :loading="option.loading"
            :options="option.options" />
        </div>
      </fieldset>
      <fieldset>
        <legend>Misc.</legend>

        <label for="new">New item</label>
        <input
          id="new"
          v-model="newItem"
          type="checkbox">

        <label for="width">Responsiveness tester</label>
        <input
          id="width"
          v-model="width"
          min="50"
          max="1000"
          step="1"
          type="range">
        <span>{{ width }}px</span>
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  name: 'interface-debugger',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      type: null,
      length: null,
      value: null,
      readonly: false,
      required: false,
      loading: false,
      options: {},
      width: 200,
      newItem: false,
    };
  },
  computed: {
    links() {
      return [
        {
          name: 'Interfaces',
          path: '/interfaces',
        },
        {
          name: this.extension.name,
          path: `/interfaces/${this.id}`,
        },
      ];
    },
    extension() {
      return this.$store.state.extensions.interfaces.data[this.id];
    },
  },
  watch: {
    id() {
      this.hydrate();
    },
    type() {
      this.length = this.extension.dataTypes[this.type];
    },
  },
  created() {
    this.hydrate();
  },
  methods: {
    hydrate() {
      // Set type to the first datatype available in the meta info
      this.type = Object.keys(this.extension.dataTypes)[0];

      // Populate the options with the default values
      const defaults = this.$lodash.mapValues(
        this.extension.options,
        settings => settings.default || null,
      );
      this.options = defaults;
    },
  },
};
</script>

<style scoped>
.interface-debugger {
  padding: 10px;
}

.box {
  border: 1px solid var(--lighter-gray);
  padding: 10px;
  margin-bottom: 20px;
}

output {
  background-color: white;
  padding: 10px;
  margin: 10px 0;
  font-family: monospace;
  display: block;
}
</style>
