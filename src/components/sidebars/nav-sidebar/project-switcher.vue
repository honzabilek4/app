<template>
  <div class="project-switcher">
    <v-modal
      v-if="active"
      :title="$t('change_project')"
      @close="active = false">
      <login-form />
    </v-modal>
    <button
      @click="active = true">
      <v-signal class="icon" />
      <span class="no-wrap">{{ $store.state.auth.projectName }}</span>
      <i class="material-icons chevron">arrow_drop_down</i>
    </button>
  </div>
</template>

<script>
import VSignal from "../../signal.vue";
import LoginForm from "../../login-form/login-form.vue";

export default {
  name: "project-switcher",
  components: {
    VSignal,
    LoginForm
  },
  data() {
    return {
      active: false
    };
  }
};
</script>

<style lang="scss" scoped>
.project-switcher button {
  height: var(--header-height);
  width: 100%;
  border-bottom: 1px solid var(--lightest-gray);
  display: flex;
  align-items: center;
  color: var(--accent);
  margin-bottom: 10px;

  svg {
    fill: var(--accent);
  }

  i {
    color: var(--accent);
  }

  span {
    flex-grow: 1;
    line-height: 24px;
    text-align: left;
  }
}

.icon {
  width: 15px;
  height: 18px;
  margin-right: 10px;
  color: var(--light-gray);
  fill: var(--light-gray);
}
</style>
