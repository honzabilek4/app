import Vue from "vue";
import Router from "vue-router";
import api from "./api";
import store from "./store";
import Collections from "./routes/Collections.vue";
import ItemListing from "./routes/ItemListing.vue";
import ItemListingGuard from "./routes/ItemListingGuard.vue";
import Edit from "./routes/Edit.vue";
import EditGuard from "./routes/EditGuard.vue";
import Login from "./routes/Login.vue";
import NotFound from "./routes/NotFound.vue";
import Interfaces from "./routes/Interfaces.vue";
import InterfaceDebugger from "./routes/InterfaceDebugger.vue";
import Debug from "./routes/Debug.vue";
import Settings from "./routes/Settings.vue";
import SettingsGlobal from "./routes/SettingsGlobal.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/collections"
    },
    {
      path: "/collections",
      component: Collections
    },
    {
      path: "/collections/:collection",
      props: true,
      component: ItemListingGuard
    },
    {
      path: "/collections/:collection/:primaryKey",
      props: true,
      component: EditGuard,
      meta: {
        /* NOTE:
         * Hi there! I'm not too pleased with this solution of 'hacking' the infoSidebar
         *   to be wide on certain pages, but I didn't want to add a third sidebar either..
         *
         * This'll do fine for the time being, but if you can think of a better way;
         *   please let me know!
         *
         * ~ Rijk
         */
        infoSidebarWidth: "wide"
      }
    },
    {
      path: "/files",
      props: {
        collection: "directus_files"
      },
      component: ItemListing
    },
    {
      path: "/files/:primaryKey",
      props(route) {
        return {
          collection: "directus_files",
          primaryKey: route.params.primaryKey
        };
      },
      component: Edit,
      meta: {
        infoSidebarWidth: "wide"
      }
    },
    {
      path: "/users",
      props: {
        collection: "directus_users"
      },
      component: ItemListing
    },
    {
      path: "/users/:primaryKey",
      props(route) {
        return {
          collection: "directus_users",
          primaryKey: route.params.primaryKey
        };
      },
      component: Edit,
      meta: {
        infoSidebarWidth: "wide"
      }
    },
    {
      path: "/activity",
      props: {
        collection: "directus_activity",
        readonly: true
      },
      component: ItemListing
    },
    {
      path: "/debug",
      component: Debug
    },
    {
      path: "/settings",
      component: Settings
    },
    {
      path: "/settings/global",
      component: SettingsGlobal
    },
    {
      path: "/interfaces",
      component: Interfaces
    },
    {
      path: "/interfaces/:id",
      component: InterfaceDebugger,
      props: true
    },
    {
      path: "/login",
      component: Login,
      meta: {
        publicRoute: true
      },
      beforeEnter(to, from, next) {
        if (api.loggedIn) return next(false);
        return next();
      }
    },
    {
      path: "/logout",
      beforeEnter(to, from, next) {
        store.dispatch("logout");
        next("/login");
      }
      // redirect: '/login',
    },
    {
      path: "*",
      component: NotFound
    }
  ]
});

router.beforeEach((to, from, next) => {
  const { loggedIn } = api;
  const publicRoute = to.matched.some(record => record.meta.publicRoute);

  if (loggedIn === false && publicRoute === false) {
    if (from.fullPath === "/") {
      return next({ path: "/login" });
    }

    return next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  }

  const editing = store.getters.editing;

  if (editing && publicRoute === false) {
    const { collection, primaryKey } = store.state.edits;
    const path = `/collections/${collection}/${primaryKey}`;

    if (path !== to.fullPath) {
      if (
        to.query.collection !== collection ||
        to.query.primaryKey !== primaryKey ||
        to.query.editing !== true
      ) {
        next({
          path: to.path,
          query: {
            collection,
            primaryKey,
            editing: true
          }
        });
      }
    }
  }

  return next();
});

router.afterEach((to, from) => {
  if (store.state.hydrating === false && from.path !== "/logout") {
    store.dispatch("track", { page: to.path });
  }
});

export default router;
