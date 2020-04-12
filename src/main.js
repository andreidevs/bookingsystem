import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import "roboto-fontface/css/roboto/roboto-fontface.css";

import firebase from "firebase/app";
import firebaseConfig from "./config/firebase";
import "firebase/auth";
import "firebase/firestore";

import VueTheMask from "vue-the-mask";
import Notifications from "vue-notification";
import validation from "./plugins/validation";
import "./plugins/date.format";
import "./assets/main.css";
Vue.config.productionTip = false;
Vue.use(Notifications);
Vue.use(VueTheMask);
Vue.use(validation);

const GenerateId = require("generate-id");
Vue.prototype.$g = new GenerateId();

firebase.initializeApp(firebaseConfig);

Vue.$db = firebase.firestore();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
