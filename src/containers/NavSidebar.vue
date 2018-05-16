<template>
  <transition name="nav">
    <aside class="nav-sidebar">
      <v-modal
        v-if="projectSwitcherActive"
        :title="$t('change_project')"
        @close="projectSwitcherActive = false">
        Project changer form
      </v-modal>

      <v-confirm
        v-if="signOutActive"
        :message="$t('sign_out_confirm')"
        :confirm-text="$t('sign_out')"
        @confirm="$router.push('/logout')"
        @cancel="signOutActive = false"/>

      <focus-lock :disabled="!overlay">
        <button
          v-if="$mq === 'small'"
          class="close"
          @click="$emit('toggleNav', false)">Close nav</button>
        <section class="logo">
          <transition name="fade">
            <img
              v-show="customLogo && customLogoLoaded"
              @load="customLogoLoaded = true"
              :src="customLogo"
              :alt="projectName">
          </transition>
          <transition name="fade">
            <img
              v-show="logoLoaded && !customLogoExists"
              @load="logoLoaded = true"
              src="../assets/logo.svg"
              alt="Directus Logo">
          </transition>
        </section>
        <section class="content">
          <button
            class="project-switcher"
            @click="projectSwitcherActive = true">
            <v-signal class="icon" />
            <span class="no-wrap">{{ $store.state.auth.projectName }}</span>
            <i class="material-icons chevron">arrow_drop_down</i>
          </button>
          <h3 class="style-4">{{ $t('collections') }}</h3>
          <nav>
            <ul>
              <li
                v-for="name in collectionNames"
                :key="name">
                <router-link :to="`/collections/${name}`"><svg
                  class="icon"
                  viewBox="0 0 15 16">
                  <!-- eslint-disable max-len -->
                  <path
                    d="M.422 12.598l6.773 3.114a.696.696 0 0 0 .61 0l6.771-3.114a.676.676 0 0 0 .424-.66V3.844a.726.726 0 0 0-.013-.13v-.039a.727.727 0 0 0-.029-.093l-.01-.03a.726.726 0 0 0-.059-.11l-.016-.023a.727.727 0 0 0-.064-.077l-.035-.023a.726.726 0 0 0-.08-.066l-.02-.014a.727.727 0 0 0-.098-.055L7.803.07a.696.696 0 0 0-.61 0L.423 3.184a.726.726 0 0 0-.098.055l-.02.014a.727.727 0 0 0-.08.066L.2 3.344a.727.727 0 0 0-.064.077l-.016.023a.726.726 0 0 0-.058.11l-.02.028a.727.727 0 0 0-.03.093v.038A.726.726 0 0 0 0 3.844v8.094c0 .31.14.53.422.66zm1.031-7.617l5.319 2.45v6.493l-5.319-2.451V4.98zm6.774 8.942V7.43l5.318-2.45v6.493l-5.318 2.449zM7.499 1.525l5.035 2.32-5.035 2.318-5.034-2.319 5.034-2.319z" />
                    <!-- eslint-enable max-len -->
                </svg>{{ $t(`collections-${name}`) }}</router-link>
              </li>
            </ul>
          </nav>
          <h3
            v-if="bookmarks && bookmarks.length > 0"
            class="style-4">{{ $t('bookmarks') }}</h3>
          <nav v-if="bookmarks && bookmarks.length > 0">
            <ul>
              <li
                v-for="bookmark in bookmarks"
                :key="bookmark.id"
                class="bookmark">
                <button
                  class="no-wrap"
                  @click="toBookmark(bookmark)">
                <i class="material-icons icon">bookmark_outline</i>{{ bookmark.title }}</button>
                <button v-tooltip="$t('delete_bookmark')" @click="deleteBookmark(bookmark.id)">
                  <i class="material-icons">remove_circle_outline</i>
                </button>
              </li>
            </ul>
          </nav>
        </section>
        <section class="user-menu">
          <header>
            <button @click="toggleUserMenu()">
              <v-avatar
                :src="avatarURL"
                :alt="fullName"
                :indicator="true"
                class="avatar" />
              <span>{{ fullName }}</span>
              <i class="material-icons">more_vert</i>
            </button>
          </header>
          <div class="links">
            <nav>
              <ul>
                <li class="warning">
                  <router-link to="/settings">
                    <i class="material-icons icon">settings</i>
                    {{ $t('admin_settings') }}
                  </router-link>
                </li>
                <li>
                  <a href="https://getdirectus.com">
                    <i class="material-icons icon">help</i>
                    {{ $t('help_and_docs') }}
                  </a>
                </li>
              </ul>
            </nav>
            <nav>
              <ul>
                <li>
                  <router-link to="/files">
                    <i class="material-icons icon">collections</i>
                    {{ $t('file_library') }}
                  </router-link>
                </li>
                <li>
                  <router-link to="/users">
                    <i class="material-icons icon">person</i>
                    {{ $t('user_directory') }}
                  </router-link>
                </li>
              </ul>
            </nav>
            <nav>
              <ul>
                <li>
                  <router-link to="/activity">
                    <i class="material-icons icon">notifications</i>
                    {{ $t('activity') }}
                  </router-link>
                </li>
                <li>
                  <router-link :to="`/users/${currentUserID}`">
                    <i class="material-icons icon">person</i>
                    {{ $t('my_profile') }}
                  </router-link>
                </li>
                <li>
                  <button @click="signOutActive = true">
                    <i class="material-icons icon">exit_to_app</i>
                    {{ $t('sign_out') }}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </section>
      </focus-lock>
    </aside>
  </transition>
</template>

<script>
import FocusLock from "vue-focus-lock";
import VSignal from "../components/v-signal.vue";

