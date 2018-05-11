<template>
  <div class="settings">
    <portal to="header-title"><h1 class="style-1"><breadcrumb :links="links" /></h1></portal>

    <v-details
      :title="$t('settings_interface')"
      type="break"
      open>

      <nav>
        <ul>
          <v-card
            :title="$t('settings_global')"
            :subtitle="$tc('item_count', globalNum, { count: globalNum })"
            element="li"
            to="/settings/global"
            icon="public" />

          <v-card
            :title="$t('settings_collections_fields')"
            :subtitle="$tc('collection_count', collectionsNum, { count: collectionsNum })"
            element="li"
            to="/settings/collections">
            <img
              slot="icon"
              src="../assets/icons/box.svg"
              alt="">
          </v-card>

          <v-card
            :title="$t('settings_permissions')"
            element="li"
            to="/settings/permissions"
            icon="group" />

          <v-card
            :title="$t('settings_extensions')"
            element="li"
            to="/settings/extensions"
            icon="extension" />
        </ul>
      </nav>
    </v-details>

    <v-details
      :title="$t('additional_info')"
      type="break"
      open>
      <nav>
        <ul>
          <v-card
            :title="$t('about_directus')"
            :subtitle="$t('learn_more')"
            element="li"
            href="https://getdirectus.com"
            icon="info_outline" />

          <v-card
            :title="$t('activity_log')"
            element="li"
            to="/settings/activity"
            icon="warning" />

          <v-card
            :title="$t('connection')"
            element="li"
            to="/settings/connection">
            <v-signal
              slot="icon"
              class="signal" />
          </v-card>

          <v-card
            :title="$t('server_details')"
            :subtitle="projectName"
            element="li"
            to="/settings/server"
            icon="storage" />

          <v-card
            :title="$t('version_and_updates')"
            :subtitle="version"
            element="li"
            to="/settings/updates"
            icon="update" />
        </ul>
      </nav>
    </v-details>
  </div>
</template>

<script>
import { version } from "../../package.json";
import VSignal from "../components/VSignal.vue";

export default {
  name: "settings",
  components: {
    VSignal
  },
  computed: {
    globalNum() {
      return Object.keys(this.$store.state.settings).length;
    },
    collectionsNum() {
      return Object.keys(this.$store.state.collections).length;
    },
    projectName() {
      return this.$store.state.auth.projectName;
    },
    version() {
      return version;
    },
    links() {
      return [
        {
          name: this.$t("settings"),
          path: "/settings",
          color: "warning"
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.settings {
  padding: var(--page-padding);
}

nav ul {
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-gap: 20px;

  li {
    display: block;
  }
}

.signal {
  fill: var(--white);
}
</style>
