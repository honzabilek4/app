import Vue from 'vue';
import Router from 'vue-router';
import api from './api';
import Home from './routes/Home.vue';
import Login from './routes/Login.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/login',
      component: Login,
      meta: {
        public: true,
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

  if (to.matched.some(record => record.meta.public)) {
    return next();
  }

  if (loggedIn) {
    return next();
  }

  return next({
    path: '/login',
    query: { redirect: to.fullPath },
  });
});

export default router;
