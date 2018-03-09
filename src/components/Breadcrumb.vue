<template>
  <div>
    <span
      v-for="(link, index) in _links"
      :key="index"
    >
      <span
        v-if="link.path === $route.path"
        class="current">{{ link.name }}</span>
      <router-link
        v-else
        :to="link.path">{{ link.name }}</router-link>
      <i
        v-if="index !== _links.length - 1"
        class="material-icons"
      >chevron_right</i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    _links() {
      if (this.links) return this.links;

      const routeParts = this.$route.path.split('/');
      routeParts.shift();

      return routeParts.map((part, i) => {
        let url = '';

        for (let x = 0; x < i; x++) { // eslint-disable-line
          url += `/${routeParts[x]}`;
        }

        url += `/${part}`;

        return {
          name: this.$helpers.formatName(part),
          path: url,
        };
      });
    },
  },
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
</style>
