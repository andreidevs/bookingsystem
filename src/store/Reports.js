import vue from "vue";
export default {
  state: {
    reports: []
  },
  getters: {
    REPORTS: s => s.reports
  },
  mutations: {
    SET_REPORTS(state, payload) {
      state.reports = payload;
    }
  },
  actions: {
    SEND_DAILY({ commit, getters }, payload) {
      vue.$db
        .collection("reports")
        .doc(getters.USER.name + "-" + new Date().format("mm-yyyy"))
        .update({
          ...payload,
          coach: getters.USER.name,
          month: new Date().getMonth(),
          year: new Date().getFullYear()
        })
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function() {
          vue.$db
            .collection("reports")
            .doc(getters.USER.name + "-" + new Date().format("mm-yyyy"))
            .set({
              ...payload,
              coach: getters.USER.name,
              month: new Date().getMonth(),
              year: new Date().getFullYear()
            })
            .then(function() {
              commit("SET_SUCCESS");
            })
            .catch(function(error) {
              commit("SET_ERROR", error);
            });
        });
    },
    SEND_PAY_REPORT({ commit }, payload) {
      vue.$db
        .collection("reportPay")
        .add({
          ...payload
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    GET_REPORTS({ commit }) {
      const reports = [];
      vue.$db
        .collection("reports")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            reports.push(doc.data());
          });
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });

      commit("SET_REPORTS", reports);
    }
  }
};
