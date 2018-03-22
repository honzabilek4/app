<template>
  <div class="v-table">
    <div class="toolbar">
      <div
        v-if="selectable"
        class="select cell">
        <form-checkbox
          id="select-all"
          :checked="allSelected"
          name="select-all"
          value="all"
          @change="selectAll" />
      </div>
      <div
        v-for="{field, name} in columns"
        :key="field"
        class="cell">

        <button
          v-if="sortable"
          :class="{ active: sortVal.field === field }"
          class="sort style-4"
          @click="updateSort(field)">
          {{ name }}
          <i
            v-if="sortVal.field === field"
            class="material-icons">
            {{ sortVal.asc ? 'arrow_downward' : 'arrow_upward' }}
          </i>
        </button>

        <span
          v-else
          class="style-4">{{ name }}</span>

      </div>
    </div>
    <div class="body">

      <loader
        v-if="loading"
        :delay="100"
        :spinner-delay="50"
        transparent />

      <transition-group
        v-if="link"
        name="row">
        <div
          v-for="row in items"
          :key="row[primaryKeyField]"
          :style="{ height: rowHeight + 'px' }"
          class="link row"
          tabindex="0"
          role="link"
          @click.stop="$router.push(row[link])"
          @keyup.enter.stop="$router.push(row[link])">
          <div
            v-if="selectable"
            class="cell select"
            @click.stop>
            <form-checkbox
              :id="'check-' + row[primaryKeyField]"
              :value="row[primaryKeyField]"
              :checked="selection.includes(row[primaryKeyField])"
              @change="toggleCheckbox(row[primaryKeyField])" />
          </div>
          <div
            v-for="{field} in columns"
            :key="field"
            class="cell">{{ row[field] }}</div>
        </div>
      </transition-group>

      <transition-group
        v-else
        name="row">
        <div
          v-for="row in items"
          :key="row[primaryKeyField]"
          :style="{ height: rowHeight + 'px' }"
          class="row">
          <div
            v-if="selectable"
            class="select"
            @click.stop>
            <form-checkbox
              :id="'check-' + i"
              :value="row[primaryKeyField]"
              :checked="selection.includes(row[primaryKeyField])"
              @change="toggleCheckbox(row[primaryKeyField])" />
          </div>
          <div
            v-for="{field, name} in columns"
            :key="name"
            class="cell">{{ row[name] }}</div>
        </div>
      </transition-group>

    </div>
  </div>
</template>

<script>
export default {
  name: 'v-table',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    link: {
      type: String,
      default: null,
    },
    selection: {
      type: Array,
      default: null,
    },
    sortVal: {
      type: Object,
      default: null,
    },
    primaryKeyField: {
      type: String,
      required: true,
    },
    rowHeight: {
      type: Number,
      default: 40,
    },
  },
  computed: {
    allSelected() {
      const primaryKeyFields = this.items.map(item => item[this.primaryKeyField]).sort();
      const selection = [...this.selection];
      selection.sort();
      return this.selection.length > 0 && this.$lodash.isEqual(primaryKeyFields, selection);
    },
    selectable() {
      return Array.isArray(this.selection);
    },
    sortable() {
      return this.$lodash.isObject(this.sortVal);
    },
  },
  methods: {
    selectAll() {
      if (this.allSelected) {
        return this.$emit('select', []);
      }

      const primaryKeyFields = this.items.map(item => item[this.primaryKeyField]);
      return this.$emit('select', primaryKeyFields);
    },
    updateSort(field) {
      const newSortVal = {
        field,
        asc: field === this.sortVal.field ? !this.sortVal.asc : 'ASC',
      };
      this.$emit('sort', newSortVal);
    },
    toggleCheckbox(primaryKeyField) {
      const selection = [...this.selection];

      if (this.selection.includes(primaryKeyField)) {
        selection.splice(selection.indexOf(primaryKeyField), 1);
      } else {
        selection.push(primaryKeyField);
      }

      this.$emit('select', selection);
    },
  },
};
</script>

<style scoped>
.body {
  position: relative;
}

.toolbar,
.row {
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--lighter-gray);
  background-color: var(--white);
}

.toolbar {
  position: sticky;
  top: var(--header-height);
  height: var(--header-height);
}

.row {
  opacity: 1;
}

.row.link:hover {
  background-color: #f5fafd;
  cursor: pointer;
}

.sort.active {
  color: var(--gray);
}

.cell {
  flex-basis: 100px;
  flex-grow: 1;
  flex-shrink: 0;
  padding: 0 10px;
}

.toolbar .cell:not(.select) {
  height: 100%;
  display: flex;
  align-items: center;
}

.sort {
  width: 100%;
  height: 100%;
  text-align: left;
}

.sort > i {
  font-size: 12px;
  vertical-align: -1px;
}

.select {
  flex-basis: 30px;
}

.row-move {
  transition: var(--slow) var(--transition);
}

.row-enter-active {
  transition: var(--slow) var(--transition-in);
}

.row-leave-active {
  transition: var(--slow) var(--transition-out);
  position: absolute;
  width: 100%;
  z-index: 0;
}

.row-enter, .row-leave-to {
  opacity: 0;
}
</style>
