import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    meta: { title: "Edem Dance - Записаться на тренеровку" },
    component: () => import("../views/Home.vue")
  },
  {
    path: "/indiv",
    name: "Indiv",
    meta: { title: "Edem Dance - Записаться на индивидуальное занятие" },
    component: () => import("../views/Indiv.vue")
  },
  {
    path: "/admin/addgroup",
    name: "AdminAddGroup",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Добавить группу"
    },
    component: () => import("../views/admin/AddGroup.vue")
  },
  {
    path: "/admin/users",
    name: "AdminUsers",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Список учеников групп"
    },
    component: () => import("../views/admin/ReviewUsers.vue")
  },
  {
    path: "/admin/groups",
    name: "AdminGroups",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Список групп"
    },
    component: () => import("../views/admin/ReviewGroup.vue")
  },
  {
    path: "/admin/users/single",
    name: "AdminSingleUsers",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Список индивидуальных учеников"
    },
    component: () => import("../views/admin/SingleUsers.vue")
  },
  {
    path: "/admin",
    name: "AdminMain",
    meta: { AuthRequired: true, layout: "admin", title: "Edem Dance" },
    component: () => import("../views/admin/index.vue")
  },
  {
    path: "/signin",
    name: "SignIn",
    meta: { title: "Edem Dance - Вход в админ панель" },
    component: () => import("../views/SignIn.vue")
  }
];

const router = new VueRouter({
  routes,
  mode: "history"
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
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
