<template>
  <div class="edit">
    <loader
      v-if="hydrating"
      area="content"
    />

    <portal to="header-title">
      <h1 class="style-1"><breadcrumb :links="breadcrumb" /></h1>
    </portal>

    <portal to="header-buttons">
      <header-button
        v-if="!newItem"
        icon="close"
        bg="danger"
        @click="removeModalActive = true">{{ $t('delete') }}</header-button>
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
        @input="saveSpecial">{{ $t('save') }}</header-button>
    </portal>

    <portal to="info-sidebar">
      <activity-overview
        :collection="collection"
        :primary-key="primaryKey"
      />
    </portal>

    <v-modal
      v-if="removeModalActive"
      :title="$t('delete_confirmation')"
      :ok="$t('delete')"
      :loading="deleting"
      ok-bg="danger"
      @confirm="remove"
      @close="removeModalActive = false">
      <p>
        {{ $t('delete_are_you_sure') }}
      </p>
    </v-modal>

    <v-modal
      v-if="confirmNavigation"
      :action-required="true"
      :title="$t('unsaved_changes')">
      <p>
        {{ $t('navigate_changes') }}
      </p>
      <template slot="footer">
        <v-button
          bg="danger"
          @click="discardChanges">{{ $t('discard_changes') }}</v-button>
        <v-button @click="confirmNavigation = false">{{ $t('keep_editing') }}</v-button>
      </template>
    </v-modal>

    <edit-form
      v-if="!hydrating"
      :fields="fields"
      :values="values"
      :collection="collection"
      @stageValue="stageValue" />
  </div>
</template>

<script>
import EditForm from "../containers/EditForm.vue";
import ActivityOverview from "../containers/ActivityOverview.vue";

export default {
  name: "edit",
  components: {
    EditForm,
    ActivityOverview
  },
  props: {
    collection: {
      type: String,
      required: true
    },
    primaryKey: {
      type: null,
      required: true
    }
  },
  data() {
    return {
      hydrating: false,
      saving: false,
      deleting: false,
      removeModalActive: false,
      confirmNavigation: false,
      toPath: null
    };
  },
  computed: {
    breadcrumb() {
      if (this.collection.startsWith("directus_")) {
        return [
          {
            name: this.$t(`collections-${this.collection}`),
            path: `/${this.collection.substring(9)}`
          },
          {
            name: this.$t("editing_item"),
            path: this.$route.path
          }
        ];
      }

      return [
        {
          name: this.$t("collections"),
          path: "/collections"
        },
        {
          name: this.$t(`collections-${this.collection}`),
          path: `/collections/${this.collection}`
        },
        {
          name: this.$t("editing_item"),
          path: this.$route.path
        }
      ];
    },
    fields() {
      const stateFields =
        (this.$store.state.fields &&
          this.$store.state.fields[this.collection] &&
          this.$store.state.fields[this.collection].data) ||
        {};

      return this.$lodash.keyBy(
        Object.values(stateFields)
          .filter(field => {
            if (field.interface === "primary-key") return true;

            if (field.hidden_list === true || field.hidden_list === 1) {
              return false;
            }

            return true;
          })
          .map(field => ({
            ...field,
            name: this.$t(`fields-${this.collection}-${field.field}`)
          })),
        "field"
      );
    },
    values() {
      const edits = this.$store.state.edits.values;
      return {
        ...(this.savedValues || {}),
        ...edits
      };
    },
    editing() {
      return this.$store.getters.editing;
    },
    savedValues() {
      return this.$store.state.edits.savedValues;
    },
    newItem() {
      return this.primaryKey === "+";
    },
    primaryKeyField() {
      return this.$lodash.find(this.fields, { interface: "primary-key" }).field;
    }
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
    }
  },
  created() {
    this.hydrate();
  },
  methods: {
    hydrate() {
      this.hydrating = true;

      Promise.all([
        this.$store.dispatch("getFields", this.collection),
        this.newItem
          ? null
          : this.$api.getItem(this.collection, this.primaryKey)
      ])
        .then(values => {
          const savedValues = this.newItem ? {} : values[1];

          this.hydrating = false;

          this.$store.dispatch("startEditing", {
            collection: this.collection,
            primaryKey: this.primaryKey,
            savedValues: savedValues.data || {}
          });
        })
        .catch(console.error);
    },
    stageValue({ field, value }) {
      this.$store.dispatch("stageValue", { field, value });
    },
    remove() {
      this.deleting = true;
      this.$api
        .deleteItem(this.collection, this.primaryKey)
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
      this.$store
        .dispatch("save")
        .then(() => {
          this.saving = false;
          this.hydrate();
        })
        .catch(console.error);
    },
    saveAndLeave() {
      this.saving = true;
      this.$store
        .dispatch("save")
        .then(() => {
          this.saving = false;
        })
        .then(() => {
          if (this.collection.startsWith("directus_")) {
            return this.$router.push(`/${this.collection.substring(9)}`);
          }

          return this.$router.push(`/collections/${this.collection}`);
        })
        .catch(console.error);
    },
    saveAndAdd() {
      this.saving = true;
      this.$store
        .dispatch("save")
        .then(() => {
          this.saving = false;
        })
        .then(() => {
          if (this.collection.startsWith("directus_")) {
            return this.$router.push(`/${this.collection.substring(9)}/+`);
          }

          return this.$router.push(`/collections/${this.collection}/+`);
        })
        .catch(console.error);
    },
    saveAsCopy() {
      this.saving = true;
      this.$store
        .dispatch("save", {
          primaryKey: "+",
          values: this.values
        })
        .then(res => {
          this.saving = false;
          return res.data[this.primaryKeyField];
        })
        .then(pk => {
          if (this.collection.startsWith("directus_")) {
            return this.$router.push(`/${this.collection.substring(9)}/${pk}`);
          }

          return this.$router.push(`/collections/${this.collection}/${pk}`);
        })
        .catch(console.error);
    },
    discardChanges() {
      this.confirmNavigation = false;
      this.$store.dispatch("discardChanges");
      this.$router.push({
        path: this.toPath
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.edit {
  padding: var(--page-padding);
  padding-bottom: var(--page-padding-bottom);
  position: relative;
  width: 100%;
}
</style>
