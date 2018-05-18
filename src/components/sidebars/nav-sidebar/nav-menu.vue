<template>
  <div class="nav-menu">
    <h3
      v-if="title"
      class="style-4">{{ title }}</h3>
    <nav :class="{ 'no-border': noBorder }">
      <ul>
        <li
          v-for="({ path, name, icon, color }) in links"
          :key="path">
          <component
            :is="path.startsWith('http') ? 'a' : 'router-link'"
            :to="path"
            :href="path"
            :class="color || null">
            <i
              v-if="icon"
              class="material-icons icon">{{ icon }}</i>
            <svg
              v-else
              class="icon"
              viewBox="0 0 15 16">
              <path
                d="M.422 12.598l6.773 3.114a.696.696 0 0 0 .61 0l6.771-3.114a.676.676 0 0 0 .424-.66V3.844a.726.726 0 0 0-.013-.13v-.039a.727.727 0 0 0-.029-.093l-.01-.03a.726.726 0 0 0-.059-.11l-.016-.023a.727.727 0 0 0-.064-.077l-.035-.023a.726.726 0 0 0-.08-.066l-.02-.014a.727.727 0 0 0-.098-.055L7.803.07a.696.696 0 0 0-.61 0L.423 3.184a.726.726 0 0 0-.098.055l-.02.014a.727.727 0 0 0-.08.066L.2 3.344a.727.727 0 0 0-.064.077l-.016.023a.726.726 0 0 0-.058.11l-.02.028a.727.727 0 0 0-.03.093v.038A.726.726 0 0 0 0 3.844v8.094c0 .31.14.53.422.66zm1.031-7.617l5.319 2.45v6.493l-5.319-2.451V4.98zm6.774 8.942V7.43l5.318-2.45v6.493l-5.318 2.449zM7.499 1.525l5.035 2.32-5.035 2.318-5.034-2.319 5.034-2.319z" />
            </svg>
            {{ name }}
          </component>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "nav-menu",
  props: {
    title: {
      type: String,
      default: null
    },
    links: {
      type: Array,
      required: true
    },
    noBorder: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: 5px;
  margin-top: 15px;
}

.icon {
  font-size: 18px;
  width: 15px;
  height: 18px;
  margin-right: 10px;
  color: var(--light-gray);
  fill: var(--light-gray);

  /* Forces left-alignment of material-icons */
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  vertical-align: -5px;
}

a {
  text-decoration: none;
  display: block;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 3px;
    background-color: currentColor;
    left: -20px;
    top: 0;
    transform: scaleX(0);
    transform-origin: left;
    transition: var(--medium) var(--transition-out);
  }
}

a:hover,
.content .router-link-active,
.user-menu .router-link-exact-active {
  color: var(--accent);

  .icon {
    color: currentColor;
    fill: currentColor;
  }
}

.content .router-link-active,
.user-menu .router-link-exact-active {
  &::before {
    transform: scaleX(1);
    transition: var(--medium) var(--transition-in);
  }
}

ul {
  list-style: none;
  padding: 0;
}

nav > ul > li > * {
  padding: 5px 0;
}

nav:not(.no-border) {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--lightest-gray);
}

.success {
  color: var(--success);

  a:hover,
  .content .router-link-active,
  .user-menu .router-link-exact-active {
    color: var(--success-dark);

    &::before {
      background-color: var(--success);
    }
  }
}

.warning {
  color: var(--warning);

  &:hover,
  .content &.router-link-active,
  .user-menu &.router-link-exact-active {
    color: var(--warning-dark);

    &::before {
      background-color: var(--warning);
    }
  }
}

.danger {
  color: var(--danger);
}

.accent,
.success,
.warning,
.danger {
  .icon {
    color: currentColor;
    fill: currentColor;
  }
}
</style>
