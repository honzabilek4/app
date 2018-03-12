<template>
  <div>
    <blocker
      :z-index="15"
      :active="active"
      @click="$emit('toggleNav', false)"
    />
    <aside :class="{ active }">
      <button
        v-if="active"
        class="close"
        @click="$emit('toggleNav', false)">Close nav</button>
      <section class="logo">
        <img
          src="@/assets/logo.svg"
          alt="Directus Logo" >
      </section>
      <section
        :class="{userMenuActive: userMenuActive}"
        class="content"
      >
        <h3 class="style-4">{{ $t('collections') }}</h3>
        <nav>
          <ul>
            <li
              v-for="name in collectionNames"
              :key="name"
            >
              <router-link :to="`/collections/${name}`"><svg viewBox="0 0 15 16">
                <!-- eslint-disable max-len -->
                <path
                  d="M.422 12.598l6.773 3.114a.696.696 0 0 0 .61 0l6.771-3.114a.676.676 0 0 0 .424-.66V3.844a.726.726 0 0 0-.013-.13v-.039a.727.727 0 0 0-.029-.093l-.01-.03a.726.726 0 0 0-.059-.11l-.016-.023a.727.727 0 0 0-.064-.077l-.035-.023a.726.726 0 0 0-.08-.066l-.02-.014a.727.727 0 0 0-.098-.055L7.803.07a.696.696 0 0 0-.61 0L.423 3.184a.726.726 0 0 0-.098.055l-.02.014a.727.727 0 0 0-.08.066L.2 3.344a.727.727 0 0 0-.064.077l-.016.023a.726.726 0 0 0-.058.11l-.02.028a.727.727 0 0 0-.03.093v.038A.726.726 0 0 0 0 3.844v8.094c0 .31.14.53.422.66zm1.031-7.617l5.319 2.45v6.493l-5.319-2.451V4.98zm6.774 8.942V7.43l5.318-2.45v6.493l-5.318 2.449zM7.499 1.525l5.035 2.32-5.035 2.318-5.034-2.319 5.034-2.319z" />
                  <!-- eslint-enable max-len -->
              </svg>{{ $t(`cn-${name}`) }}</router-link>
            </li>
          </ul>
        </nav>
      </section>
      <section
        :class="{userMenuActive: userMenuActive}"
        class="user-menu"
        @mouseenter="toggleUserMenu(true)"
        @mouseleave="toggleUserMenu(false, 1000)"
      >
        <header>
          <button @click="toggleUserMenu()">
            <avatar
              :src="avatarURL"
              :alt="fullName"
              :indicator="true"
              class="avatar"
            />
            <span>{{ fullName }}</span>
            <i class="material-icons">more_vert</i>
          </button>
        </header>
        <div class="links">
          <nav>
            <ul>
              <li>
                <router-link to="/settings">
                  <i class="material-icons">settings</i>
                  {{ $t('admin_settings') }}
                </router-link>
              </li>
              <li>
                <a href="https://getdirectus.com">
                  <i class="material-icons">help</i>
                  {{ $t('help_and_docs') }}
                </a>
              </li>
            </ul>
          </nav>
          <nav>
            <ul>
              <li>
                <router-link to="/files">
                  <i class="material-icons">collections</i>
                  {{ $t('file_library') }}
                </router-link>
              </li>
              <li>
                <router-link to="/users">
                  <i class="material-icons">person</i>
                  {{ $t('user_directory') }}
                </router-link>
              </li>
            </ul>
          </nav>
          <nav>
            <ul>
              <li>
                <router-link to="/activity">
                  <i class="material-icons">notifications</i>
                  {{ $t('activity') }}
                </router-link>
              </li>
              <li>
                <router-link :to="`/users/${currentUserID}`">
                  <i class="material-icons">person</i>
                  {{ $t('my_profile') }}
                </router-link>
              </li>
              <li>
                <router-link to="/logout">
                  <i class="material-icons">exit_to_app</i>
                  {{ $t('sign_out') }}
                </router-link>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </aside>
  </div>
