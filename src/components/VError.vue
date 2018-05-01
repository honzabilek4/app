<template>
  <transition name="error">
    <div class="v-error">
      <i
        :class="color"
        class="material-icons">{{ icon }}</i>
      <h2 class="style-1">{{ title }}</h2>
      <p>{{ body }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: "v-error",
  props: {
    color: {
      type: String,
      default: "accent",
      validator(val) {
        return ["accent", "secondary", "success", "warning", "danger"].includes(
          val
        );
      }
    },
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.v-error {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: calc(100vh - var(--header-height));

  i {
    font-size: 48px;
    background-color: var(--white);
    box-shadow: var(--box-shadow);
    color: var(--accent);
    border-radius: 50%;
    padding: 20px;
    margin-bottom: 10px;
  }

  h2 {
    margin-bottom: 5px;
  }

  p {
    line-height: 1.4;
    color: var(--light-gray);
    max-width: 200px;
    text-align: center;
  }

  .accent {
    color: var(--accent);
  }

  .secondary {
    color: var(--secondary);
  }

  .success {
    color: var(--success);
  }

  .warning {
    color: var(--warning);
  }

  .danger {
    color: var(--danger);
  }
}

.error-enter-active {
  transition: var(--slow) var(--transition-in);

  > * {
    transition: var(--slow) var(--transition-in);

    &:nth-child(2) {
      transition-delay: 50ms;
    }

    &:nth-child(3) {
      transition-delay: 100ms;
    }
  }
}

.error-leave-active {
  transition: var(--slow) var(--transition-in);

  > * {
    transition: var(--slow) var(--transition-in);

    &:nth-child(1) {
      transition-delay: 100ms;
    }

    &:nth-child(2) {
      transition-delay: 50ms;
    }
  }
}

.error-enter,
.error-leave-to {
  > * {
    opacity: 0;
    transform: translateY(15px);
  }
}
</style>
