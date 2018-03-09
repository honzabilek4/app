import Vue from 'vue';
import Router from 'vue-router';
import api from './api';
import Collections from './routes/Collections.vue';
import ItemListing from './routes/ItemListing.vue';
import Login from './routes/Login.vue';

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
  ],
});

router.beforeEach((to, from, next) => {
  const { loggedIn } = api;

  if (to.matched.some(record => record.meta.publicRoute)) {
    return next();
  }

  if (loggedIn) {
    return next();
  }

  if (!loggedIn && to.fullPath === '/') {
    return next({ path: '/login' });
  }

  return next({
    path: '/login',
    query: { redirect: to.fullPath },
  });
});

export default router;