</template>

<script>
import createGravatarLink from '../helpers/gravatar';
import Blocker from '../components/Blocker.vue';

export default {
  components: {
    Blocker,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userMenuActive: false,
      timeout: null,
    };
  },
  computed: {
    collectionNames() {
      return this.$store.state.collections.data &&
        Object.keys(this.$store.state.collections.data);
    },
    avatarURL() {
      if (this.$store.state.me.avatar) {
        // TODO: This is basically pseudo code. Hasn't been tested yet
        const { url } = this.$store.state.auth;
        const { filename } = this.$store.state.me.data.avatar;
        return `${url}/${filename}`;
      }

      return createGravatarLink(this.email, 40);
    },
    email() {
      return this.$store.state.me.data &&
        this.$store.state.me.data.email;
    },
    fullName() {
      const firstName = this.$store.state.me.data &&
        this.$store.state.me.data.first_name;

      const lastName = this.$store.state.me.data &&
        this.$store.state.me.data.last_name;

      return `${firstName} ${lastName}`;
    },
    currentUserID() {
      return this.$store.state.me.data &&
       this.$store.state.me.data.id;
    },
  },
  methods: {
    toggleUserMenu(active = !this.userMenuActive, delay = false) {
      if (delay) {
        this.timeout = setTimeout(() => {
          this.userMenuActive = active;
        }, delay);
      } else {
        clearTimeout(this.timeout);
        this.userMenuActive = active;
      }
    },
    logout() {
      this.$store.dispatch('logout');
    },
  },
};
</script>

<style lang="scss" scoped>
aside {
  width: var(--nav-sidebar-width);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  transform: translateX(-100%);
  z-index: 15;
  transition: var(--slow) var(--transition-out);

  &.active {
    transform: translateX(0);
    transition: 200ms var(--transition-in);
  }

  & .close {
    position: absolute;
    z-index: 15;
    left: -999px;

    &:focus {
      top: 13px;
      left: 13px;
    }
  }

  @media (min-width: 50em) {
    transition: none;
    transform: translateX(0);

    .blocker, .close {
      display: none;
    }
  }
}

.logo {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary);
  height: var(--header-height);

  img {
    width: 66px;
  }
}

h3 {
  margin-bottom: 10px;
}

i, svg {
  vertical-align: -4px;
  display: inline-block;
  width: 15px;
  margin-right: 10px;
}

i {
  font-size: 18px;
  color: var(--light-gray);
}

svg {
  fill: var(--light-gray);
}

a {
  text-decoration: none;
  padding: 5px 0;
  display: block;
  position: relative;
}

a:hover,
.router-link-active {
  color: var(--primary);
  i, svg {
    color: var(--primary);
    fill: var(--primary);
  }
}

.router-link-active::before {
  content: '';
  position: absolute;
  height: 100%;
  width: 2px;
  background-color: var(--primary);
  left: -20px;
  top: 0;
}

ul {
  list-style: none;
  padding: 0;
}

nav:not(:last-of-type) {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--lighter-gray);
}

button {
  padding: 0;
  border: 0;
  border-radius: 0;
  background-color: transparent;
  color: inherit;
}

.content,
.user-menu {
  position: relative;
  background-color: var(--white);
  box-shadow: 1px 0 0 -0px var(--lightest-gray);
  padding: 20px;
}

.content {
  height: calc(100% - var(--header-height) - var(--header-height));
}

.user-menu {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  transform: translateY(calc(100% - var(--header-height) - 20px));
  transition: transform var(--medium) var(--transition-out);
  will-change: transform;

  &.userMenuActive,
  &:focus,
  &:focus-within {
    transform: translateY(0);
    transition: transform var(--slow) var(--transition-in);
  }

  header {
    position: relative;
    padding: 10px 0;
    border-top: 1px solid var(--lighter-gray);
    border-bottom: 1px solid var(--lighter-gray);
    margin-bottom: 10px;

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
    }
  }
}
</style>
