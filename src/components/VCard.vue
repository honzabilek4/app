<template>
  <component
    :is="element"
    :class="to ? 'link' : null"
    class="v-card">
    <component
      :is="wrapperTag"
      :to="to">
      <div
        v-if="src || icon || $slots.icon"
        class="header">

        <img
          v-if="src"
          :alt="title"
          :src="src">

        <i
          v-if="icon"
          class="material-icons">{{ icon }}</i>

        <div class="custom-icon"><slot name="icon"/></div>

        <span
          v-if="label"
          class="label">{{ label }}</span>
      </div>
      <div class="body">
        <component
          :is="titleElement"
          class="title "
        >{{ title }}</component>
        <p class="subtitle style-4">{{ subtitle }}</p>
      </div>
    </component>
  </component>
</template>

<script>
export default {
  name: 'v-card',
  props: {
    element: {
      type: String,
      default: 'article',
    },
    titleElement: {
      type: String,
      default: 'h2',
    },
    icon: {
      type: String,
      default: null,
    },
    src: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: null,
    },
    to: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
  },
  computed: {
    wrapperTag() {
      return this.to ? 'router-link' : 'div';
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  width: 160px;
  border-radius: 3px;
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: box-shadow var(--fast) var(--transition);
  background-color: var(--white);

  a {
    text-decoration: none;
  }

  &.link:hover {
    box-shadow: var(--box-shadow-accent);
  }

  .header {
    height: 160px;
    display: grid;
    grid-template-columns: 1;
    grid-template-rows: 1;
    background-color: var(--primary);
    align-items: center;
    justify-content: center;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    i {
      font-size: 64px;
      color: var(--white);
      text-align: center;
    }

    .custom-icon {
      width: 64px;
      height: 64px;
    }

    img, i, .icon {
      grid-row: 1;
      grid-column: 1;
    }

    .label {
      position: absolute;
      bottom: 10px;
      right: 10px;
      padding: 2px 5px;
      border-radius: var(--border-radius);
      opacity: 0.5;
      background-color: var(--white);
      color: var(--darker-gray);
      backdrop-filter: blur(5px);
      font-size: 10px;
      text-transform: uppercase;
    }
  }

  .body {
    padding: 10px;
  }

  .title,
  .subtitle {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .title {
    margin-bottom: 5px;
  }
}
</style>
