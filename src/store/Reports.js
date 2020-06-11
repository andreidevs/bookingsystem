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
    SEND_DAILY({ commit }, payload) {
      vue.$db
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
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    SEND_PAY_REPORT({ commit }, payload) {
      const id = Math.random()
        .toString(36)
        .substr(2, 11);
      const date = new Date().getMonth() + 1 + "-" + new Date().getFullYear();
      vue.$db
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
        .collection("reportsDaily")
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
    },
    SEND_EXPENSES({ commit }, payload) {
      vue.$db
        .collection("expenses")
        .doc(payload.id)
        .set({ ...payload })
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    GET_EXPENSES({ commit }) {
      let report = [];
      vue.$db
        .collection("expenses")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            report.push(doc.data());
          });
        });
      commit("SET_EXPENSES", report);
    },
    DELETE_EXPENSES({ commit }, payload) {
      vue.$db
        .collection("expenses")
        .doc(payload.id)
        .delete()
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    }
  }
};
