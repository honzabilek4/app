<template>
  <div
    class="edit"
  >
    <loader v-if="hydrating" />

    <portal to="header-title">
      <breadcrumb
        :links="[
          {
            name: $t('collections'),
            path: '/collections',
          },
          {
            name: $t(`cn-${collection}`),
            path: `/collections/${collection}`,
          },
          {
            name: $t('editing_item'),
            path: $route.path,
          }
        ]"
      />
    </portal>

    <portal to="header-buttons">
      <header-button
        v-if="!newItem"
        icon="close"
        bg="danger"
        @click="removeModalActive = true"
      >{{ $t('delete') }}</header-button>
      <header-button
        :disabled="!editing"
        :loading="saving"
        :options="{
          saveAndStay: $t('save_and_stay'),
          saveAndAdd: $t('save_and_add'),
          saveAsCopy: $t('save_as_copy'),
        }"
        icon="check"
        bg="primary"
        @click="saveAndLeave"
        @input="saveSpecial"
      >{{ $t('save') }}</header-button>
    </portal>

    <portal to="info-sidebar">
      <div class="tabs">
        <button
          :class="{active: activityShow === 'both'}"
          @click="activityShow = 'both'"
        >{{ $t('both') }}</button>
        <button
          :class="{active: activityShow === 'comments'}"
          @click="activityShow = 'comments'"
        >{{ $t('comments') }}</button>
        <button
          :class="{active: activityShow === 'activity'}"
          @click="activityShow = 'activity'"
        >{{ $t('activity') }}</button>
      </div>
      <div class="activity">
        <article
          v-for="item in activity"
          :key="item.id"
        >
          <i
            v-if="item.message"
            class="material-icons"
          >message</i>
          <span
            v-else
            :title="item.action"
            :class="item.action"
            class="indicator"
          />
          <details>
            <summary>
              {{ item.name }}
              <span>•</span>
              <timeago
                :since="item.date"
                :locale="$i18n.locale"
                class="date" />
            </summary>
            <p>
              {{ item }}
            </p>
          </details>
        </article>
      </div>
    </portal>

    <modal
      v-if="removeModalActive"
      :title="$t('delete_confirmation')"
      :ok="$t('delete')"
      :loading="deleting"
      ok-bg="danger"
      @confirm="remove"
      @close="removeModalActive = false"
    >
      <p>
        {{ $t('delete_are_you_sure') }}
      </p>
    </modal>

    <modal
      v-if="confirmNavigation"
      :action-required="true"
      :title="$t('unsaved_changes')"
    >
      <p>
        {{ $t('navigate_changes') }}
      </p>
      <template slot="footer">
        <form-button
          bg="danger"
          @click="discardChanges"
        >{{ $t('discard_changes') }}</form-button>
        <form-button
          @click="keepEditing"
        >{{ $t('keep_editing') }}</form-button>
      </template>
    </modal>

    <form
      v-if="!hydrating"
      @submit.prevent
    >
      <div
        v-for="field in fields"
        :key="field.field"
        :class="`col-${field.view_width}`"
        class="field"
      >
        <label :for="field.field">{{ $t(`fn-${field.field}`) }}</label>
        <component
          :is="`${$helpers.prefixes.interface}-${field.interface}`"
          :name="field.field"
          :required="Boolean(field.required)"
          :_options="field.options"
          :value="values[field.field]"
          @input="stageValue(field.field, $event)"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { registerInterface } from '../helpers/register-extension';

