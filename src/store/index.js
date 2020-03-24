import Vue from "vue";
import Vuex from "vuex";
import Auth from "./Auth";
import General from "./General";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { Auth, General }
});
