<template>
  <div class="login-form">
    <form v-if="reset" @submit.prevent="resetPassword">
      <invisible-label html-for="email">{{ $t('email_address') }}</invisible-label>
      <v-input
        id="email"
        v-model="email"
        :placeholder="$t('email')"
        :disabled="exists !== true"
        icon-left="person"
        class="input"
        type="email"
        name="email" />

      <v-button
        :fullwidth="true"
        :loading="resetLoading"
        :disabled="resetButtonDisabled"
        type="submit">{{ $t('reset_password') }}</v-button>

      <button class="toggle-reset" @click.prevent="reset = false">{{ $t('login') }}</button>
    </form>
    <form v-else @submit.prevent="login">
      <div v-if="apiUrls.length === 0">
        <invisible-label html-for="url">{{ $t('api_url') }}</invisible-label>
        <v-input
          id="url"
          v-model="url"
          :placeholder="$t('api_url')"
          icon-left="cloud"
          type="url"
          name="url"
          class="input" />
      </div>

      <div>
        <v-select
          v-if="(apiUrls.length === 1 && allowOther === true) || apiUrls.length > 1"
          id="url"
          v-model="url"
          :placeholder="$t('api_url')"
          :other="allowOther"
          :options="apiConfig"
          :custom="allowOther"
          icon="cloud"
          class="input"
          type="url" />
      </div>

      <invisible-label html-for="email">{{ $t('email_address') }}</invisible-label>
      <v-input
        id="email"
        v-model="email"
        :placeholder="$t('email')"
        :disabled="exists !== true"
        icon-left="person"
        class="input"
        type="email"
        name="email" />

      <invisible-label html-for="password">{{ $t('password') }}</invisible-label>
      <v-input
        id="password"
        v-model="password"
        :placeholder="$t('password')"
        :disabled="exists !== true"
        icon-left="lock"
        type="password"
        name="password"
        class="input" />

      <v-button
        :fullwidth="true"
        :disabled="disabled"
        :loading="loading"
        type="submit">{{ $t('login') }}</v-button>

      <button class="toggle-reset" @click.prevent="reset = true">{{ $t('forgot_password') }}</button>
    </form>
    <nav>
      <transition-group
        name="list"
        class="third-party-auth"
        tag="ul">
        <li
          v-for="provider in thirdPartyAuthProviders"
          :key="provider.name">
          <a v-tooltip.bottom="$helpers.formatTitle(provider.name)" :href="url + '/_/auth/sso/' + provider.name">
            <img
              :alt="provider.name"
              :src="provider.icon">
          </a>
        </li>
      </transition-group>
    </nav>
  </div>
</template>

<script>
import sdk from "directus-sdk-javascript/remote";

export default {
  name: "login-form",
  data() {
    return {
      loading: false,
      exists: null,
      checkingExistence: false,
      thirdPartyAuthProviders: [],
      gettingThirdPartyAuthProviders: false,

      email: "",
      password: "",
      url: Object.keys(window.__DirectusConfig__.api)[0] || "", // eslint-disable-line

      reset: false,
      resetLoading: false
    };
  },
  computed: {
    disabled() {
      return !(this.email.length && this.password.length && this.url.length);
    },
    resetButtonDisabled() {
      return this.email.length === 0;
    },
    apiConfig() {
      return window.__DirectusConfig__.api; // eslint-disable-line
    },
    apiUrls() {
      return Object.values(this.apiConfig);
    },
    allowOther() {
      return window.__DirectusConfig__.allowOtherAPI; // eslint-disable-line
    }
  },
  watch: {
    url() {
      this.exists = null;
      this.checkUrl();
    },
    exists(newVal, oldVal) {
      if (newVal === true && newVal !== oldVal) {
        this.getThirdPartyAuthProviders();
      }
    },
    $route() {
      this.trySSOLogin();
    }
  },
  created() {
    this.checkUrl = this.$lodash.debounce(this.checkUrl, 300);

    if (this.url) {
      this.checkUrl();
    }

    this.trySSOLogin();
  },
  methods: {
    login() {
      const { email, password, url } = this;
      const credentials = { email, password, url };

      this.loading = true;
      this.$store
        .dispatch("login", credentials)
        .then(() => {
          this.enterApp();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    enterApp() {
      if (this.$route.query.redirect) {
        this.loading = false;
        return this.$router.push(this.$route.query.redirect);
      }

      this.$api
        .getMe({ fields: "last_page" })
        .then(res => res.data.last_page)
        .then(lastPage => {
          this.loading = false;
          this.$router.push(lastPage || "/");
        })
        .catch(err => {
          this.loading = false;
          console.error(err); // eslint-disable-line no-console
          this.$router.push("/");
        });
    },
    checkUrl() {
      if (!this.url) return;

      this.checkingExistence = true;
      this.exists = false;
      this.thirdPartyAuthProviders = [];

      const scopedAPI = new sdk();

      scopedAPI.url = this.url;

      scopedAPI
        .ping()
        .then(() => {
          this.exists = true;
        })
        .catch(() => {
          this.exists = false;
        })
        .finally(() => {
          this.checkingExistence = false;
        });
    },
    getThirdPartyAuthProviders() {
      this.gettingThirdPartyAuthProviders = true;
      this.thirdPartyAuthProviders = [];

      const scopedAPI = new sdk();

      scopedAPI.url = this.url;

      scopedAPI
        .getThirdPartyAuthProviders()
        .then(res => res.data)
        .then(thirdPartyAuthProviders => {
          this.thirdPartyAuthProviders = thirdPartyAuthProviders;
        })
        .catch(console.error)
        .finally(() => {
          this.gettingThirdPartyAuthProviders = false;
        });
    },
    resetPassword() {
      this.resetLoading = true;

      this.$api
        .request(
          "POST",
          "/auth/reset-request",
          {},
          {
            email: this.email
          }
        )
        .then(() => {
          this.resetLoading = false;
        })
        .catch(err => {
          alert(JSON.stringify(err, "    ", false));
        });
    },
    trySSOLogin() {
      /**
       * NOTE: The only reason this was implemented this way is due to the fact that the API doesn't return
       *   error codes yet for SSO errors. As soon as issue directus/api#126 has been fixed, we can
       *   use the "pretty" error notice instead
       */
      if (this.$route.query.error) {
        alert(this.$route.query.error);

        var uri = window.location.toString();
        if (uri.indexOf("?") > 0) {
          var clean_uri = uri.substring(0, uri.indexOf("?"));
          window.history.replaceState({}, document.title, clean_uri);
        }

        return null;
      }

      if (
        this.$route.query.request_token &&
        this.$route.query.request_token.length > 0
      ) {
        this.$store
          .dispatch("loginSSO", this.$route.query.request_token)
          .then(() => this.enterApp())
          .catch(console.error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.input {
  margin-bottom: 13px;
}

.third-party-auth {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 100%;
  margin-top: 10px;
  padding: 0;
  list-style: none;

  a {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--light-gray);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: var(--fast) var(--transition);

    img {
      width: 22px;
      height: 22px;
      object-fit: contain;
      filter: grayscale(100%) contrast(0) brightness(5);
    }

    &:hover,
    .user-is-tabbing &:focus {
      background-color: var(--gray);
    }
  }
}

.toggle-reset {
  text-align: center;
  width: 100%;
  margin: 20px 0 10px;
  color: var(--lighter-gray);
  transition: color var(--fast) var(--transition);

  &:hover {
    color: var(--dark-gray);
  }
}

.list-enter-active {
  transition: var(--medium) var(--transition-in);
}

.list-leave-active {
  transition: var(--fast) var(--transition-out);
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}
</style>
