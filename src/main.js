import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import firebase from "firebase/app";
import firebaseConfig from "./config/firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import Notifications from "vue-notification";
import "vue-material-design-icons/styles.css";
Vue.config.productionTip = false;
Vue.use(Notifications);

Vue.config.productionTip = false;

firebase.initializeApp(firebaseConfig);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
