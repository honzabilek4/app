<template>
  <div
    :class="{ active }"
    class="search-filter">
    <div class="search">
      <invisible-label html-for="search">{{ $t('search') }}</invisible-label>
      <i class="material-icons">search</i>
      <input
        id="search"
        :placeholder="$t('search')"
        :value="searchQuery"
        type="text"
        name="search"
        @input="searchInput">
      <button @click="toggleForm($event.target.value)">
        <i class="material-icons">filter_list</i>
      </button>
    </div>
    <form
      v-if="active"
      @submit.prevent>
      <fieldset
        v-for="(filter, index) in filters"
        :key="index">
        <div>
          <label>
            {{ $t('field') }}
            <select
              :value="filter.field"
              @change="updateFilter(index, 'field', $event.target.value)">
              <option
                disabled
                selected>{{ $t('choose_one') }}</option>
              <option
                v-for="(key, value) in fields"
                :value="value"
                :key="key">{{ key }}</option>
            </select>
          </label>
          <label>
            {{ $t('operator') }}
            <select
              :value="filter.operator"
              @change="updateFilter(index, 'operator', $event.target.value)">
              <option
                disabled
                selected>{{ $t('choose_one') }}</option>
              <option
                v-for="(key, value) in operators"
                :key="key"
                :value="value">
                {{ $t(key) }}
              </option>
            </select>
          </label>
          <label>
            {{ $t('value') }}
            <input
              :value="filter.value"
              type="text"
              @input="updateFilter(index, 'value', $event.target.value)">
          </label>
          <button @click="deleteFilter(index)">Delete</button>
        </div>
      </fieldset>
      <button @click="addNew">{{ $t('add_new') }}</button>
    </form>
  </div>
</template>

<script>
import InvisibleLabel from '../components/form/InvisibleLabel.vue';

export default {
  name: 'search-filter',
  components: {
    InvisibleLabel,
  },
  props: {
    fields: {
      type: Object,
      default: () => ({}),
    },
    filters: {
      type: Array,
      default: () => ([]),
    },
    searchQuery: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      active: false,
    };
  },
  computed: {
    operators() {
      return {
        eq: 'equal_to',
        neq: 'not_equal_to',
        lt: 'less_than',
        lte: 'less_than_equal',
        gt: 'greater_than',
        gte: 'greater_than_equal',
        in: 'in_list',
        nin: 'not_in_list',
        null: 'is_null',
        nnull: 'is_not_null',
        contains: 'contains',
        ncontains: 'not_contains',
        between: 'between',
        nbetween: 'not_between',
        empty: 'is_empty',
        nempty: 'not_empty',
        has: 'related_entries',
        nhas: 'no_related_entries',
      };
    },
  },
  created() {
    this.searchInput = this.$lodash.debounce(this.searchInput, 300);
  },
  methods: {
    searchInput(event) {
      this.$emit('search', event.target.value);
    },
    addNew() {
      this.$emit('filter', [
        ...this.filters,
        {
          field: '',
          operator: '',
          value: '',
        },
      ]);
    },
    updateFilter(index, field, value) {
      const filters = this.$lodash.cloneDeep(this.filters);
      filters[index][field] = value;

      this.$emit('filter', filters);
    },
    deleteFilter(index) {
      const filters = this.$lodash.cloneDeep(this.filters);
      filters.splice(index, 1);

      this.$emit('filter', filters);
    },
    toggleForm() {
      this.active = !this.active;
    },
  },
};
</script>

<style scoped>
.search-filter {
  color: var(--darkest-gray);
  flex-basis: 300px;
  position: relative;
}

i {
  color: var(--gray);
  position: relative;
  z-index: 10;
}

.search {
  position: relative;
  width: 100%;
}

.search input {
  height: var(--input-height);
  border-radius: var(--border-radius);
  border: none;
  width: 100%;
  z-index: 5;
  position: relative;
  padding-left: 40px;
}

.active .search input {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.search > i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.search button {
  position: absolute;
  right: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: transparent;
  border-radius: 0;
  top: 0;
}

form {
  position: absolute;
  background-color: white;
  border-top: 1px solid var(--light-gray);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
  right: 0;
  width: 100%;
}

fieldset {
  border: 0;
}

form input, form select {
  display: block;
}
</style>