export default {
  name: 'Edit',
  props: {
    collection: {
      type: String,
      required: true,
    },
    primaryKey: {
      type: null,
      required: true,
    },
  },
  data() {
    return {
      error: null,
      saving: false,
      hydrating: false,
      removeModalActive: false,
      deleting: false,
      confirmNavigation: false,
      toPath: null,
      activityShow: 'both',
      activityRaw: [],
      activityError: null,
      activityLoading: false,
    };
  },
  computed: {
    fields() {
      return this.$store.state.fields &&
        this.$store.state.fields[this.collection] &&
        this.$store.state.fields[this.collection].data;
    },
    values() {
      const edits = this.$store.state.edits.values;
      return {
        ...this.savedValues || {},
        ...edits,
      };
    },
    editing() {
      return this.$store.getters.editing;
    },
    savedValues() {
      return this.$store.state.edits.savedValues;
    },
    newItem() {
      return this.primaryKey === '+';
    },
    primaryKeyField() {
      return this.$lodash.find(
        this.fields,
        { interface: 'primary-key' },
      ).field;
    },
    activity() {
      switch (this.activityShow) {
        case 'comments':
          return this.activityRaw.filter(item => item.message !== null);
        case 'activity':
          return this.activityRaw.filter(item => item.message === null);
        case 'both':
        default:
          return this.activityRaw;
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.editing) {
      this.confirmNavigation = true;
      this.toPath = to.fullPath;
      return next(false);
    }
    return next();
  },
  watch: {
    $route() {
      this.hydrate();
    },
  },
  created() {
    this.hydrate();
  },
  methods: {
    hydrate() {
      this.hydrating = true;

      this.getActivity();

      Promise.all([
        this.$store.dispatch('getFields', this.collection),
        this.newItem ? null : this.$api.getItem(this.collection, this.primaryKey),
      ])
        .then((values) => {
          const savedValues = this.newItem ? {} : values[1];

          this.$lodash
            .uniq(this.$lodash.map(this.fields, info => info.interface))
            .forEach(registerInterface);

          this.hydrating = false;

          this.$store.dispatch('startEditing', {
            collection: this.collection,
            primaryKey: this.primaryKey,
            savedValues: savedValues.data || {},
          });
        })
        .catch(console.error);
    },
    stageValue(field, value) {
      this.$store.dispatch('stageValue', { field, value });
    },
    remove() {
      this.deleting = true;
      this.$api.deleteItem(this.collection, this.primaryKey)
        .then(() => {
          this.deleting = false;
          this.$router.push(`/collections/${this.collection}`);
        })
        .catch(console.error);
    },
    saveSpecial(method) {
      this[method]();
    },
    saveAndStay() {
      this.saving = true;
      this.$store.dispatch('save')
        .then(() => {
          this.saving = false;
          this.hydrate();
        })
        .catch(console.error);
    },
    saveAndLeave() {
      this.saving = true;
      this.$store.dispatch('save')
        .then(() => {
          this.saving = false;
        })
        .then(() => this.$router.push(`/collections/${this.collection}`))
        .catch(console.error);
    },
    saveAndAdd() {
      this.saving = true;
      this.$store.dispatch('save')
        .then(() => {
          this.saving = false;
        })
        .then(() => this.$router.push(`/collections/${this.collection}/+`))
        .catch(console.error);
    },
    saveAsCopy() {
      this.saving = true;
      this.$store.dispatch('save', {
        primaryKey: '+',
        values: this.values,
      })
        .then((res) => {
          this.saving = false;
          return res.data[this.primaryKeyField];
        })
        .then(pk => this.$router.push(`/collections/${this.collection}/${pk}`))
        .catch(console.error);
    },
    keepEditing() {
      this.confirmNavigation = false;
    },
    discardChanges() {
      this.confirmNavigation = false;
      this.$store.dispatch('discardChanges');
      this.$router.push({
        path: this.toPath,
      });
    },
    getActivity() {
      const formatItem = (item) => {
        const date = this.$helpers.date.sqlToDate(item.datetime);
        const name = `${item.user.first_name} ${item.user.last_name}`;
        return {
          date,
          name,
          action: item.action.toLowerCase(),
          message: item.message,
        };
      };

      this.activityLoading = true;

      this.$api.getActivity({
        'filter[collection][eq]': this.collection,
        'filter[item][eq]': this.primaryKey,
        fields: 'action,datetime,message,user.first_name,user.last_name',
        sort: '-datetime',
      })
        .then(res => res.data)
        .then(data => data.map(formatItem))
        .then((data) => {
          this.activityError = null;
          this.activityRaw = data;
          this.activityLoading = false;
        })
        .catch(console.error);
    },
  },
};
</script>

<style lang="scss" scoped>
.edit {
  padding: 30px 20px;
  position: relative;
  height: 100%;
  width: 100%;
}

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

/* Sidebar */
.tabs {
  margin: -20px -20px 20px;
  display: flex;
  height: 50px;

  button {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    flex-basis: 20px;
    position: relative;
    border-bottom: 1px solid var(--lightest-gray);
    overflow: visible;

    &::after {
      content: '';
      display: block;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--primary);
      position: absolute;
      transform: scaleY(0);
      transition: transform var(--fast) var(--transition-out);
      transform-origin: center;
    }

    &.active {
      border-color: var(--primary);
    }

    &.active::after {
      transition: transform var(--fast) var(--transition-in);
      transform: scaleY(1);
    }
  }
}

.activity {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 6px;
    height: 100%;
    width: 1px;
    background-color: var(--lightest-gray);
    z-index: -1;
  }

  .indicator {
    position: relative;
    top: 1px;
    display: inline-block;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 2px solid;
    background-color: var(--white);
    box-shadow: 0 0 0 5px var(--white);
    flex-shrink: 0;

    &.update { border-color: var(--primary) }
    &.delete { border-color: var(--danger) }
    &.create { border-color: var(--success) }
  }

  article {
    display: flex;
    margin-bottom: 40px;
  }

  details {
    margin-left: 10px;

    summary {
      cursor: pointer;
      list-style-type: none;

      &::-webkit-details-marker {
        display: none;
      }

      span, .date {
        color: var(--light-gray);
      }

      span {
        margin: 0 5px;
      }
    }

    > *:not(:first-child) {
      margin-top: 10px;
    }
  }
}

</style>
