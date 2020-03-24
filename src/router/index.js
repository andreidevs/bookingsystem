import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/admin",
    name: "Admin",
    meta: { AuthRequired: true },
    component: () => import("../views/Admin.vue")
  },
  {
    path: "/signin",
    name: "SignIn",
    component: () => import("../views/SignIn.vue")
  }
];

const router = new VueRouter({
  routes,
  mode: "history"
});

router.beforeEach((to, from, next) => {
  store.dispatch("INIT_AUTH").then(user => {
    if (to.matched.some(route => route.meta.AuthRequired)) {
      if (user) {
        next();
      } else {
        next("/signin");
      }
    } else {
      next();
    }
  });
});

export default router;
