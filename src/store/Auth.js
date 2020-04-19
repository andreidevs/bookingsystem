import firebase from "firebase/app";
import vue from "vue";
export default {
  state: {
    user: {
      isAuth: false,
      uid: null,
      name: "",
      admin: false
    },
    unsbscribeAuth: null
  },
  getters: {
    USER_AUTH: s => s.user.isAuth,
    USER: s => s.user
  },
  mutations: {
    SET_USER(state, payload) {
      (state.user.isAuth = true),
        (state.user.uid = payload.uid),
        (state.user.name = payload.displayName),
        (state.user.admin = payload.photoURL === "true" ? true : false);
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
        .then(doc => {
          vue.$db
            .collection("coach")
            .doc(doc.user.uid)
            .set({
              id: doc.user.uid,
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
          commit("SET_ERROR", error);
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
      // console.log("payload", payload)
      if (payload) {
        if (!payload.displayName) {
          vue.$db
            .collection("coach")
            .doc(payload.uid)
            .get()
            .then(function(doc) {
              let user = firebase.auth().currentUser;
              user
                .updateProfile({
                  displayName: doc.data().name,
                  photoURL: doc.data().admin.toString()
                })
                .catch(function(error) {
                  commit("SET_ERROR", error);
                });
              payload = {
                ...payload,
                displayName: doc.data().name,
                photoURL: doc.data().admin
              };
            });
        }

        commit("SET_USER", payload);
      } else {
        commit("CLEAR_USER");
      }
    }
  }
};
