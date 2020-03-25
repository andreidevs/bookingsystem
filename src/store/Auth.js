import firebase from "firebase/app";
export default {
  state: {
    user: {
      isAuth: false,
      uid: null
    },
    unsbscribeAuth: null
  },
  getters: {
    USER_AUTH: s => s.user.isAuth
  },
  mutations: {
    SET_USER(state, payload) {
      (state.user.isAuth = true), (state.user.uid = payload);
    },
    CLEAR_USER(state) {
      (state.user.isAuth = false), (state.user.uid = null);
    },
    SET_SUBSCRIBE_AUTH(state, payload) {
      state.unsbscribeAuth = payload;
    }
  },
  actions: {
    INIT_AUTH({ commit, dispatch, state }) {
      return new Promise(resolve => {
        if (state.unsbscribeAuth);

        let unsubcribe = firebase.auth().onAuthStateChanged(function(user) {
          dispatch("STATE_CHANGE", user);
          resolve(user);
        });
        commit("SET_SUBSCRIBE_AUTH", unsubcribe);
      });
    },
    SIGNIN({ commit }, payload) {
      commit("CLEAR_ERROR");
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(() => {})
        .catch(error => {
          commit("SET_ERROR", error.message);
        });
    },
    LOGOUT({ commit }) {
      commit("CLEAR_ERROR");
      firebase
        .auth()
        .signOut()
        .then(() => {})
        .catch(error => {
          commit("SET_ERROR", error.message);
        });
    },
    STATE_CHANGE({ commit }, payload) {
      if (payload) {
        commit("SET_USER", payload.uid);
      } else {
        commit("CLEAR_USER");
      }
    }
  }
};
