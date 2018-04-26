<template>
  <div class="v-error">
    <i
      :class="color"
      class="material-icons">{{ icon }}</i>
    <h2 class="style-1">{{ title }}</h2>
    <p>{{ body }}</p>
  </div>
</template>

<script>
export default {
  name: "v-error",
  props: {
    color: {
      type: String,
      default: "primary",
      validator(val) {
        return [
          "primary",
          "secondary",
          "success",
          "warning",
          "danger"
        ].includes(val);
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

  i {
    font-size: 48px;
    background-color: var(--white);
    box-shadow: var(--box-shadow);
    color: var(--primary);
    border-radius: 50%;
    padding: 20px;
    margin-bottom: 10px;
  }

  h2 {
    margin-bottom: 5px;
  }

  p {
    line-height: 1.4;
    color: var(--gray);
    max-width: 200px;
    text-align: center;
  }

  .primary {
    color: var(--primary);
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
</style>
