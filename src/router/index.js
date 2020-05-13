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
    path: "/admin/addclient",
    name: "AdminAddClient",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Добавить клиента"
    },
    component: () => import("../views/admin/AddClient.vue")
  },
  {
    path: "/admin/users",
    name: "AdminUsers",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Список учеников "
    },
    component: () => import("../views/admin/ReviewUsers.vue")
  },
  {
    path: "/admin/daily",
    name: "AdminDaily",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Ежедневный отчет"
    },
    component: () => import("../views/admin/Daily.vue")
  },
  {
    path: "/admin/wages",
    name: "AdminReports",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Расчет ЗП"
    },
    component: () => import("../views/admin/Wages.vue")
  },
  {
    path: "/admin/schedule",
    name: "AdminSchedule",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Расписание"
    },
    component: () => import("../views/admin/Schedule.vue")
  },
  {
    path: "/admin/statistic",
    name: "AdminStatistic",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Статистика"
    },
    component: () => import("../views/admin/Statistic.vue")
  },
  {
    path: "/admin/historysingle",
    name: "AdminHistorySingle",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - История разовых занятий"
    },
    component: () => import("../views/admin/SingleHistory.vue")
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
      title: "Edem Dance - Список разовых занятий"
    },
    component: () => import("../views/admin/SingleUsers.vue")
  },
  {
    path: "/admin/users/mini",
    name: "AdminMiniUsers",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Список учеников минигрупп"
    },
    component: () => import("../views/admin/ReviewMini.vue")
  },
  {
    path: "/admin/users/indiv",
    name: "AdminIndivUsers",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Список индивидуальных учеников"
    },
    component: () => import("../views/admin/ReviewIndiv.vue")
  },
  {
    path: "/admin",
    name: "AdminMain",
    meta: { AuthRequired: true, layout: "admin", title: "Edem Dance" },
    component: () => import("../views/admin/index.vue")
  },
  {
    path: "/admin/deleteuser/:type/:id",
    name: "AdminDeleteUser",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Удаление ученика"
    },
    component: () => import("../views/admin/DeleteUser.vue")
  },
  {
    path: "/admin/signup",
    name: "AdminSignUp",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Регистрация тренера"
    },
    component: () => import("../views/admin/SignUpAdmin.vue")
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
