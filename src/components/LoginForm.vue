<template>
  <form @submit.prevent="submit">

    <div v-if="apiUrls.length === 0">
      <invisible-label htmlFor="url">{{ $t('api_url') }}</invisible-label>
      <form-input
        icon="cloud"
        type="url"
        :placeholder="$t('api_url')"
        name="url"
        class="input"
        id="url"
        v-model="url"
      />
    </div>

    <form-select
      v-if="(apiUrls.length === 1 && allowOther === true) || apiUrls.length > 1"
      v-model="url"
      class="input"
      id="url"
      icon="cloud"
      :other="allowOther"
      :options="apiConfig"
      :custom="allowOther"
      type="url"
    />

    <invisible-label htmlFor="email">{{ $t('email_address') }}</invisible-label>
    <form-input
      icon="person"
      :placeholder="$t('email')"
      id="email"
      class="input"
      type="email"
      name="email"
      v-model="email"
    />

    <invisible-label htmlFor="password">{{ $t('password') }}</invisible-label>
    <form-input
      icon="lock"
      id="password"
      :placeholder="$t('password')"
      type="password"
      name="password"
      class="input"
      v-model="password"
    />

    <form-button
      type="submit"
      :fullwidth="true"
      :disabled="disabled"
      :loading="loading"
    >{{ $t('login') }}</form-button>
  </form>
</template>

<script>
  import InvisibleLabel from '../components/form/InvisibleLabel.vue';

  export default {
    props: {
      loading: Boolean,
    },
    computed: {
      disabled() {
        return !Boolean(this.email.length && this.password.length && this.url.length);
      },
      apiConfig() {
        return window.__DirectusConfig__.api;
      },
      apiUrls() {
        return Object.values(this.apiConfig);
      },
      allowOther() {
        return window.__DirectusConfig__.allowOtherAPI;
      },
    },
    components: {
      InvisibleLabel,
    },
    data() {
      return {
        email: '',
        password: '',
        url: Object.keys(window.__DirectusConfig__.api)[0] || '',
      };
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
