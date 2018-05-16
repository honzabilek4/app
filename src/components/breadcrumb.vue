<template>
  <div
    v-if="$mq === 'small'"
    class="v-breadcrumb">
    <span
      :class="lastLink.color ? lastLink.color : null"
      class="current">{{ lastLink.name }}</span>
  </div>
  <div
    v-else
    class="v-breadcrumb">
    <span
      v-for="(link, index) in _links"
      :key="index">
      <span
        v-if="link.path === $route.path"
        :class="link.color ? link.color : null"
        class="current">{{ link.name }}</span>
      <router-link
        v-else
        :to="link.path"
        :class="link.color ? link.color : null">{{ link.name }}</router-link>
      <i
        v-if="index !== _links.length - 1"
        class="material-icons">chevron_right</i>
    </span>
  </div>
</template>

<script>
export default {
  name: "v-breadcrumb",
  props: {
    links: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    _links() {
      if (this.links) return this.links;

      const routeParts = this.$route.path.split("/");
      routeParts.shift();

      return routeParts.map((part, i) => {
        let url = "";

        for (let x = 0; x < i; x++) {
          // eslint-disable-line
          url += `/${routeParts[x]}`;
        }

        url += `/${part}`;

        return {
          name: this.$helpers.formatTitle(part),
          path: url
        };
      });
    },
    lastLink() {
      return this._links[this._links.length - 1]; // eslint-disable-line no-underscore-dangle
    }
  }
};
</script>

<style lang="scss" scoped>
.current {
  color: var(--white);
  cursor: default;
}

a {
  color: var(--gray);
  text-decoration: none;
  transition: color 140ms var(--transition);

  &:hover {
    color: var(--white);
  }
}

i {
  color: var(--darker-gray);
  margin-right: 8px;
  width: 20px;
  user-select: none;
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
</style>
