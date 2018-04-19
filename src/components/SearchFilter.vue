<template>
  <div
    :class="{ full, open }"
    class="search-filter">
    <header-button
      v-if="!full"
      :seek-attention="hasFilters"
      icon="filter_list"
      @click="open = !open">Filter</header-button>

    <div
      v-if="full"
      class="wrapper">
      <i class="material-icons">search</i>
      <input
        :placeholder="placeholder"
        :value="searchQuery"
        :class="{ 'has-filters': hasFilters }"
        class="search"
        type="search"
        @input="search($event.target.value)">
      <transition name="fade">
        <button
          v-show="hasFilters"
          :class="{ 'has-filters': hasFilters }"
          class="clear-filters"
          @click="clearFilters">
          <i class="material-icons">close</i>
        </button>
      </transition>
      <button
        :class="{ 'has-filters': hasFilters }"
        class="toggle"
        @click="open = !open"><i class="material-icons">filter_list</i></button>
    </div>

    <transition name="slide">
      <div
        v-show="open"
        class="dropdown">
        <div
          v-if="!full"
          class="field">
          <v-input
            :placeholder="placeholder"
            :value="searchQuery"
            type="search"
            icon-left="search"
            @input="search" />
        </div>

        <div
          v-for="(filter, i) in filters"
          :key="i"
          class="field">
          <invisible-label :html-for="`filter-${i}`">
            {{ fields[filter.field] }} {{ operators[filter.operator] }}
          </invisible-label>
          <div class="name">
            <p>{{ fields[filter.field] }}</p>
            <span>
              {{ $t(operators[filter.operator]) }}
              <i class="material-icons">arrow_drop_down</i>
              <select @change="updateFilter(i, 'operator', $event.target.value)">
                <option
                  v-for="(name, operator) in operators"
                  :key="operator"
                  :value="operator">{{ $t(name) }}</option>
              </select>
            </span>
            <button
              class="remove"
              @click="deleteFilter(i)">{{ $t('remove') }}</button>
          </div>
          <v-input
            :id="`filter-${i}`"
            type="text"
            @input="updateFilter(i, 'value', $event)" />
        </div>

        <div class="field">
          <invisible-label html-for="add">{{ $t('add_field_filter') }}</invisible-label>
          <v-select
            id="add"
            :placeholder="$t('add_field_filter')"
            :options="fields"
            default-value
            @input="addFilter" />
        </div>
      </div>
    </transition>

    <v-blocker
      v-if="!full && open"
      :z-index="18"
      class="blocker"
      @click="open = !open" />
  </div>
</template>

<script>
import VBlocker from './VBlocker.vue';

export default {
  name: 'search-filter',
  components: {
    VBlocker,
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
    placeholder: {
      type: String,
      default: () => this.$t('search'),
    },
  },
  data() {
    return {
      open: false,
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
    hasFilters() {
      if (
        (this.filters && this.filters.length > 0) ||
        this.searchQuery
      ) return true;

      return false;
    },
    full() {
      return this.$mq === 'extraLarge';
    },
  },
  created() {
    this.search = this.$lodash.debounce(this.search, 300);
    this.updateFilter = this.$lodash.debounce(this.updateFilter, 300);
  },
  methods: {
    search(value) {
      this.$emit('search', value);
    },
    addFilter(field) {
      this.$emit('filter', [
        ...this.filters,
        {
          field,
          operator: 'eq',
          value: '',
        },
      ]);
    },
    updateFilter(index, key, value) {
      const filters = this.$lodash.cloneDeep(this.filters);
      filters[index][key] = value;

      this.$emit('filter', filters);
    },
    deleteFilter(index) {
      const filters = this.$lodash.cloneDeep(this.filters);
      filters.splice(index, 1);

      this.$emit('filter', filters);
    },
    clearFilters() {
      this.$emit('clearFilters');
      if (this.open) this.open = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: absolute;
  top: var(--header-height);
  background-color: white;
  width: 100%;
  left: 0;
  z-index: 19;
  padding: 20px;
  color: var(--darkest-gray);
  transform-origin: top;
  box-shadow: var(--box-shadow);
}

.blocker {
  top: var(--header-height) !important;
}

.field:not(:last-child) {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--lighter-gray);

  .name {
    display: flex;
    align-items: center;
    font-size: 11px;
    text-transform: uppercase;
    margin-bottom: 5px;
    color: var(--dark-gray);
    font-weight: 700;

    span {
      position: relative;
      color: var(--primary);
      margin-left: 5px;
      padding-right: 2em;
      flex-grow: 1;
      display: flex;
      align-items: center;

      select {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: +1;
        opacity: 0;
        cursor: pointer;
      }

      i {
        width: 1px; /* Hack to make sure the span text has enough room */
      }
    }

    .remove {
      text-transform: uppercase;
      opacity: 0;
      transition: var(--fast) var(--transition);
      transition-property: color, opacity;
      color: var(--gray);

      &:hover, .user-is-tabbing &:focus {
        color: var(--danger);
        opacity: 1;
      }
    }
  }

  &:hover, .user-is-tabbing:focus, .user-is-tabbing:focus-within {
    .remove {
      opacity: 1;
    }
  }
}

.slide-enter-active {
  transition: var(--medium) var(--transition-in);
}

.slide-leave-active {
  transition: var(--fast) var(--transition-out);
}

.slide-enter, .slide-leave-to {
  transform: scaleY(0);
  opacity: 0;
}

.search-filter.full {
  margin-right: 10px;
  position: relative;

  .search {
    width: 300px;
    height: var(--input-height);
    border-radius: var(--border-radius);
    display: block;
    border: 0;
    color: var(--gray);
    padding: 10px;
    line-height: 1.5;
    transition: var(--fast) var(--transition);
    transition-property: color, border-color, padding;
    height: var(--input-height);
    padding-left: 40px;
    padding-right: 40px;

    &::placeholder {
      color: var(--light-gray);
    }

    &:focus {
      color: var(--darker-gray);
      border-color: var(--primary);
      outline: 0;
    }

    &:focus + i {
      color: var(--primary);
    }

    &:-webkit-autofill {
      color: var(--dark-gray) !important;
      -webkit-text-fill-color: var(--dark-gray) !important;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      background-color: var(--white);
      box-shadow: inset 0 0 0 2000px var(--white);
    }

    &.has-filters {
      padding-right: 73px;
    }
  }

  .wrapper {
    position: relative;

    > i, > button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      user-select: none;
    }

    > i {
      color: var(--lighter-gray);
      left: 10px;
    }

    button i {
      transition: color var(--fast) var(--transition);
    }

    .toggle {
      right: 10px;
      color: var(--gray);

      &:hover, .user-is-tabbing &:focus {
        color: var(--primary);
      }
    }

    .clear-filters {
      right: 40px;
      color: var(--gray);

      &:hover, .user-is-tabbing &:focus {
        color: var(--danger);
      }
    }
  }

  .dropdown {
    top: auto;
  }

  &.open {
    .toggle {
      i {
        color: var(--primary);
      }
    }

    .search {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}

.fade-enter-active {
  transition: var(--medium) var(--transition-in);
}

.fade-leave-active {
  transition: var(--fast) var(--transition-out);
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
