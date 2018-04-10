<template>
  <div class="settings-global">
    <portal to="header-title">
      <breadcrumb :links="links" />
    </portal>

    <edit-form
      v-if="!hydrating"
      :fields="fields"
      :values="settings"
      @stageValue="stageValue" />

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
  </div>
</template>

<script>
import EditForm from '../containers/EditForm.vue';

export default {
  name: 'settings-global',
  components: {
    EditForm,
  },
  data() {
    return {
      hydrating: false,
      saving: false,
      deleting: false,
      confirmNavigation: false,
      toPath: null,
      editing: false,
    };
  },
  computed: {
    settings() {
      return this.$store.state.settings.data;
    },
    links() {
      return [
        {
          name: this.$t('settings'),
          path: '/settings',
        },
        {
          name: this.$t('settings_global'),
          path: '/settings/global',
        },
      ];
    },
    fields() {
      return this.$store.state.fields.directus_settings &&
        this.$store.state.fields.directus_settings.data;
    },
  },
  created() {
    this.hydrate();
  },
  methods: {
    stageValue(field, value) {
      return value;
    },
    hydrate() {
      this.hydrating = true;

      Promise.all([
        this.$store.dispatch('getFields', 'directus_settings'),
        this.$store.dispatch('getSettings'),
      ])
        .then(() => {
          this.hydrating = false;
        })
        .catch(console.error);
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
};
</script>

<style lang="scss" scoped>
.settings-global {
  padding: 20px;
}
</style>
