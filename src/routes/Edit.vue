<template>
  <div class="edit">
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
      Edit stuff
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
        class="field"
      >
        <label :for="field.field">{{ $t(`fn-${field.field}`) }}</label>
        <component
          :is="`${$helpers.prefixes.interface}-${field.interface}`"
          :name="field.field"
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
  },
};
</script>

<style scoped>
.edit {
  padding: 30px 20px;
}

.field:not(:first-of-type) {
  margin: 30px 0;
}
</style>
