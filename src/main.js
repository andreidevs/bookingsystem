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

import VueMask from "v-mask";

import Notifications from "vue-notification";

Vue.config.productionTip = false;
Vue.use(Notifications);
Vue.use(VueMask);

Vue.config.productionTip = false;

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

Vue.$db = db;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");

export default db;
