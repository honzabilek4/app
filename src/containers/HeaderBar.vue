<template>
  <header class="header-bar">
    <button
      class="nav-toggle"
      @click="$emit('toggleNav', true)"><i class="material-icons">menu</i></button>

    <h1 class="style-1">
      <portal-target
        name="header-title"
        slim>
        <breadcrumb />
      </portal-target>
    </h1>

    <portal-target
      name="header-custom"
      class="custom"
      slim />

    <header-button
      v-if="showInfoButton"
      icon="info"
      @click="$emit('toggleInfo')">
      Info
    </header-button>
    <portal-target
      name="header-buttons"
      class="buttons" />
  </header>
</template>

<script>
export default {
  name: 'header-bar',
  props: {
    showInfoButton: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
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
}

.header-bar {
  background-color: black;
  background-color: var(--darkest-gray);
  position: fixed;
  width: 100%;
  right: 0;
  top: 0;
  height: 4.62rem;
  color: white;
  display: flex;
  align-items: center;
  z-index: 20;
  padding-left: 20px;

  h1 {
    flex-grow: 1;
    color: var(--white);
    margin-right: 20px;
    height: 20px;
  }

  @media (min-width: 50em) {
    width: calc(100% - var(--nav-sidebar-width));

    .nav-toggle {
      display: none;
    }
  }
}

.buttons {
  display: flex;
  height: 100%;
}

.custom {
  margin: 0 20px;
}
</style>
