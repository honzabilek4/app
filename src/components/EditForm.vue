<template>
  <form
    class="edit-form"
    @submit.prevent="$emit('sumbmit', $event)">
    <div
      v-for="field in fields"
      :key="field.field"
      :class="`col-${field.view_width}`"
      class="field">
      <label :for="field.field">{{ $t(`fn-${field.field}`) }}</label>
      <component
        :is="`${$helpers.prefixes.interface}-${field.interface}`"
        :name="field.field"
        :required="Boolean(field.required)"
        :_options="field.options"
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
import { registerInterface } from '../helpers/register-extension';

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
  },
  created() {
    this.$lodash
      .uniq(this.$lodash.map(this.fields, info => info.interface))
      .forEach(registerInterface);
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