export default {
  name: "nav-sidebar",
  components: {
    FocusLock,
    VSignal
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      projectSwitcherActive: false,
      signOutActive: false,
      customLogo: null,
      customLogoLoaded: false,
      logoLoaded: false
    };
  },
  created() {
    const logoID = this.$store.state.settings.logo;

    if (logoID) {
      // NOTE: this should be handled by the API. directus/api#112
      this.$api
        .getItem("directus_files", logoID)
        .then(res => res.data.storage.full_url)
        .then(url => (this.customLogo = url))
        .catch(console.error);
    }
  },
  computed: {
    customLogoExists() {
      return Boolean(this.$store.state.settings.logo);
    },
    collectionNames() {
      const collections = this.$store.state.collections;

      if (collections == null) return [];

      return Object.values(collections)
        .filter(
          collection =>
            collection.hidden === 0 ||
            collection.hidden === "0" ||
            collection.hidden === false
        )
        .map(collection => collection.collection);
    },
    bookmarks() {
      return this.$store.state.bookmarks;
    },
    projectName() {
      return this.$store.state.auth.projectName;
    },
    avatarURL() {
      if (this.$store.state.currentUser.avatar) {
        // TODO: This is basically pseudo code. Hasn't been tested yet
        const { url } = this.$store.state.auth;
        const { filename } = this.$store.state.currentUser.avatar;
        return `${url}/${filename}`;
      }

      return this.$helpers.gravatar(this.email, { size: 40 });
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
    },
    currentUserID() {
      return this.$store.state.currentUser && this.$store.state.currentUser.id;
    },
    overlay() {
      return this.$mq === "small";
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
    deleteBookmark(id) {
      this.$store.dispatch("deleteBookmark", id);
    },
    toBookmark(bookmark) {
      /* eslint-disable camelcase */
      const {
        collection,
        search_query,
        filters,
        view_options,
        view_type,
        view_query
      } = bookmark;

      this.$store
        .dispatch("setListingPreferences", {
          collection,
          updates: {
            search_query,
            filters,
            view_options,
            view_type,
            view_query
          }
        })
        .then(() => {
          this.$router.push(`/collections/${collection}`);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
aside {
  width: var(--nav-sidebar-width);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 30;
  transition: var(--slow) var(--transition-out);

  > div {
    height: 100%;
  }

  & .close {
    position: absolute;
    z-index: 15;
    left: -999px;

    .user-is-tabbing &:focus {
      top: 13px;
      left: 13px;
    }
  }
}

.logo {
  position: relative;
  background-color: var(--accent);
  height: var(--header-height);
  padding: 10px;
  display: grid;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    grid-row: 1;
    grid-column: 1;
  }
}

h3 {
  margin-bottom: 5px;
  margin-top: 15px;
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

a {
  text-decoration: none;
  display: block;
  position: relative;
}

a,
i,
svg {
  transition: var(--fast) var(--transition);
}

a:hover,
.content .router-link-active,
.user-menu .router-link-exact-active,
.bookmark button:first-child:hover,
.user-menu button:hover {
  color: var(--accent);

  i,
  svg {
    color: var(--accent);
    fill: var(--accent);
  }

  &::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 3px;
    background-color: var(--accent);
    left: -20px;
    top: 0;
  }
}

ul {
  list-style: none;
  padding: 0;
}

nav > ul > li > * {
  padding: 5px 0;
}

nav:not(:last-child) {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--lightest-gray);
}

.content,
.user-menu {
  position: relative;
  background-color: var(--white);
  padding: 20px;
  padding-top: 0;
}

.user-menu {
  position: relative;
  max-height: 100vh;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.content {
  height: calc(100% - var(--header-height) - var(--header-height));
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.project-switcher {
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

.bookmark {
  display: flex;
  align-items: center;

  > * {
    display: block;
  }

  & button:first-child {
    flex-grow: 1;
    text-align: left;
  }

  & button:last-child {
    opacity: 0;
    transition: opacity var(--fast) var(--transition);

    i {
      font-size: 18px;
      vertical-align: baseline;
      color: var(--lighter-gray);
    }

    &:hover i {
      color: var(--danger);
    }
  }

  &:hover button:last-child {
    opacity: 1;
  }
}

.user-menu {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  transform: translateY(calc(100% - var(--header-height)));
  transition: transform var(--medium) var(--transition-out);
  will-change: transform;

  &:hover,
  .user-is-tabbing &:focus,
  .user-is-tabbing &:focus-within {
    transform: translateY(0);
    transition: transform var(--slow) var(--transition-in);
  }

  header {
    position: sticky;
    top: 0;
    background-color: var(--white);
    padding: 10px 0;
    border-top: 1px solid var(--lightest-gray);
    border-bottom: 1px solid var(--lightest-gray);
    margin-bottom: 10px;
    z-index: +1;

    .avatar {
      margin-right: 10px;
    }

    button {
      display: flex;
      align-items: center;
    }

    i {
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
}

.nav-enter-active {
  transition: var(--slow) var(--transition-in);
}

.nav-leave-active {
  transition: var(--medium) var(--transition-out);
}

.nav-enter,
.nav-leave-to {
  transform: translateX(-100%);
}

@media (min-width: 800px) {
  .nav-enter,
  .nav-leave-to {
    transform: translateX(0);
  }

  .content,
  .user-menu {
    box-shadow: 1px 0 0 -0px var(--lightest-gray);
  }
}

.fade-enter-active {
  transition: opacity var(--fast) var(--transition-in);
}

.fade-leave-active {
  transition: opacity var(--fast) var(--transition-out);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
