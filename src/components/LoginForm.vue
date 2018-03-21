<template>
  <form
    class="login-form"
    @submit.prevent="submit">

    <div v-if="apiUrls.length === 0">
      <invisible-label html-for="url">{{ $t('api_url') }}</invisible-label>
      <form-input
        id="url"
        v-model="url"
        :placeholder="$t('api_url')"
        icon="cloud"
        type="url"
        name="url"
        class="input" />
    </div>

    <form-select
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

    <invisible-label html-for="email">{{ $t('email_address') }}</invisible-label>
    <form-input
      id="email"
      v-model="email"
      :placeholder="$t('email')"
      icon="person"
      class="input"
      type="email"
      name="email" />

    <invisible-label html-for="password">{{ $t('password') }}</invisible-label>
    <form-input
      id="password"
      v-model="password"
      :placeholder="$t('password')"
      icon="lock"
      type="password"
      name="password"
      class="input" />

    <form-button
      :fullwidth="true"
      :disabled="disabled"
      :loading="loading"
      type="submit">{{ $t('login') }}</form-button>
  </form>
</template>

<script>
import InvisibleLabel from '../components/form/InvisibleLabel.vue';

export default {
  name: 'login-form',
  components: {
    InvisibleLabel,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      email: '',
      password: '',
      url: Object.keys(window.__DirectusConfig__.api)[0] || '', // eslint-disable-line
    };
  },
  computed: {
    disabled() {
      return !(this.email.length && this.password.length && this.url.length);
    },
    apiConfig() {
      return window.__DirectusConfig__.api; // eslint-disable-line
    },
    apiUrls() {
      return Object.values(this.apiConfig);
    },
    allowOther() {
      return window.__DirectusConfig__.allowOtherAPI; // eslint-disable-line
    },
  },
  methods: {
    submit() {
      const { email, password, url } = this;
      this.$emit('submit', { email, password, url });
    },
  },
};
</script>

<style scoped>
.input {
  margin-bottom: 13px;
}
</style>
