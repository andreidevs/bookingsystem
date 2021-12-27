import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
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
    path: "/addgroup",
    name: "AdminAddGroup",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Добавить группу"
    },
    component: () => import("../views/admin/AddGroup.vue")
  },
  {
    path: "/addclient",
    name: "AdminAddClient",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Добавить клиента"
    },
    component: () => import("../views/admin/AddClient.vue")
  },
  {
    path: "/users/group",
    name: "AdminUsers",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Список учеников групп "
    },
    component: () => import("../views/admin/ReviewUsers.vue")
  },
  {
    path: "/daily",
    name: "AdminDaily",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Ежедневный отчет"
    },
    component: () => import("../views/admin/Daily.vue")
  },
  {
    path: "/train",
    name: "AdminViewTrain",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Просмотр проведенных тренировок"
    },
    component: () => import("../views/admin/ViewTrain.vue")
  },
  {
    path: "/wages",
    name: "AdminReports",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Расчет ЗП"
    },
    component: () => import("../views/admin/Wages.vue")
  },
  {
    path: "/expenses",
    name: "AdminExpenses",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Расходы"
    },
    component: () => import("../views/admin/Expenses.vue")
  },
  {
    path: "/schedule",
    name: "AdminSchedule",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Расписание"
    },
    component: () => import("../views/admin/Schedule.vue")
  },
  {
    path: "/general",
    name: "General",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Глобальные настройки"
    },
    component: () => import("../views/admin/General.vue")
  },
  {
    path: "/statistic",
    name: "AdminStatistic",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Статистика"
    },
    component: () => import("../views/admin/Statistic.vue")
  },
  {
    path: "/historysingle",
    name: "AdminHistorySingle",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - История разовых занятий"
    },
    component: () => import("../views/admin/SingleHistory.vue")
  },
  {
    path: "/groups",
    name: "AdminGroups",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Список групп"
    },
    component: () => import("../views/admin/ReviewGroup.vue")
  },
  // {
  //   path: "/indivsofia",
  //   name: "AdminIndivSofia",
  //   meta: {
  //     AuthRequired: true,
  //     layout: "admin",
  //     title: "Edem Dance - Индивы София"
  //   },
  //   component: () => import("../views/admin/IndivSofia.vue")
  // },
  {
    path: "/users/single",
    name: "AdminSingleUsers",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Список разовых занятий"
    },
    component: () => import("../views/admin/SingleUsers.vue")
  },
  {
    path: "/users/mini",
    name: "AdminMiniUsers",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Список учеников минигрупп"
    },
    component: () => import("../views/admin/ReviewMini.vue")
  },
  {
    path: "/users/indiv",
    name: "AdminIndivUsers",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Список индивидуальных учеников"
    },
    component: () => import("../views/admin/ReviewIndiv.vue")
  },
  {
    path: "/anotherpay",
    name: "AdminAnotherPay",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Другая оплата"
    },
    component: () => import("../views/admin/AnotherPay.vue")
  },
  {
    path: "/",
    name: "AdminMain",
    meta: { AuthRequired: true, layout: "admin", title: "Edem Dance" },
    component: () => import("../views/admin/index.vue")
  },
  {
    path: "/deleteuser/:type/:id",
    name: "AdminDeleteUser",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Удаление ученика"
    },
    component: () => import("../views/admin/DeleteUser.vue")
  },
  {
    path: "/signup",
    name: "AdminSignUp",
    meta: {
      AuthRequired: true,
      layout: "admin",
      title: "Edem Dance - Регистрация тренера"
    },
    component: () => import("../views/admin/SignUpAdmin.vue")
  },
  {
    path: "/system/sendreport",
    name: "SustemSendReport",
    meta: {
      AuthRequired: true,
      title: "System - send pay report"
    },
    component: () => import("../views/system/SendPay.vue")
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
