<template>
  <v-interface
    :id="field.field"
    :name="field.field"
    :options="field.options"
    :type="field.type"
    class="v-group">
    <div class="flex-group">
      <div
        v-for="child in field.children"
        :class="[
          isGroup(child) ? null : `col-${child.view_width}`,
          isGroup(child) ? 'group' : 'field'
        ]"
        :key="child.field">
        <v-group
          v-if="isGroup(child)"
          :values="values"
          :field="child"
          @stageValue="$emit('stageValue', $event)" />
        <v-field
          v-else
          :readonly="readonly"
          :values="values"
          :field="child"
          @stageValue="$emit('stageValue', $event)" />
      </div>
    </div>
  </v-interface>
</template>

<script>
import VField from "./field.vue";

export default {
  name: "v-group",
  components: {
    VField
  },
  props: {
    values: {
      type: Object,
      required: true
    },
    field: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    isGroup(field) {
      return field.children && Array.isArray(field.children);
    }
  }
};
</script>
