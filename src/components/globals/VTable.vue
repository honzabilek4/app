<template>
  <div
    :style="{ minWidth: totalWidth + 'px' }"
    class="v-table">
    <div class="toolbar">
      <div
        v-if="selectable"
        class="select cell">
        <v-checkbox
          id="select-all"
          :checked="allSelected"
          name="select-all"
          value="all"
          @change="selectAll" />
      </div>
      <div
        v-for="{field, name} in columns"
        :key="field"
        :style="{
          flexBasis: widths && widths[field] ?
            widths[field] + 'px' :
            null
        }"
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

        <div
          v-if="resizeable"
          class="drag-handle"
          draggable
          @drag="drag(field, $event)"
          @dragstart="hideDragImage"
          @dragend="lastDragXPosition = 0">
          <div class="drag-handle-line" />
        </div>

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
            <v-checkbox
              :id="'check-' + row[primaryKeyField]"
              :value="row[primaryKeyField]"
              :checked="selection.includes(row[primaryKeyField])"
              @change="toggleCheckbox(row[primaryKeyField])" />
          </div>
          <div
            v-for="{field, fieldInfo} in columns"
            :key="field"
            :style="{
              flexBasis: widths && widths[field] ?
                widths[field] + 'px' :
                null
            }"
            class="cell">
            <div
              v-if="$lodash.isNil(row[field])"
              class="empty">--</div>
            <readonly-extension
              v-else-if="useInterfaces && !$lodash.isNil(row[field])"
              :id="fieldInfo.interface"
              :name="field"
              :type="fieldInfo.type"
              :value="row[field]" />
            <template v-else>{{ row[field] }}</template>
          </div>
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
            <v-checkbox
              :id="'check-' + row[primaryKeyField]"
              :value="row[primaryKeyField]"
              :checked="selection.includes(row[primaryKeyField])"
              @change="toggleCheckbox(row[primaryKeyField])" />
          </div>
          <div
            v-for="{field} in columns"
            :key="field"
            :style="{
              flexBasis: widths && widths[field] ?
                widths[field] + 'px' :
                null
            }"
            class="cell">{{ row[field] }}</div>
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
    columnWidths: {
      type: Object,
      default: null,
    },
    useInterfaces: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      widths: {},
      lastDragXPosition: null,
    };
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
    resizeable() {
      return this.$lodash.isObject(this.columnWidths);
    },
    totalWidth() {
      return Object.keys(this.widths)
        .map(field => this.widths[field])
        .reduce((acc, val) => acc + val) + 30 + 40;
    },
  },
  watch: {
    widths: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.$lodash.isEmpty(oldVal)) return;
        this.emitWidths();
      },
    },
  },
  created() {
    this.drag = this.$lodash.throttle(this.drag, 20);
    this.emitWidths = this.$lodash.debounce(this.emitWidths, 100);

    const widths = {};
    this.columns.forEach(({ field }) => {
      widths[field] = 200;
    });

    this.widths = {
      ...widths,
      ...this.columnWidths,
    };
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
    drag(field, event) {
      const { screenX } = event;

      if (screenX !== 0 && this.lastDragXPosition) {
        const delta = screenX - this.lastDragXPosition;
        const newPos = this.widths[field] + delta;
        this.widths[field] = newPos;
      }

      this.lastDragXPosition = screenX;
    },
    hideDragImage(event) {
      const img = document.createElement('img');
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      event.dataTransfer.setDragImage(img, 0, 0);
      event.dataTransfer.effectAllowed = 'move';
    },
    emitWidths() {
      this.$emit('widths', this.widths);
    },
  },
};
</script>

<style scoped>
.v-table {
  width: 100%;
}

.body {
  position: relative;
}

.toolbar,
.row {
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--lighter-gray);
}

.toolbar {
  position: sticky;
  height: var(--header-height);
  left: 0;
  top: 0;
  z-index: +1;
  background-color: var(--white);
}

.drag-handle {
  width: 8px;
  height: 100%;
  cursor: col-resize;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 10px;
  opacity: 0;
  transition: opacity var(--fast) var(--transition-out);
}

.drag-handle-line {
  background-color: var(--lighter-gray);
  width: 1px;
  height: 60%;
}

.toolbar:hover .drag-handle {
  opacity: 1;
  transition: opacity var(--medium) var(--transition-in);
}

.row {
  opacity: 1;
  background-color: var(--white);
}

.row.link:hover {
  background-color: #f5fafd;
  cursor: pointer;
}

.sort.active {
  color: var(--gray);
}

.cell {
  flex-shrink: 0;
  flex-basis: 200px;
  padding-right: 20px;
  position: relative;
  overflow: hidden;
}

.cell:not(.select) {
  /* Visually align values with rows */
  transform: translateY(-1px);
}

.cell:last-of-type {
  flex-grow: 1;
}

.empty {
  color: var(--lighter-gray);
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
  transition: color var(--fast) var(--transition);
}

.sort:hover {
  color: var(--gray);
}

.sort > i {
  font-size: 12px;
  vertical-align: -1px;
}

.select {
  flex-basis: 30px;
  padding-right: 20px;
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
