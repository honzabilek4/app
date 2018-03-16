import Vue from 'vue';
import Router from 'vue-router';
import api from './api';
import store from './store';
import Collections from './routes/Collections.vue';
import ItemListing from './routes/ItemListing.vue';
import Edit from './routes/Edit.vue';
import Login from './routes/Login.vue';
import notFound from './routes/notFound.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/collections',
    },
    {
      path: '/collections',
      component: Collections,
    },
    {
      path: '/collections/:collection',
      props: true,
      component: ItemListing,
    },
    {
      path: '/collections/:collection/:primaryKey',
      props: true,
      component: Edit,
    },
    {
      path: '/login',
      component: Login,
      meta: {
        publicRoute: true,
      },
      beforeEnter(to, from, next) {
        if (api.loggedIn) return next(false);
        return next();
      },
    },
    {
      path: '/logout',
      beforeEnter() {
        store.dispatch('logout');
      },
    },
    {
      path: '*',
      component: notFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { loggedIn } = api;
  const publicRoute = to.matched.some(record => record.meta.publicRoute);

  if (loggedIn === false && publicRoute === false) {
    if (to.fullPath === '/') {
      return next({ path: '/login' });
    }

    return next({
      path: '/login',
      query: { redirect: to.fullPath },
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
            collection, primaryKey, editing: true,
          },
        });
      }
    }
  }

  return next();
});

export default router;
