import firebase from "firebase/app";
export default {
  state: {
    user: {
      isAuth: false,
      uid: null
    }
  },
  getters: {
    USER_AUTH: s => s.user.isAuth
  },
  mutations: {
    SET_USER(state, payload) {
      (state.user.isAuth = true), (state.user.uid = payload);
    }
  },
  actions: {
    SIGNIN({ commit }, payload) {
      commit("SET_PROCESSING", true);
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit("SET_USER", user.uid);
          commit("SET_PROCESSING", false);
        })
        .catch(error => {
          commit("SET_PROCESSING", false);
          commit("SET_ERROR", error.message);
        });
    }
  }
};
