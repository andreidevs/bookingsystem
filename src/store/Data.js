import vue from "vue";

const axios = require("axios");
const telegramAPI =
  "https://api.telegram.org/bot1103706945:AAFblSSGaI0-GlSE6NslEyzPsWHunBW8rHQ/sendMessage?chat_id=-451337290&parse_mode=html&text=";
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
    SET_COACH_GROUPS() { },
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
    GET_REPORT_DAILY_USER: async ({ commit }, payload) => {
      let data = [];
      await vue.$db
        .collection("reportsDaily")
        .where("year", "==", new Date().getFullYear())
        .where("month", "==", payload.month)
        .where("coach", "==", payload.name)
        .orderBy("day")
        .get()

        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            data.push(doc.data());
          });
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
        });
      return data;
    },
    SEND_FORM_TELEGRAM({ commit }, payload) {
      const res =
        payload.link !== undefined
          ? `
      <b>${payload.text}</b> <b>Имя:</b> ${payload.name} <b>Телефон:</b>${payload.phone} <b>Ссылка на удаление:</b>${payload.link}`
          : `
       <b>${payload.text}</b> <b>Имя:</b> ${payload.name} <b>Телефон:</b>${payload.phone}`;

      axios
        .get(telegramAPI + encodeURIComponent(res))
        .then(function () { })
        .catch(function (error) {
          commit("SET_ERROR", error);
        });
    },
    CHECK_PAY_DATE({ dispatch }) {
      vue.$db
        .collection("thisdate")
        .doc("0")
        .get()
        .then(function (doc) {
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
      refsIndiv.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (item) {
          refsIndiv.doc(item.data().id).update({
            paid: false
          });
        });
      });
      refsIndivSofia.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (item) {
          refsIndiv.doc(item.data().id).update({
            paid: false
          });
        });
      });
      refsMini.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (item) {
          refsMini.doc(item.data().id).update({
            paid: false
          });
        });
      });
      let refGroup = vue.$db.collection("usersGroup");
      refGroup.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (item) {
          if (item.data().datePayNoformat) {
            let timeDiff = Math.abs(
              new Date().getTime() - item.data().datePayNoformat.seconds * 1000
            );
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (diffDays > 15) {
              refGroup.doc(item.data().id).update({
                paid: false
              });
            }
          }
        });
      });
    },

    SET_TYPEWORKOUT: async ({ commit }, payload) => {
      await vue.$db
        .collection("typeWorkout")
        .add({
          name: payload
        })
        .then(function () {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },

    SEND_PAY_SUB: async ({ commit, dispatch }, payload) => {
      await vue.$db
        .collection("usersGroup")
        .doc(payload.id)
        .update({
          paid: true,
          datePayNoformat: new Date(),
          datePay: new Date().format("dd.mm.yyyy")
        })
        .then(function () {
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
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    SEND_PAY_MINI: async ({ commit, dispatch }, payload) => {
      await vue.$db
        .collection("usersMini")
        .doc(payload.id)
        .update({
          paid: true,
          datePayNoformat: new Date(),
          datePay: new Date().format("dd.mm.yyyy")
        })
        .then(function () {
          dispatch("SEND_PAY_REPORT", {
            name: payload.name,
            coach: payload.coach,
            nameGroup: payload.nameGroup,
            type: "mini",
            date: new Date(),
            price: payload.subscription
          });
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    SEND_PAY_INDIV: async ({ commit, dispatch }, payload) => {
      // let d = new Date();
      // d.setMonth(d.getMonth() - 12);
      await vue.$db
        .collection("usersIndiv")
        .doc(payload.id)
        .update({
          paid: true,
          datePayNoformat: new Date(),
          datePay: new Date().format("dd.mm.yyyy")
        })
        .then(function () {
          dispatch("SEND_PAY_REPORT", {
            name: payload.name,
            coach: payload.coach,
            type: "indiv",
            date: new Date(),
            price: payload.subscription
          });
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    SEND_PAY_SOFIA_INDIV: async ({ commit, dispatch }, payload) => {
      await vue.$db
        .collection("indivSofia")
        .doc(payload.id)
        .update({
          paid: true,
          datePayNoformat: new Date(),
          datePay: new Date().format("dd.mm.yyyy")
        })
        .then(function () {
          dispatch("SEND_PAY_REPORT", {
            name: payload.name,
            coach: payload.coach,
            type: "indiv",
            date: new Date(),
            price: payload.subscription
          });
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    SEND_PAY_SINGLE: async ({ commit, dispatch }, payload) => {
      await vue.$db
        .collection("usersSingle")
        .doc(payload.id)
        .delete()
        .then(function () {
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
            .then(function () {
              commit("SET_SUCCESS");
              return "success";
            });
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    GET_TYPEWORKOUT_LIST({ commit }) {
      let typeWorkoutList = [];
      vue.$db
        .collection("typeWorkout")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            typeWorkoutList.push(doc.data().name);
          });
        });
      commit("SET_TYPEWORKOUT_LIST", typeWorkoutList);
      return typeWorkoutList;
    },
    GET_COACH_LIST: async ({ commit }) => {
      let coachList = [];
      await vue.$db
        .collection("coach")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            coachList.push(doc.data().name);
          });
        });
      commit("SET_COACH_LIST", coachList);
      return coachList;
    },
    GET_COACH_GROUPS: async ({ commit }, { date }) => {
      let groupList = [];
      await vue.$db
        .collection("groups")
        .doc(date)
        .get()
        .then(doc => {
          groupList = doc.data();
        });
      commit("SET_COACH_GROUPS");

      return groupList;
    },
    CREATE_GROUP: async ({ commit }, payload) => {
      await vue.$db
        .collection("groups")
        .doc(payload.id)
        .set({
          ...payload
        })
        .then(function () {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    GET_ALL_GROUPS: async ({ commit, getters }, trigger) => {
      let groups = [];
      await vue.$db
        .collection("groups")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (!trigger) {
              if (!getters.USER.admin && getters.USER.isAuth) {
                if (getters.USER.name === doc.data().coach)
                  groups.push(doc.data());
              } else {
                groups.push(doc.data());
              }
            } else {
              groups.push(doc.data());
            }
          });
        });
      commit("SET_ALL_GROUPS", groups);
      return groups;
    },
    GET_ALL_USERS: async ({ commit, getters }) => {
      let users = [];
      await vue.$db
        .collection("usersGroup")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (!getters.USER.admin && getters.USER.isAuth) {
              if (getters.USER.name === doc.data().coach)
                users.push(doc.data());
            } else {
              users.push(doc.data());
            }
          });
        });
      commit("SET_ALL_USERS", users);
      return users;
    },
    GET_ALL_SINGLE: async ({ commit, getters }) => {
      let users = [];
      await vue.$db
        .collection("usersSingle")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (!getters.USER.admin && getters.USER.isAuth) {
              if (getters.USER.name === doc.data().coach)
                users.push(doc.data());
            } else {
              users.push(doc.data());
            }
          });
        });
      commit("SET_ALL_SINGLE", users);
      return users;
    },
    GET_ALL_INDIV: async ({ commit, getters }, trigger) => {
      let users = [];
      await vue.$db
        .collection("usersIndiv")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (!trigger) {
              if (!getters.USER.admin && getters.USER.isAuth) {
                if (getters.USER.name === doc.data().coach)
                  users.push(doc.data());
              } else {
                users.push(doc.data());
              }
            } else {
              users.push(doc.data());
            }
          });
        });
      commit("SET_ALL_INDIV", users);
      return users;
    },
    GET_SOFIA_INDIV: async ({ commit }) => {
      let users = [];
      await vue.$db
        .collection("indivSofia")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            users.push(doc.data());
          });
        });
      commit("SET_SOFIA_INDIV", users);
      return users;
    },
    GET_ALL_MINI: async ({ commit, getters }) => {
      let users = [];
      await vue.$db
        .collection("usersMini")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (!getters.USER.admin && getters.USER.isAuth) {
              if (getters.USER.name === doc.data().coach)
                users.push(doc.data());
            } else {
              users.push(doc.data());
            }
          });
        });
      commit("SET_ALL_MINI", users);
      return users;
    },
    GET_USERS_BY_GROUP: async ({ commit, getters }, payload) => {
      let users = [];
      await vue.$db
        .collection("usersGroup")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
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
      return users;
    },
    GET_USERS_BY_MINI: async ({ commit, getters }, payload) => {
      let users = [];
      await vue.$db
        .collection("usersMini")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
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
      return users;
    },
    GET_ALL_SINGLE_HISTORY: async ({ commit }) => {
      let report = [];
      await vue.$db
        .collection("historySingle")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            report.push(doc.data());
          });
        });
      commit("SET_ALL_SINGLE_HISTORY", report);
      return report;
    },
    SUBSTRACT_COUNT_GROUP: async ({ commit }, payload) => {
      let users, count;
      const refGroup = await vue.$db.collection("groups").doc(payload.uidGroup);

      await refGroup.get().then(function (doc) {
        users = doc.data().users;
        count = doc.data().count;
        count = parseInt(count) - 1;
        users.push(payload.id);
        refGroup
          .update({
            count: count.toString(),
            users: users
          })
          .catch(function (error) {
            commit("SET_ERROR", error);
            return error;
          });
      });
    },
    WRITE_USER_GROUP: async ({ commit, dispatch }, payload) => {
      await vue.$db
        .collection("usersGroup")
        .doc(payload.id)
        .set({
          ...payload
        })
        .then(function () {
          dispatch("SUBSTRACT_COUNT_GROUP", payload);
          if (!payload.sendT) {
            dispatch("SEND_FORM_TELEGRAM", {
              name: payload.name,
              phone: payload.phone,
              text: `Запись в группу ${payload.nameGroup} Оплата ${payload.subscription}`,
              link: `https://crm.edemdance.kz/deleteuser/group/${payload.id}`
            });
          }
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    WRITE_USER_SINGLE: async ({ commit, dispatch }, payload) => {
      await vue.$db
        .collection("usersSingle")
        .doc(payload.id)
        .set({
          ...payload
        })
        .then(function () {
          const text = "Разовое занятие" + " " + payload.nameGroup;
          if (!payload.sendT) {
            dispatch("SEND_FORM_TELEGRAM", {
              name: payload.name,
              phone: payload.phone,
              text,
              link: `https://crm.edemdance.kz/deleteuser/single/${payload.id}`
            });
          }
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    WRITE_USER_INDIV: async ({ commit }, payload) => {
      await vue.$db
        .collection("usersIndiv")
        .doc(payload.id)
        .set({
          ...payload
        })
        .then(function () {
          // const text = "Индивидуальное занятие";
          // dispatch("SEND_FORM_TELEGRAM", {
          //   name: payload.name,
          //   phone: payload.phone,
          //   text,
          //   link: `https://edemdance.web.app/admin/deleteuser/indiv/${payload.id}`
          // });
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    WRITE_USER_SOFIA_INDIV: async ({ commit }, payload) => {
      await vue.$db
        .collection("indivSofia")
        .doc(payload.id)
        .set({
          ...payload
        })
        .then(function () {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    WRITE_USER_MINI: async ({ commit, dispatch }, payload) => {
      vue.$db
        .collection("usersMini")
        .doc(payload.id)
        .set({
          ...payload
        })
        .then(function () {
          dispatch("SUBSTRACT_COUNT_GROUP", payload);
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    UPDATE_USER_GROUP: async ({ commit }, payload) => {
      await vue.$db
        .collection("usersGroup")
        .doc(payload.id)
        .update({
          name: payload.name,
          nameGroup: payload.group,
          phone: payload.phone,
          subscription: payload.price,
          coach: payload.coach,
          uidGroup: payload.uidGroup
        })
        .then(function () {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    UPDATE_USER_MINI: async ({ commit }, payload) => {
      await vue.$db
        .collection("usersMini")
        .doc(payload.id)
        .update({
          name: payload.name,
          nameGroup: payload.group,
          phone: payload.phone,
          subscription: payload.price,
          coach: payload.coach,
          uidGroup: payload.uidGroup
        })
        .then(function () {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    UPDATE_USER_SINGLE: async ({ commit }, payload) => {
      await vue.$db
        .collection("usersSingle")
        .doc(payload.id)
        .update({
          name: payload.name,
          phone: payload.phone,
          subscription: payload.price,
          coach: payload.coach
        })
        .then(function () {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    UPDATE_USER_INDIV: async ({ commit }, payload) => {
      await vue.$db
        .collection("usersIndiv")
        .doc(payload.id)
        .update({
          name: payload.name,
          phone: payload.phone,
          subscription: payload.price,
          coach: payload.coach,
          time: payload.time,
          title: payload.title,
          weekDays: payload.weekDays
        })
        .then(function () {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    UPDATE_GROUP_USERS_TO_USERS: async ({ commit }, payload) => {
      await vue.$db
        .collection("groups")
        .doc(payload.fromGroup)
        .get()
        .then(function (doc) {
          let count = 0;
          let users = [];
          let newUsers = [];
          users = doc.data().users;
          count = doc.data().count;
          newUsers = users.filter(item => item !== payload.userId);
          vue.$db
            .collection("groups")
            .doc(payload.fromGroup)
            .update({
              count: parseInt(count) + 1,
              users: newUsers
            })
            .then(function () {
              vue.$db
                .collection("groups")
                .doc(payload.toGroup)
                .get()
                .then(function (doc) {
                  let count = 0;
                  let users = [];

                  users = doc.data().users;
                  count = doc.data().count;
                  users.push(payload.userId);
                  vue.$db
                    .collection("groups")
                    .doc(payload.toGroup)
                    .update({
                      count: parseInt(count) - 1,
                      users
                    })
                    .then(function () {
                      return "success";
                    })
                    .catch(function (error) {
                      commit("SET_ERROR", error);
                      return error;
                    });
                });
            })
            .catch(function (error) {
              commit("SET_ERROR", error);
              return error;
            });
        });
    },
    DELETE_USER_GROUP: async ({ commit }, payload) => {
      await vue.$db
        .collection("usersGroup")
        .doc(payload.id)
        .delete()
        .then(function () {
          vue.$db
            .collection("groups")
            .doc(payload.uidGroup)
            .get()
            .then(function (doc) {
              let count = 0;
              let users = [];
              let newUsers = [];
              users = doc.data().users;
              count = doc.data().count;
              newUsers = users.filter(item => item !== payload.id);
              vue.$db
                .collection("groups")
                .doc(payload.uidGroup)
                .update({
                  count: parseInt(count) + 1,
                  users: newUsers
                })
                .then(function () {
                  commit("SET_SUCCESS");
                  return "success";
                })
                .catch(function (error) {
                  commit("SET_ERROR", error);
                  return error;
                });
            })
            .catch(function (error) {
              commit("SET_ERROR", error);
              return error;
            });
        });
    },
    DELETE_USER_MINI: async ({ commit }, payload) => {
      await vue.$db
        .collection("usersMini")
        .doc(payload.id)
        .delete()
        .then(function () {
          vue.$db
            .collection("groups")
            .doc(payload.uidGroup)
            .get()
            .then(function (doc) {
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
                .then(function () {
                  commit("SET_SUCCESS");
                  return "success";
                })
                .catch(function (error) {
                  commit("SET_ERROR", error);
                  return error;
                });
            })
            .catch(function (error) {
              commit("SET_ERROR", error);
              return error;
            });
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    DELETE_USER_GROUP_BY_ID: async ({ commit, dispatch }, payload) => {
      let user = [];
      await vue.$db
        .collection("usersGroup")
        .doc(payload)
        .get()
        .then(function (doc) {
          user = doc.data();
          dispatch("DELETE_USER_GROUP", user);
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    DELETE_USER_INDIV: async ({ commit }, payload) => {
      await vue.$db
        .collection("usersIndiv")
        .doc(payload.id)
        .delete()
        .then(function () {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    DELETE_USER_SOFIA_INDIV: async ({ commit }, payload) => {
      await vue.$db
        .collection("indivSofia")
        .doc(payload.id)
        .delete()
        .then(function () {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    DELETE_USER_SINGLE: async ({ commit }, payload) => {
      await vue.$db
        .collection("usersSingle")
        .doc(payload.id)
        .delete()
        .then(function () {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    DELETE_GROUP: async ({ commit }, payload) => {
      await vue.$db
        .collection("groups")
        .doc(payload.id)
        .delete()
        .then(function () {
          if (payload.users) {
            payload.users.forEach(item => {
              vue.$db
                .collection("usersGroup")
                .doc(item)
                .delete()
                .then(function () {
                  commit("SET_SUCCESS");
                  return "success";
                })
                .catch(function (error) {
                  commit("SET_ERROR", error);
                  return error;
                });
            });
          }
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    }
  }
};
