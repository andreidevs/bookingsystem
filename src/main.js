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

Vue.config.productionTip = false;
Vue.use(Notifications);
Vue.use(VueTheMask);

Vue.config.productionTip = false;

firebase.initializeApp(firebaseConfig);

Vue.$db = firebase.firestore();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
