<template>
  <header class="main-header">
    <button class="nav-toggle" @click="$emit('toggleNav', true)"><i class="material-icons">menu</i></button>

    <h1 class="style-1">
      <portal-target name="header-title" slim>
        <breadcrumb />
      </portal-target>
    </h1>

    <header-button
      v-if="showInfoButton"
      @click="$emit('toggleInfo')"
      icon="info"
    >
      Info
    </header-button>
    <portal-target name="header-buttons" class="buttons" />
  </header>
</template>

<script>
  export default {
    props: {
      showInfoButton: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>

<style scoped lang="scss">
.nav-toggle {
  background-color: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  margin: 0 20px;
  cursor: pointer;
  transition: opacity 140ms var(--transition);

  &:hover {
    opacity: 0.6;
  }

  i {
    font-size: 21px;
  }
}

.main-header {
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
  z-index: 5;

  div {
    height: 100%;
  }

  h1 {
    flex-grow: 1;
    color: var(--white);
    padding: 0 13px;
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
}
</style>
