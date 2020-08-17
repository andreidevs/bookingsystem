import vue from "vue";
export default {
  state: {
    reports: [],
    payReports: [],
    expenses: []
  },
  getters: {
    REPORTS: s => s.reports,
    PAYREPORTS: s => s.payReports,
    EXPENSES: s => s.expenses
  },
  mutations: {
    SET_REPORTS(state, payload) {
      state.reports = payload;
    },
    SET_ALL_PAY(state, payload) {
      state.payReports = payload;
    },
    SET_EXPENSES(state, payload) {
      state.expenses = payload;
    }
  },
  actions: {
    SEND_DAILY: async ({ commit }, payload) => {
      await vue.$db
        .collection("reportsDaily")
        .doc(
          payload.coach +
            "-" +
            payload.day +
            "-" +
            payload.month +
            "-" +
            payload.year
        )
        .set({
          ...payload
        })
        .then(function() {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    SEND_PAY_REPORT: async ({ commit }, payload) => {
      const id = Math.random()
        .toString(36)
        .substr(2, 11);
      const date = new Date().getMonth() + 1 + "-" + new Date().getFullYear();
      await vue.$db
        .collection("reportPay")
        .doc(date)
        .update({
          [id]: payload
        })
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function() {
          vue.$db
            .collection("reportPay")
            .doc(date)
            .set({
              [id]: payload
              // month: new Date().getMonth(),
              // year: new Date().getFullYear()
            })
            .then(function() {
              commit("SET_SUCCESS");
              return "success";
            })
            .catch(function(error) {
              commit("SET_ERROR", error);
              return error;
            });
        });
    },
    GET_ALL_PAY: async ({ commit }) => {
      let report = [];
      await vue.$db
        .collection("reportPay")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            report.push(doc.data());
          });
        });
      commit("SET_ALL_PAY", report);
      return report;
    },
    GET_REPORTS: async ({ commit }) => {
      const reports = [];
      await vue.$db
        .collection("reportsDaily")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            reports.push(doc.data());
          });
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
          return error;
        });

      commit("SET_REPORTS", reports);
      return reports;
    },
    SEND_EXPENSES: async ({ commit }, payload) => {
      await vue.$db
        .collection("expenses")
        .doc(payload.id)
        .set({ ...payload })
        .then(function() {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
          return error;
        });
    },
    GET_EXPENSES: async ({ commit }) => {
      let report = [];
      await vue.$db
        .collection("expenses")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            report.push(doc.data());
          });
        });
      commit("SET_EXPENSES", report);
      return report;
    },
    DELETE_EXPENSES: async ({ commit }, payload) => {
      await vue.$db
        .collection("expenses")
        .doc(payload.id)
        .delete()
        .then(function() {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
          return error;
        });
    }
  }
};
