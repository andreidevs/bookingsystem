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
    path: "/admin/addgroup",
    name: "AdminAddGroup",
    meta: { AuthRequired: true, layout: "admin" },
    component: () => import("../views/admin/AddGroup.vue")
  },
  {
    path: "/admin/users",
    name: "AdminUsers",
    meta: { AuthRequired: true, layout: "admin" },
    component: () => import("../views/admin/ReviewUsers.vue")
  },
  {
    path: "/admin/groups",
    name: "AdminGroups",
    meta: { AuthRequired: true, layout: "admin" },
    component: () => import("../views/admin/ReviewGroup.vue")
  },
  {
    path: "/admin",
    name: "AdminMain",
    meta: { AuthRequired: true, layout: "admin" },
    component: () => import("../views/admin/index.vue")
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
