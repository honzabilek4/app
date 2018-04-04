<template>
  <form
    class="edit-form"
    @submit.prevent="$emit('sumbmit', $event)">
    <div
      v-for="field in fields"
      :key="field.field"
      :class="`col-${field.view_width}`"
      class="field">
      <label :for="field.field">{{ $t(`fields-${collection}-${field.field}`) }}</label>
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
      />
    </div>
  </form>
</template>

<script>

export default {
  name: 'edit-form',
  props: {
    fields: {
      type: Object,
      required: true,
    },
    values: {
      type: Object,
      required: true,
    },
    collection: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.field {
  margin: 15px 0;
}

.field:first-of-type {
  margin-top: 0;
}

label {
  margin-bottom: 10px;
}

@media (min-width: 800px) {
  form {
    display: flex;
    flex-wrap: wrap;

    & > * {
      flex-shrink: 0;
      flex-basis: 0;
    }
  }

  .col-1 {
    flex-basis: 25%;
  }

  .col-2 {
    flex-basis: 50%;
  }

  .col-3 {
    flex-basis: 75%;
  }

  .col-4 {
    flex-basis: 100%;
  }
}
</style>
