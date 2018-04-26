<template>
  <details
    :open="open"
    :class="type"
    class="v-details">
    <summary>{{ title }}</summary>
    <div class="content">
      <slot />
    </div>
  </details>
</template>

<script>
export default {
  name: "v-details",
  props: {
    title: {
      type: String,
      default: null
    },
    open: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "group",
      validator(val) {
        return ["group", "break"].includes(val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-details {
  width: 100%;
  margin-bottom: 20px;

  summary {
    border-top: 1px solid var(--lighter-gray);
    border-bottom: 1px solid var(--lighter-gray);
    padding: 10px 0;
    margin-bottom: 20px;
    font-size: 18px;
    color: var(--darker-gray);
    list-style-type: none;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    &::after {
      content: "keyboard_arrow_left";
      direction: ltr;
      display: inline-block;
      font-family: "Material Icons";
      font-size: 24px;
      font-style: normal;
      font-weight: normal;
      letter-spacing: normal;
      line-height: 1;
      text-transform: none;
      white-space: nowrap;
      word-wrap: normal;
      -webkit-font-feature-settings: "liga";
      -webkit-font-smoothing: antialiased;
      transition: var(--fast) var(--transition);
    }

    &::-webkit-details-marker {
      display: none;
    }

    &:hover,
    .user-is-tabbing &:focus {
      color: var(--darkest-gray);
    }
  }

  &.group {
    border: 1px solid var(--lighter-gray);
    border-radius: 3px;

    .content {
      padding: 20px;
    }

    summary {
      border: 0;
      margin-bottom: 0;
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  &[open] {
    summary {
      border-bottom: 1px solid var(--lighter-gray);
    }

    summary::after {
      transform: rotate(-90deg);
    }
  }
}
</style>
