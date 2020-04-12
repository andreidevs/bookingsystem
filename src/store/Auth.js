import firebase from "firebase/app";
import vue from "vue";
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
        if (state.unsbscribeAuth) state.unsbscribeAuth();

        let unsubcribe = firebase.auth().onAuthStateChanged(function(user) {
          dispatch("STATE_CHANGE", user);
          resolve(user);
        });
        dispatch("CHECK_PAY_DATE");
        commit("SET_SUBSCRIBE_AUTH", unsubcribe);
      });
    },
    SIGNIN({ commit }, payload) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(() => {
          commit("SET_SUCCESS");
        })
        .catch(error => {
          commit("SET_ERROR", error.message);
        });
    },
    SIGNUP_ADMIN({ commit }, payload) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(() => {
          vue.$db
            .collection("coach")
            .doc(payload.id)
            .set({
              id: payload.id,
              name: payload.name,
              email: payload.email,
              admin: payload.admin
            })
            .then(function() {
              commit("SET_SUCCESS");
            })
            .catch(function(error) {
              commit("SET_ERROR", error);
            });
        })
        .catch(error => {
          commit("SET_ERROR", error.message);
        });
    },
    LOGOUT({ commit }) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit("SET_SUCCESS");
        })
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
