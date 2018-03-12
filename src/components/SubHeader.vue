<template>
  <portal-target
    name="sub-header"
    class="sub-header"
  />
</template>

<style scoped>
.sub-header {
  position: sticky;
  top: var(--header-height);
  background-color: var(--white);
  height: var(--header-height);
  width: 100%;
}
</style>
