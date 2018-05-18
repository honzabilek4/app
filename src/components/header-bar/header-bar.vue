<template>
  <header class="v-header-bar">
    <button
      :disabled="navActive"
      class="nav-toggle"
      @click="activateNav"><i class="material-icons">menu</i></button>
    <h1
      v-if="title"
      class="title">{{ title }}</h1>
    <ol
      v-else
      class="breadcrumb title">
      <li
        v-for="({ name, path }, index) in (breadcrumb || defaultBreadcrumb)"
        :key="path">
        <template v-if="index !== (breadcrumb || defaultBreadcrumb).length - 1">
        <router-link :to="path">{{ name }}</router-link></template>
        <h1 v-else>{{ name }}</h1>
      </li>
    </ol>
    <slot />
    <slot name="buttons" />
  </header>
</template>

<script>
import { TOGGLE_NAV } from "../../store/mutation-types";

export default {
  name: "v-header-bar",
  props: {
    title: {
      type: String,
      default: null
    },
    breadcrumb: {
      type: Array,
      default: null
    }
  },
  computed: {
    defaultBreadcrumb() {
      const routeParts = this.$route.path.split("/").filter(name => name);
      return routeParts.map((part, i) => {
        let url = "";
        for (let x = 0; x < i; x++) {
          url += `/${routeParts[x]}`;
        }
        url += `/${part}`;
        return {
          name: this.$helpers.formatTitle(part),
          path: url
        };
      });
    },
    navActive() {
      return this.$store.state.sidebars.nav;
    }
  },
  methods: {
    activateNav() {
      this.$store.commit(TOGGLE_NAV, true);
    }
  }
};
</script>

<style scoped lang="scss">
.v-header-bar {
  background-color: var(--darkest-gray);
  position: fixed;
  width: 100%;
  right: 0;
  top: 0;
  height: 4.62rem;
  color: var(--white);
  display: flex;
  align-items: center;
  z-index: 20;
  padding-left: 20px;

  @media (min-width: 800px) {
    padding-left: calc(var(--nav-sidebar-width) + 20px);
  }

  .nav-toggle {
    background-color: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    margin-right: 20px;
    cursor: pointer;
    transition: opacity 140ms var(--transition);

    &:hover {
      opacity: 0.6;
    }

    @media (min-width: 800px) {
      display: none;
    }
  }

  .title {
    color: var(--gray);
    font-size: 1.38em;
    line-height: 1.16;
    font-weight: 400;
    height: 20px;
    flex-grow: 1;
  }

  .breadcrumb {
    list-style: none;
    padding: 0;

    li {
      display: inline-block;
      &:not(:last-child)::after {
        content: "chevron_right";
        font-family: "Material Icons";
        color: var(--dark-gray);
        display: inline-block;
        vertical-align: middle;
        margin: 0 5px;
      }
    }

    a {
      text-decoration: none;
      &:hover,
      .user-is-tabbing &:focus {
        color: var(--white);
      }
    }
  }

  h1.title,
  .title h1 {
    color: var(--white);
  }
}
</style>

<style>
body {
  padding-top: var(--header-height);
}
</style>
