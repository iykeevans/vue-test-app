import Vue from "vue";
import Router from "vue-router";

import HomePage from "../views";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/login",
      name: "HomePage",
      component: HomePage,
    },
    {
      path: "/login",
      name: "LoginPage",
      component: () => import("../views/login.vue"),
      meta: {
        guest: true,
      },
    },
    {
      path: "/payment-history",
      name: "PaymentHistory",
      component: () => import("../views/payment-history.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "*",
      component: () => import("../views/error-404.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const access_token = localStorage.getItem("access_token");

  if (to.matched.some((item) => item.meta.requiresAuth)) {
    if (!access_token) {
      next({ path: "/login" });
    } else {
      next();
    }
  } else if (to.matched.some((item) => item.meta.guest)) {
    if (!access_token) {
      next();
    } else {
      next({ path: "/payment-history" });
    }
  } else {
    next();
  }
});

export default router;
