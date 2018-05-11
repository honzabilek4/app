<template>
  <div class="interface-debugger">
    <portal to="header-title">
      <h1 class="style-1"><breadcrumb :links="links" /></h1>
    </portal>

    <div
      :style="{ width: width + 'px' }"
      class="interface">
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

    <form @submit.prevent>
      <fieldset>
        <legend>Output</legend>

        <label for="value">Value</label>
        <v-input
          v-model="value"
          id="value"
          type="text"
          class="value" />

        <label>Listing</label>
        <div class="listing">
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
      </fieldset>
      <fieldset>
        <legend>Settings</legend>

        <div class="settings">
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
        </div>

        <div class="settings">
          <label for="length">Length</label>
          <v-input
            id="length"
            v-model="length"
            type="number"
            class="length"
            :min="0" />
        </div>

        <div class="settings">
          <v-checkbox
            id="readonly"
            v-model="readonly"
            value="readonly"
            class="checkbox"
            type="checkbox" /> <label for="readonly" class="inline">Read only</label>
        </div>

        <div class="settings">
          <v-checkbox
            id="required"
            v-model="required"
            value="required"
            class="checkbox"
            type="checkbox" /> <label for="required" class="inline">Required</label>
        </div>

        <div class="settings">
          <v-checkbox
            id="loading"
            v-model="loading"
            value="loading"
            class="checkbox"
            type="checkbox" /> <label for="loading" class="inline">Loading</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Options</legend>
        <div
          v-for="(option, optionID) in extension.options"
          class="options"
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

        <div class="misc">
          <v-checkbox
            id="new"
            v-model="newItem"
            value="newItem"
            class="checkbox"
            type="checkbox" /> <label for="new" class="inline">New item</label>
        </div>

        <div class="misc">
          <label for="width">Responsiveness tester</label>
          <input
            id="width"
            v-model="width"
            min="50"
            max="1000"
            step="1"
            type="range">
          <span>{{ width }}px</span>
      </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  name: "interface-debugger",
  props: {
    id: {
      type: String,
      required: true
    }
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
      width: 1000,
      newItem: false
    };
  },
  computed: {
    links() {
      return [
        {
          name: "Interfaces",
          path: "/interfaces"
        },
        {
          name: this.extension.name,
          path: `/interfaces/${this.id}`
        }
      ];
    },
    extension() {
      return this.$store.state.extensions.interfaces[this.id];
    }
  },
  watch: {
    id() {
      this.hydrate();
    },
    type() {
      this.length = this.extension.dataTypes[this.type];
    }
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
        settings => settings.default || null
      );
      this.options = defaults;
    }
  }
};
</script>

<style scoped lang="scss">
.interface-debugger {
  padding: var(--page-padding);
}

.checkbox {
  width: auto;
  display: inline-block;
  vertical-align: middle;
  padding-right: 5px;
}

.interface {
  margin-bottom: 40px;
  max-width: 100%;
}

.value {
  margin-bottom: 20px;
  max-width: 400px;
}

.listing {
  margin-bottom: 40px;
  max-width: 100%;
}

.length {
  max-width: 100px;
}

.inline {
  display: inline-block;
}

label {
  margin-bottom: 5px;
  width: max-content;
}

fieldset {
  border-top: 1px solid var(--lighter-gray);
  padding: 10px 0 20px;

  legend {
    padding: 10px;
    text-align: center;
  }

  p {
    color: var(--light-gray);
    padding-bottom: 10px;
    font-style: italic;
  }

  .settings,
  .options,
  .misc {
    margin-bottom: 40px;
  }
}

output {
  background-color: white;
  padding: 10px;
  margin: 10px 0;
  font-family: monospace;
  display: block;
}
</style>
