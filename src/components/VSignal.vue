<template>
  <!-- eslint-disable max-len -->
  <transition name="fade">
    <svg
      v-if="strength === 0"
      class="v-signal"
      viewBox="0 0 26 24">
      <path
        fill-opacity=".3"
        d="M24.24 8l1.35-1.68C25.1 5.96 20.26 2 13 2S.9 5.96.42 6.32l12.57 15.66.01.02.01-.01L20 13.28V8h4.24z"/>
      <path d="M22 22h2v-2h-2v2zm0-12v8h2v-8h-2z"/>
    </svg>

    <svg
      v-else-if="strength === 1"
      class="v-signal"
      viewBox="0 0 48 48">
      <path
        fill-opacity=".3"
        d="M24.02 42.98L47.28 14c-.9-.68-9.85-8-23.28-8S1.62 13.32.72 14l23.26 28.98.02.02.02-.02z"/>
      <path
        d="M0 0h48v48H0z"
        fill="none"/>
      <path d="M13.34 29.72l10.65 13.27.01.01.01-.01 10.65-13.27C34.13 29.31 30.06 26 24 26s-10.13 3.31-10.66 3.72z"/>
    </svg>

    <svg
      v-else-if="strength === 2"
      class="v-signal"
      viewBox="0 0 48 48">
      <path
        fill-opacity=".3"
        d="M24.02 42.98L47.28 14c-.9-.68-9.85-8-23.28-8S1.62 13.32.72 14l23.26 28.98.02.02.02-.02z"/>
      <path
        d="M0 0h48v48H0z"
        fill="none"/>
      <path d="M9.58 25.03l14.41 17.95.01.02.01-.02 14.41-17.95C37.7 24.47 32.2 20 24 20s-13.7 4.47-14.42 5.03z"/>
    </svg>

    <svg
      v-else-if="strength === 3"
      class="v-signal"
      viewBox="0 0 48 48">
      <path
        fill-opacity=".3"
        d="M24.02 42.98L47.28 14c-.9-.68-9.85-8-23.28-8S1.62 13.32.72 14l23.26 28.98.02.02.02-.02z"/>
      <path
        d="M0 0h48v48H0z"
        fill="none"/>
      <path d="M7.07 21.91l16.92 21.07.01.02.02-.02 16.92-21.07C40.08 21.25 33.62 16 24 16c-9.63 0-16.08 5.25-16.93 5.91z"/>
    </svg>

    <svg
      v-else-if="strength === 4"
      class="v-signal"
      viewBox="0 0 48 48">
      <path d="M24.02 42.98L47.28 14c-.9-.68-9.85-8-23.28-8S1.62 13.32.72 14l23.26 28.98.02.02.02-.02z"/>
      <path
        d="M0 0h48v48H0z"
        fill="none"/>
    </svg>
  </transition>
</template>

<script>
export default {
  name: "v-signal",
  computed: {
    strength() {
      return this.$store.getters.signalStrength;
    }
  }
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--fast) var(--transition);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
