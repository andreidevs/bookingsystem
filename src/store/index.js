import Vue from "vue";
import Vuex from "vuex";
import Auth from "./Auth";
import General from "./General";
import Data from "./Data";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { Auth, General, Data }
});
