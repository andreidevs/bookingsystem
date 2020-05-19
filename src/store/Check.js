import vue from "vue";
export default {
  state: {
    check: false
  },
  getters: {
    CHECK: s => s.check
  },
  mutations: {
    SET_CHECK(state, payload) {
      state.check = payload;
    }
  },

  actions: {
    CHECK_USERS_GROUP({ commit }, payload) {
      let ref;
      let check = false;
      if (payload.type === "Group") {
        ref = vue.$db.collection("usersGroup");
      } else if (payload.type === "Mini") {
        ref = vue.$db.collection("usersMini");
      } else {
        ref = vue.$db.collection("usersSingle");
      }
      ref
        .where("name", "==", payload.name)
        .where("phone", "==", payload.phone)
        .where("nameGroup", "==", payload.nameGroup)
        .get()
        .then(function(querySnapshot) {
          let count = 0;
          querySnapshot.forEach(function() {
            count++;
          });
          if (count != 0) {
            check = true;
          }
          commit("SET_CHECK", check);
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    CHECK_INDIV({ commit }, payload) {
      let check = false;
      const ref = vue.$db.collection("usersIndiv");
      ref
        .where("name", "==", payload.name)
        .where("phone", "==", payload.phone)
        .where("coach", "==", payload.coach)
        .get()
        .then(function(querySnapshot) {
          let count = 0;
          querySnapshot.forEach(function() {
            count++;
          });
          if (count != 0) {
            check = true;
          }
          commit("SET_CHECK", check);
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    CHECK_GROUP({ commit }, payload) {
      let check = false;
      const ref = vue.$db.collection("groups");
      ref
        .where("name", "==", payload.name)
        .get()
        .then(function(querySnapshot) {
          let count = 0;
          querySnapshot.forEach(function() {
            count++;
          });
          if (count != 0) {
            check = true;
          }
          commit("SET_CHECK", check);
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    CHECK_DAILY({ commit }, payload) {
      let check = false;
      vue.$db
        .collection("reportsDaily")
        .doc(payload.coach + "-" + payload.day + "-" + payload.month)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            check = true;
          } else {
            check = false;
          }
          commit("SET_CHECK", check);
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    }
  }
};
