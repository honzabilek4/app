<template>
  <div class="login">
    <login-form
      @submit="login"
      :loading="loading"
      class="form"
    ></login-form>
    <transition name="slide">
      <div class="notice" v-if="error" :class="errorType">
        <i class="material-icons">{{ errorType }}</i>
        {{ $t(`errors[${error.code}]`) }}
        <button @click="closeError" class="close">Close error</button>
      </div>
    </transition>
    <small :title="version" class="style-4">{{ $t('powered_by_directus') }}</small>
  </div>
</template>

<script>
  import { version } from '../../package.json';
  import LoginForm from '../components/LoginForm.vue';

  export default {
    computed: {
      version() {
        return this.$t('version') + ' ' + version;
      },
      errorType() {
        return this.error.code === -1 ? 'error' : 'warning';
      },
    },
    components: {
      LoginForm,
    },
    data() {
      return {
        loading: false,
        error: null,
      };
    },
    methods: {
      login(credentials) {
        this.loading = true;
        this.$api.login(credentials)
          .then(() => {
            this.loading = false;
            const redirectRoute = this.$route.params.redirect;
            this.$router.push(redirectRoute || '/');
          })
          .catch(error => {
            this.loading = false;
            this.error = error;
          });
      },
      closeError() {
        this.error = null;
      },
    },
  }
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
