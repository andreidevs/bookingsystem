import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import "roboto-fontface/css/roboto/roboto-fontface.css";

import firebase from "firebase/app";
import firebaseConfig from "./config/firebase1";
import "firebase/auth";
import "firebase/firestore";

import moment from "moment";
moment.locale("ru");
Vue.prototype.$moment = moment;

import VueTheMask from "vue-the-mask";
import Notifications from "vue-notification";
import validation from "./plugins/validation";
import excel from "vue-excel-export";

import "./assets/main.css";
import "./plugins/date.format";
import "./registerServiceWorker";

export const eventBus = new Vue();

Vue.config.productionTip = false;
Vue.use(Notifications);
Vue.use(VueTheMask);
Vue.use(validation);
Vue.use(excel);
const GenerateId = require("generate-id");
Vue.prototype.$g = new GenerateId();

firebase.initializeApp(firebaseConfig);

Vue.$db = firebase.firestore();

import wb from "./registerServiceWorker";

Vue.prototype.$workbox = wb;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
