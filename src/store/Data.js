import vue from "vue";

const axios = require("axios");
const telegramAPI =
  "https://api.telegram.org/bot1103706945:AAFblSSGaI0-GlSE6NslEyzPsWHunBW8rHQ/sendMessage?chat_id=-451337290&parse_mode=html&text";
export default {
  state: {
    coachList: [],
    typeWorkoutList: [],
    allGroups: [],
    allUsers: [],
    usersByGroup: [],
    usersSingle: [],
    usersIndiv: [],
    indivSofia: [],
    usersMini: [],
    singleHistory: []
  },
  getters: {
    COACH: s => s.coachList,
    TYPEWORKOUT: s => s.typeWorkoutList,
    ALLGROUPS: s => s.allGroups,
    ALLUSERS: s => s.allUsers,
    USERSBYGROUP: s => s.usersByGroup,
    ALLSINGLE: s => s.usersSingle,
    ALLINDIV: s => s.usersIndiv,
    ALLMINI: s => s.usersMini,
    SINGLEHISTORY: s => s.singleHistory,
    INDIVSOFIA: s => s.indivSofia
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
    SET_ALL_SINGLE(state, payload) {
      state.usersSingle = payload;
    },
    SET_ALL_INDIV(state, payload) {
      state.usersIndiv = payload;
    },
    SET_SOFIA_INDIV(state, payload) {
      state.indivSofia = payload;
    },
    SET_ALL_MINI(state, payload) {
      state.usersMini = payload;
    },
    SET_USERS_BY_GROUP(state, payload) {
      state.usersByGroup = payload;
    },
    SET_ALL_SINGLE_HISTORY(state, payload) {
      state.singleHistory = payload;
    }
  },

  actions: {
    SEND_FORM_TELEGRAM({ commit }, payload) {
      const res =
        payload.link !== undefined
          ? `${telegramAPI}=
      <b>${payload.text}</b> %0A<b>Имя:</b> ${payload.name}%0A<b>Телефон:</b>${payload.phone}%0A<b>Ссылка на удаление:</b>${payload.link}`
          : `${telegramAPI}=
       <b>${payload.text}</b> %0A<b>Имя:</b> ${payload.name}%0A<b>Телефон:</b>${payload.phone}`;
      axios
        .get(res)
        .then(function() {})
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    CHECK_PAY_DATE({ dispatch }) {
      vue.$db
        .collection("thisdate")
        .doc("0")
        .get()
        .then(function(doc) {
          if (doc.data().date !== new Date().format("dd.mm.yyyy")) {
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
      let refsIndiv = vue.$db.collection("usersIndiv");
      let refsIndivSofia = vue.$db.collection("indivSofia");
      let refsMini = vue.$db.collection("usersMini");
      refsIndiv.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(item) {
          refsIndiv.doc(item.data().id).update({
            paid: false
          });
        });
      });
      refsIndivSofia.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(item) {
          refsIndiv.doc(item.data().id).update({
            paid: false
          });
        });
      });
      refsMini.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(item) {
          refsMini.doc(item.data().id).update({
            paid: false
          });
        });
      });
      let ref = vue.$db.collection("usersGroup");
      ref.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(item) {
          if (item.data().datePayNoformat) {
            let timeDiff = Math.abs(
              new Date().getTime() - item.data().datePayNoformat.seconds * 1000
            );
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (diffDays > 30) {
              ref.doc(item.data().id).update({
                paid: false
              });
            }
          }
        });
      });
    },

    SET_TYPEWORKOUT({ commit }, payload) {
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
    SEND_PAY_SUB({ commit, dispatch }, payload) {
      vue.$db
        .collection("usersGroup")
        .doc(payload.id)
        .update({
          paid: true,
          datePayNoformat: new Date(),
          datePay: new Date().format("dd.mm.yyyy")
        })
        .then(function() {
          commit("SET_SUCCESS");
          // let d = new Date();
          // d.setMonth(d.getMonth() - 12);
          dispatch("SEND_PAY_REPORT", {
            name: payload.name,
            coach: payload.coach,
            type: "group",
            nameGroup: payload.nameGroup,
            date: new Date(),
            price: payload.subscription
          });
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    SEND_PAY_MINI({ commit, dispatch }, payload) {
      vue.$db
        .collection("usersMini")
        .doc(payload.id)
        .update({
          paid: true,
          datePayNoformat: new Date(),
          datePay: new Date().format("dd.mm.yyyy")
        })
        .then(function() {
          commit("SET_SUCCESS");
          dispatch("SEND_PAY_REPORT", {
            name: payload.name,
            coach: payload.coach,
            type: "mini",
            date: new Date(),
            price: payload.subscription
          });
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    SEND_PAY_INDIV({ commit, dispatch }, payload) {
      // let d = new Date();
      // d.setMonth(d.getMonth() - 12);
      vue.$db
        .collection("usersIndiv")
        .doc(payload.id)
        .update({
          paid: true,
          datePayNoformat: new Date(),
          datePay: new Date().format("dd.mm.yyyy")
        })
        .then(function() {
          commit("SET_SUCCESS");
          dispatch("SEND_PAY_REPORT", {
            name: payload.name,
            coach: payload.coach,
            type: "indiv",
            date: new Date(),
            price: payload.subscription
          });
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    SEND_PAY_SOFIA_INDIV({ commit, dispatch }, payload) {
      vue.$db
        .collection("indivSofia")
        .doc(payload.id)
        .update({
          paid: true,
          datePayNoformat: new Date(),
          datePay: new Date().format("dd.mm.yyyy")
        })
        .then(function() {
          commit("SET_SUCCESS");
          dispatch("SEND_PAY_REPORT", {
            name: payload.name,
            coach: payload.coach,
            type: "indiv",
            date: new Date(),
            price: payload.subscription
          });
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    SEND_PAY_SINGLE({ commit, dispatch }, payload) {
      vue.$db
        .collection("usersSingle")
        .doc(payload.id)
        .delete()
        .then(function() {
          dispatch("SEND_PAY_REPORT", {
            name: payload.name,
            coach: payload.coach,
            type: "single",
            date: new Date(),
            nameGroup: payload.nameGroup,
            price: payload.subscription
          });
          vue.$db
            .collection("historySingle")
            .add({ ...payload, datePay: new Date().format("dd.mm.yyyy") })
            .then(function() {
              commit("SET_SUCCESS");
            });
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
    GET_ALL_GROUPS({ commit, getters }) {
      let groups = [];
      vue.$db
        .collection("groups")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (!getters.USER.admin && getters.USER.isAuth) {
              if (getters.USER.name === doc.data().coach)
                groups.push(doc.data());
            } else {
              groups.push(doc.data());
            }
          });
        });
      commit("SET_ALL_GROUPS", groups);
    },
    GET_ALL_USERS({ commit, getters }) {
      let users = [];
      vue.$db
        .collection("usersGroup")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (!getters.USER.admin && getters.USER.isAuth) {
              if (getters.USER.name === doc.data().coach)
                users.push(doc.data());
            } else {
              users.push(doc.data());
            }
          });
        });
      commit("SET_ALL_USERS", users);
    },
    GET_ALL_SINGLE({ commit, getters }) {
      let users = [];
      vue.$db
        .collection("usersSingle")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (!getters.USER.admin && getters.USER.isAuth) {
              if (getters.USER.name === doc.data().coach)
                users.push(doc.data());
            } else {
              users.push(doc.data());
            }
          });
        });
      commit("SET_ALL_SINGLE", users);
    },
    GET_ALL_INDIV({ commit, getters }) {
      let users = [];
      vue.$db
        .collection("usersIndiv")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (!getters.USER.admin && getters.USER.isAuth) {
              if (getters.USER.name === doc.data().coach)
                users.push(doc.data());
            } else {
              users.push(doc.data());
            }
          });
        });
      commit("SET_ALL_INDIV", users);
    },
    GET_SOFIA_INDIV({ commit }) {
      let users = [];
      vue.$db
        .collection("indivSofia")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            users.push(doc.data());
          });
        });
      commit("SET_SOFIA_INDIV", users);
    },
    GET_ALL_MINI({ commit, getters }) {
      let users = [];
      vue.$db
        .collection("usersMini")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (!getters.USER.admin && getters.USER.isAuth) {
              if (getters.USER.name === doc.data().coach)
                users.push(doc.data());
            } else {
              users.push(doc.data());
            }
          });
        });
      commit("SET_ALL_MINI", users);
    },
    GET_USERS_BY_GROUP({ commit, getters }, payload) {
      let users = [];
      vue.$db
        .collection("usersGroup")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (doc.data().uidGroup === payload) {
              if (!getters.USER.admin && getters.USER.isAuth) {
                if (getters.USER.name === doc.data().coach)
                  users.push(doc.data());
              } else {
                users.push(doc.data());
              }
            }
          });
        });
      commit("SET_USERS_BY_GROUP", users);
    },
    GET_USERS_BY_MINI({ commit, getters }, payload) {
      let users = [];
      vue.$db
        .collection("usersMini")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (doc.data().uidGroup === payload) {
              if (!getters.USER.admin && getters.USER.isAuth) {
                if (getters.USER.name === doc.data().coach)
                  users.push(doc.data());
              } else {
                users.push(doc.data());
              }
            }
          });
        });
      commit("SET_USERS_BY_GROUP", users);
    },
    GET_ALL_SINGLE_HISTORY({ commit }) {
      let report = [];
      vue.$db
        .collection("historySingle")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            report.push(doc.data());
          });
        });
      commit("SET_ALL_SINGLE_HISTORY", report);
    },
    SUBSTRACT_COUNT_GROUP({ commit }, payload) {
      let users, count;
      const refGroup = vue.$db.collection("groups").doc(payload.uidGroup);

      refGroup.get().then(function(doc) {
        users = doc.data().users;
        count = doc.data().count;
        count = +count - 1;
        users.push(payload.id);
        refGroup
          .update({
            count: count.toString(),
            users: users
          })
          .catch(function(error) {
            commit("SET_ERROR", error);
          });
      });
    },
    WRITE_USER_GROUP({ commit, dispatch }, payload) {
      vue.$db
        .collection("usersGroup")
        .doc(payload.id)
        .set({
          ...payload
        })
        .then(function() {
          dispatch("SUBSTRACT_COUNT_GROUP", payload);
          if (!payload.sendT) {
            dispatch("SEND_FORM_TELEGRAM", {
              name: payload.name,
              phone: payload.phone,
              text: `Запись в группу ${payload.nameGroup} Оплата ${payload.subscription}`,
              link: `https://edemdance.web.app/admin/deleteuser/group/${payload.id}`
            });
          }
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    WRITE_USER_SINGLE({ commit, dispatch }, payload) {
      vue.$db
        .collection("usersSingle")
        .doc(payload.id)
        .set({
          ...payload
        })
        .then(function() {
          const text = "Разовое занятие" + " " + payload.nameGroup;
          if (!payload.sendT) {
            dispatch("SEND_FORM_TELEGRAM", {
              name: payload.name,
              phone: payload.phone,
              text,
              link: `https://edemdance.web.app/admin/deleteuser/single/${payload.id}`
            });
          }
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    WRITE_USER_INDIV({ commit }, payload) {
      vue.$db
        .collection("usersIndiv")
        .doc(payload.id)
        .set({
          ...payload
        })
        .then(function() {
          // const text = "Индивидуальное занятие";
          // dispatch("SEND_FORM_TELEGRAM", {
          //   name: payload.name,
          //   phone: payload.phone,
          //   text,
          //   link: `https://edemdance.web.app/admin/deleteuser/indiv/${payload.id}`
          // });
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    WRITE_USER_SOFIA_INDIV({ commit }, payload) {
      vue.$db
        .collection("indivSofia")
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
    WRITE_USER_MINI({ commit, dispatch }, payload) {
      vue.$db
        .collection("usersMini")
        .doc(payload.id)
        .set({
          ...payload
        })
        .then(function() {
          dispatch("SUBSTRACT_COUNT_GROUP", payload);
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    DELETE_USER_GROUP({ commit }, payload) {
      vue.$db
        .collection("usersGroup")
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
                  count: +count + 1,
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
    DELETE_USER_MINI({ commit }, payload) {
      vue.$db
        .collection("usersMini")
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
                  count: +count + 1,
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
    DELETE_USER_GROUP_BY_ID({ commit, dispatch }, payload) {
      let user = [];
      vue.$db
        .collection("usersGroup")
        .doc(payload)
        .get()
        .then(function(doc) {
          user = doc.data();
          dispatch("DELETE_USER_GROUP", user);
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    DELETE_USER_INDIV({ commit }, payload) {
      vue.$db
        .collection("usersIndiv")
        .doc(payload.id)
        .delete()
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    DELETE_USER_SOFIA_INDIV({ commit }, payload) {
      vue.$db
        .collection("indivSofia")
        .doc(payload.id)
        .delete()
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    DELETE_USER_SINGLE({ commit }, payload) {
      vue.$db
        .collection("usersSingle")
        .doc(payload.id)
        .delete()
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    DELETE_GROUP({ commit }, payload) {
      vue.$db
        .collection("groups")
        .doc(payload.id)
        .delete()
        .then(function() {
          if (payload.users) {
            payload.users.forEach(item => {
              vue.$db
                .collection("usersGroup")
                .doc(item)
                .delete()
                .then(function() {
                  commit("SET_SUCCESS");
                })
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
