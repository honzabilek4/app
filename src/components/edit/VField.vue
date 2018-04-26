<template>
  <div class="v-field">
    <fieldset v-if="fieldset">
      <div>
        <legend>{{ $t(`fields-${field.collection}-${field.field}`) }}</legend>
        <small v-if="field.comment">{{ field.comment }}</small>
        <interface-extension
          :id="field.interface"
          :name="field.field"
          :required="Boolean(field.required)"
          :options="field.options"
          :type="field.type"
          :value="values[field.field]"
          @input="$emit('stageValue', {
            field: field.field,
            value: $event
          })"
          @setfield="$emit('stageValue', {
            field: $event.field,
            value: $event.value,
          })"
        />
      </div>
    </fieldset>
    <p v-else>
      <label :for="field.field">{{ $t(`fields-${field.collection}-${field.field}`) }}</label>
      <small v-if="field.comment">{{ field.comment }}</small>
      <interface-extension
        :id="field.interface"
        :name="field.field"
        :required="Boolean(field.required)"
        :options="field.options"
        :type="field.type"
        :value="values[field.field]"
        @input="$emit('stageValue', {
          field: field.field,
          value: $event
        })"
        @setfield="$emit('stageValue', {
          field: $event.field,
          value: $event.value,
        })"
      />
    </p>
  </div>
</template>

<script>
export default {
  name: "v-field",
  props: {
    field: {
      type: Object,
      required: true
    },
    values: {
      type: Object,
      required: true
    }
  },
  computed: {
    fieldset() {
      const interfaceInfo = this.$store.state.extensions.interfaces.data[
        this.field.interface
      ];

      return (interfaceInfo && interfaceInfo.fieldset) || false;
    }
  }
};
</script>

<style lang="scss" scoped>
label,
legend {
  margin-bottom: 10px;
  text-transform: uppercase;
  color: var(--dark-gray);
  font-size: 0.85rem;
  line-height: 1.18;
  font-weight: 700;
}

fieldset,
p {
  border: 0;
  padding: 0;
}

fieldset > div,
p {
  display: flex;
  flex-direction: column;
}

small {
  order: 2;
  margin-top: 10px;
  font-style: italic;
  font-size: 12px;
  color: var(--gray);
}
</style>
