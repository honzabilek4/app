<template>
  <form @submit.prevent="login">
    <fieldset :disabled="loading">
      <legend>Login</legend>
      <label v-if="apiUrl.length === 0">
        URL
        <input type="url" name="url" v-model="url" />
      </label>

      <label v-if="apiUrl.length > 1">
        URL
        <select v-model="url">
          <option v-for="url in apiUrl" :value="url">
            {{url}}
          </option>
        </select>
      </label>

      <label>
        Email
        <input type="email" name="email" v-model="email" />
      </label>
      <label>
        Password
        <input type="password" name="password" v-model="password" />
      </label>
      <button type="submit">Login</button>
    </fieldset>
  </form>
</template>

<script>
  export default {
    computed: {
      apiUrl() {
        return window.__DirectusConfig__.apiUrl;
      },
      loading() {
        return this.$store.state.auth.loading;
      },
      error() {
        return this.$store.state.auth.error;
      },
    },
    data() {
      return {
        email: '',
        password: '',
        url: window.__DirectusConfig__.apiUrl[0],
      };
    },
    methods: {
      login() {
        const { email, password, url } = this;
        this.$api.login({ email, password, url })
          .then(() => {
            const redirectRoute = this.$route.params.redirect;
            this.$router.push(redirectRoute || '/');
          })
          .catch();
      },
    },
  };
</script>
