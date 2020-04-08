import vue from "vue";
export default {
  state: {
    coachList: [],
    typeWorkoutList: [],
    allGroups: [],
    allUsers: [],
    usersByGroup: []
  },
  getters: {
    COACH: s => s.coachList,
    TYPEWORKOUT: s => s.typeWorkoutList,
    ALLGROUPS: s => s.allGroups,
    ALLUSERS: s => s.allUsers,
    USERSBYGROUP: s => s.usersByGroup
  },
  mutations: {
    SET_COACH_LIST(state, payload) {
      state.coachList = payload;
    },
    SET_TYPEWORKOUT_LIST(state, payload) {
      state.typeWorkoutList = payload;
    },
    SET_ALL_GROUPS(state, payload) {
      state.allGroups = payload;
    },
    SET_ALL_USERS(state, payload) {
      state.allUsers = payload;
    },
    SET_USERS_BY_GROUP(state, payload) {
      state.usersByGroup = payload;
    }
  },
  actions: {
    CHECK_PAY_DATE({ dispatch }) {
      vue.$db
        .collection("thisdate")
        .doc("0")
        .get()
        .then(function(doc) {
          if (doc.data().date !== new Date().format("dd.mm.yyyy")) {
            console.log("da");
            dispatch("UPDATE_PAY_TRIGER");
            vue.$db
              .collection("thisdate")
              .doc("0")
              .set({
                date: new Date().format("dd.mm.yyyy")
              });
          }
        });
    },
    UPDATE_PAY_TRIGER() {
      let ref = vue.$db.collection("users");
      ref.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(item) {
          if (item.data().payDateNoformat) {
            let date = item.data().payDateNoformat;
            date.setMonth(date.getMonth() + 1);
            if (date.valueOf() < new Date().valueOf()) {
              ref.doc(item.data().id).update({
                paid: false
              });
            }
          }
        });
      });
    },
    SET_COACH({ commit }, payload) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      vue.$db
        .collection("coach")
        .add({
          name: payload.name
        })
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    SET_TYPEWORKOUT({ commit }, payload) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      vue.$db
        .collection("typeWorkout")
        .add({
          name: payload
        })
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    SET_PAY_SUB({ commit, dispatch }, payload) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      vue.$db
        .collection("users")
        .doc(payload.id)
        .update({
          paid: true,
          datePayNoformat: new Date(),
          datePay: new Date().format("dd.mm.yyyy")
        })
        .then(function() {
          commit("SET_SUCCESS");
          dispatch("SEND_NEW_REPORT", {
            nameUser: payload.name,
            coach: payload.coach,
            nameGroup: payload.nameGroup,
            date: new Date().format("dd.mm.yyyy"),
            price: payload.subscription
          });
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    SEND_NEW_REPORT({ commit }, payload) {
      vue.$db
        .collection("paymentReports")
        .add({
          ...payload
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    GET_TYPEWORKOUT_LIST({ commit }) {
      let typeWorkoutList = [];
      vue.$db
        .collection("typeWorkout")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            typeWorkoutList.push(doc.data().name);
          });
        });
      commit("SET_TYPEWORKOUT_LIST", typeWorkoutList);
    },
    GET_COACH_LIST({ commit }) {
      let coachList = [];
      vue.$db
        .collection("coach")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            coachList.push(doc.data().name);
          });
        });
      commit("SET_COACH_LIST", coachList);
    },
    CREATE_GROUP({ commit }, payload) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      vue.$db
        .collection("groups")
        .doc(payload.id)
        .set({
          ...payload
        })
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    GET_ALL_GROUPS({ commit }) {
      let groups = [];
      vue.$db
        .collection("groups")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            groups.push(doc.data());
          });
        });
      commit("SET_ALL_GROUPS", groups);
    },
    GET_ALL_USERS({ commit }) {
      let users = [];
      vue.$db
        .collection("users")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            users.push(doc.data());
          });
        });
      commit("SET_ALL_USERS", users);
    },
    GET_USERS_BY_GROUP({ commit }, payload) {
      let users = [];
      vue.$db
        .collection("users")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (doc.data().uidGroup === payload) {
              users.push(doc.data());
            }
          });
        });
      commit("SET_USERS_BY_GROUP", users);
    },
    WRITE_USER_GROUP({ commit }, payload) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      vue.$db
        .collection("users")
        .doc(payload.id)
        .set({
          ...payload
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });

      let users, count;
      const refGroup = vue.$db.collection("groups").doc(payload.uidGroup);

      refGroup
        .get()
        .then(function(doc) {
          users = doc.data().users;
          count = doc.data().count;
          count = parseInt(count) - 1;
          users.push(payload.id);
          refGroup
            .update({
              count: count.toString(),
              users: users
            })
            .then(function() {
              commit("SET_SUCCESS");
            })
            .catch(function(error) {
              commit("SET_ERROR", error);
            });
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    WRITE_USER_SINGLE({ commit }, payload) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      vue.$db
        .collection("singleLesson")
        .add({
          ...payload
        })
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    DELETE_USER_GROUP({ commit }, payload) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      vue.$db
        .collection("users")
        .doc(payload.id)
        .delete()
        .then(function() {
          vue.$db
            .collection("groups")
            .doc(payload.uidGroup)
            .get()
            .then(function(doc) {
              let count = 0;
              let users = [];
              let newUsers = [];
              users = doc.data().users;
              count = doc.data().count;
              users.forEach(item => {
                if (item !== payload.id) {
                  newUsers.push(item);
                }
              });
              vue.$db
                .collection("groups")
                .doc(payload.uidGroup)
                .update({
                  count: parseInt(count) + 1,
                  users: newUsers
                })
                .then(function() {
                  commit("SET_SUCCESS");
                })
                .catch(function(error) {
                  commit("SET_ERROR", error);
                });
            })
            .catch(function(error) {
              commit("SET_ERROR", error);
            });
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    DELETE_GROUP({ commit }, payload) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      vue.$db
        .collection("groups")
        .doc(payload.id)
        .delete()
        .then(function() {
          if (payload.users) {
            payload.users.forEach(item => {
              vue.$db
                .collection("users")
                .doc(item)
                .delete()
                .catch(function(error) {
                  commit("SET_ERROR", error);
                });
            });
          }
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    }
  }
};
