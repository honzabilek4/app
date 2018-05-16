<template>
  <form class="edit-form flex-group">
    <div
      v-for="field in fieldsGrouped"
      :class="[
        isGroup(field) ? null : `col-${field.view_width}`,
        isGroup(field) ? 'group' : 'field'
      ]"
      :key="field.field">
      <v-group
        v-if="isGroup(field)"
        :values="values"
        :field="field"
        :readonly="readonly"
        @stageValue="$emit('stageValue', $event)" />
      <v-field
        v-else
        :values="values"
        :field="field"
        :readonly="readonly"
        @stageValue="$emit('stageValue', $event)" />
    </div>
  </form>
</template>

<script>
import VField from "../components/edit/v-field.vue";
import VGroup from "../components/edit/v-group.vue";

export default {
  name: "edit-form",
  components: {
    VField,
    VGroup
  },
  props: {
    fields: {
      type: Object,
      required: true
    },
    values: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fieldsGrouped() {
      const fieldsArray = Object.values(this.fields);

      const result = fieldsArray
        .filter(field => field.type.toLowerCase() === "group")
        .map(group => ({
          ...group,
          children: []
        }));

      const nonGroupFields = fieldsArray.filter(
        field => field.type.toLowerCase() !== "group"
      );

      nonGroupFields.forEach(field => {
        if (field.group != null) {
          const groupIndex = this.$lodash.findIndex(
            result,
            group => group.id === field.group
          );
          return result[groupIndex].children.push(field);
        }

        return result.push(field);
      });

      return result.filter(field => field.hidden_input === false);
    }
  },
  methods: {
    isGroup(field) {
      return field.children && Array.isArray(field.children);
    }
  }
};
</script>

<style lang="scss">
.edit-form {
  max-width: 800px;

  @media (min-width: 800px) {
    &.flex-group,
    .flex-group {
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

  .field,
  .group {
    margin-bottom: 30px;
  }

  .group {
    flex-basis: 100%;
  }
}
</style>
