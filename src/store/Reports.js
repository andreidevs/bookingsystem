import vue from "vue";
export default {
  state: {
    reports: [],
    payReports: []
  },
  getters: {
    REPORTS: s => s.reports,
    PAYREPORTS: s => s.payReports
  },
  mutations: {
    SET_REPORTS(state, payload) {
      state.reports = payload;
    },
    SET_ALL_PAY(state, payload) {
      state.payReports = payload;
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
      const id = Math.random()
        .toString(36)
        .substr(2, 11);
      vue.$db
        .collection("reportPay")
        .doc(new Date().format("mm-yyyy"))
        .update({
          [id]: payload
        })
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function() {
          vue.$db
            .collection("reportPay")
            .doc(new Date().format("mm-yyyy"))
            .set({
              [id]: payload
              // month: new Date().getMonth(),
              // year: new Date().getFullYear()
            })
            .then(function() {
              commit("SET_SUCCESS");
            })
            .catch(function(error) {
              commit("SET_ERROR", error);
            });
        });
    },
    GET_ALL_PAY({ commit }) {
      let report = [];
      vue.$db
        .collection("reportPay")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            report.push(doc.data());
          });
        });
      commit("SET_ALL_PAY", report);
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
