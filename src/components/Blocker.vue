<template>
  <transition name="fade">
    <div v-if="active" class="blocker" @click="$emit('click')" :style="{ zIndex }"/>
  </transition>
</template>

<script>
  export default {
    props: {
      zIndex: Number,
      active: Boolean,
    },
  };
</script>

<style scoped>
.blocker {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: var(--darker-gray);
  opacity: 0.6;
}

.fade-enter-active {
  transition: 250ms var(--transition-in);
}

.fade-leave-active {
  transition: 200ms var(--transition-out);
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
