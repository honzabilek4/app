<template>
  <div class="user-menu">
    <header>
      <v-avatar
        :src="avatarURL"
        :alt="fullName"
        :indicator="true"
        class="avatar" />
      <span class="no-wrap">{{ fullName }}</span>
      <i class="material-icons">more_vert</i>
    </header>
    <div class="links">
      <nav-menu
        :links="[
          { path: '/settings', name: $t('admin_settings'), icon: 'settings', color: 'warning' },
          { path: 'https://getdirectus.com', name: $t('help_and_docs'), icon: 'help' }
      ]" />

      <nav-menu
        :links="[
          { path: '/files', name: $t('file_library'), icon: 'collections' },
          { path: '/users', name: $t('user_directory'), icon: 'person' }
      ]" />

      <nav-menu
        :links="[
          { path: '/activity', name: $t('activity'), icon: 'notifications' },
          { path: `/users/${currentUserID}`, name: $t('my_profile'), icon: 'person' }
      ]" />

      <button
        class="sign-out"
        @click="signOutActive = true">
        <i class="material-icons icon">exit_to_app</i>
        {{ $t('sign_out') }}
      </button>
    </div>
  </div>
</template>

<script>
import NavMenu from "./nav-menu.vue";

export default {
  name: "user-menu",
  components: {
    NavMenu
  },
  computed: {
    avatarURL() {
      if (this.$store.state.currentUser.avatar) {
        // TODO: This is basically pseudo code. Hasn't been tested yet
        const { url } = this.$store.state.auth;
        const { filename } = this.$store.state.currentUser.avatar;
        return `${url}/${filename}`;
      }

      return this.$helpers.gravatar(this.email, { size: 40, default: 404 });
    },
    currentUserID() {
      return this.$store.state.currentUser && this.$store.state.currentUser.id;
    },
    email() {
      return (
        this.$store.state.currentUser && this.$store.state.currentUser.email
      );
    },
    fullName() {
      const firstName =
        this.$store.state.currentUser &&
        this.$store.state.currentUser.first_name;

      const lastName =
        this.$store.state.currentUser &&
        this.$store.state.currentUser.last_name;

      return `${firstName} ${lastName}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.user-menu {
  padding: 0 20px 20px;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  transform: translateY(calc(100% - var(--header-height)));
  transition: transform var(--medium) var(--transition-out);
  will-change: transform;

  @media (min-width: 800px) {
    box-shadow: 1px 0 0 0 var(--lightest-gray);
  }

  &:hover,
  &:focus,
  &:focus-within {
    transform: translateY(0);
    transition: transform var(--slow) var(--transition-in);
  }

  header {
    position: sticky;
    top: 0;
    background-color: var(--white);
    padding: 10px 10px 10px 0;
    border-top: 1px solid var(--lightest-gray);
    border-bottom: 1px solid var(--lightest-gray);
    margin-bottom: 10px;
    z-index: +1;
    display: flex;
    align-items: center;

    .avatar {
      margin-right: 10px;
      flex-shrink: 0;
    }

    > i {
      position: absolute;
      right: -10px;
      color: inherit;
    }
  }
  .warning {
    a,
    i {
      color: var(--warning);
    }
  }

  .warning:hover {
    a,
    i {
      color: var(--warning-dark);
    }
  }

  .icon {
    font-size: 18px;
    width: 15px;
    height: 18px;
    margin-right: 10px;
    color: var(--light-gray);
    fill: var(--light-gray);

    /* Forces left-alignment of material-icons */
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    vertical-align: -5px;
  }

  .sign-out:hover,
  .user-is-tabbing .sign-out:focus {
    color: var(--accent);

    .icon {
      color: currentColor;
      fill: currentColor;
    }
  }
}
</style>
