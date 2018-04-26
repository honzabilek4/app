<template>
  <component
    :is="element"
    :class="{ link }"
    class="v-card">
    <component
      :is="wrapperTag"
      :to="to"
      :href="href">
      <div
        v-if="src || icon || $slots.icon"
        class="header">

        <img
          v-if="src && !error"
          :alt="title"
          :src="src"
          @error="onImageError">

        <i
          v-if="error"
          class="material-icons error">broken_image</i>

        <i
          v-if="icon"
          :class="{ 'half-opacity': opacity === 'half' }"
          class="material-icons">{{ icon }}</i>

        <div
          v-if="$slots.icon"
          class="custom-icon"><slot name="icon"/></div>

        <span
          v-if="label"
          class="label">{{ label }}</span>
      </div>
      <div class="body">
        <component
          :is="titleElement"
          class="title "
        >{{ title }}</component>
        <p
          v-if="subtitle"
          class="subtitle style-4">{{ subtitle }}</p>
        <p
          v-if="body"
          class="content">{{ body }}</p>
      </div>
    </component>
  </component>
</template>

<script>
export default {
  name: "v-card",
  props: {
    element: {
      type: String,
      default: "article"
    },
    titleElement: {
      type: String,
      default: "h2"
    },
    icon: {
      type: String,
      default: null
    },
    src: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: null
    },
    body: {
      type: String,
      default: null
    },
    to: {
      type: String,
      default: null
    },
    href: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    opacity: {
      type: String,
      default: "full",
      validator(val) {
        return ["full", "half"].includes(val);
      }
    }
  },
  data() {
    return {
      error: null
    };
  },
  computed: {
    wrapperTag() {
      if (this.to) {
        return "router-link";
      }

      if (this.href) {
        return "a";
      }

      return "div";
    },
    link() {
      if (this.to || this.href) {
        return true;
      }

      return false;
    }
  },
  methods: {
    onImageError(error) {
      this.error = error;
    }
  }
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
    cursor: pointer;
    user-select: none;
  }

  &.link:hover {
    box-shadow: var(--box-shadow-accent);
    transform: translateY(-1px);
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

    img,
    i,
    .icon {
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

  .content {
    font-size: 11px;
    color: var(--gray);
    max-height: 114px; // 8 lines of text
    overflow: hidden;
    margin-top: 20px;
  }

  .error {
    opacity: 0.5;
  }

  .half-opacity {
    opacity: 0.5;
  }
}
</style>
