<template>
  <div class="login">
    <login-form
      :loading="loading"
      class="form"
      @submit="login" />
    <transition name="slide">
      <div
        v-if="error"
        :class="errorType"
        class="notice">
        <i class="material-icons">{{ errorType }}</i>
        {{ $t(`errors[${error.code}]`) }}
        <button
          class="close"
          @click="closeError">Close error</button>
      </div>
    </transition>
    <small
      :title="version"
      class="style-4">{{ $t('powered_by_directus') }}</small>
  </div>
</template>

<script>
import { version } from '../../package.json';
import LoginForm from '../components/LoginForm.vue';

export default {
  name: 'login',
  components: {
    LoginForm,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    version() {
      return `${this.$t('version')} ${version}`;
    },
    errorType() {
      if (+this.error.code >= 100 && +this.error.code < 200) {
        return 'warning';
      }
      return 'error';
    },
    error() {
      return this.$store.state.auth.error;
    },
  },
  methods: {
    login(credentials) {
      this.loading = true;
      this.$store.dispatch('login', credentials)
        .then(() => {
          if (this.$route.params.redirect) {
            this.$router.push(this.$route.params.redirect);
          }
        })
        .then(() => this.$api.getMe({ fields: 'last_page' }))
        .then(res => res.data.last_page)
        .then((lastPage) => {
          this.loading = false;
          this.$router.push(lastPage || '/');
        })
        .catch((err) => {
          this.loading = false;
          console.error(err); // eslint-disable-line no-console
          this.$router.push('/');
        });
    },
    closeError() {
      this.$store.dispatch('removeAuthError');
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  width: 100%;
  max-width: 260px;
}

small {
  position: absolute;
  bottom: 20px;
  text-align: center;
  cursor: help;
}

.notice {
  position: absolute;
  bottom: 50px;
  background-color: var(--light-gray);
  border-radius: var(--border-radius);
  color: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 13px;

  i {
    margin-right: 5px;
  }
}

.notice.error {
  background-color: var(--danger-dark);
}

.notice.warning {
  background-color: var(--warning);
}

.slide-enter-active {
  transform: translateY(0);
  opacity: 1;
  transition: var(--slow) var(--transition-in);
}

.slide-leave-active {
  transform: translateY(0);
  transition: var(--medium) var(--transition-out);
}

.slide-enter, .slide-leave-to {
  transform: translateY(calc(50px + 100%));
  opacity: 0;
}

.close {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 5;
  cursor: pointer;
  opacity: 0;
}
</style>
