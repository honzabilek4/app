<template>
  <details
    :open="open"
    class="v-group">
    <summary>{{ title }}</summary>
    <slot />
  </details>
</template>

<script>
export default {
  name: 'v-group',
  props: {
    title: {
      type: String,
      default: null,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.v-group {
  width: 100%;
  margin: 10px 0 40px;

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
      content: 'keyboard_arrow_left';
      direction: ltr;
      display: inline-block;
      font-family: 'Material Icons';
      font-size: 24px;
      font-style: normal;
      font-weight: normal;
      letter-spacing: normal;
      line-height: 1;
      text-transform: none;
      white-space: nowrap;
      word-wrap: normal;
      -webkit-font-feature-settings: 'liga';
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

  &[open] summary::after {
    transform: rotate(-90deg);
  }
}
</style>
