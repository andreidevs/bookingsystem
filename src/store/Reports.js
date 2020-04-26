import vue from "vue";
export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    SEND_DAILY({ commit, getters }, payload) {
      vue.$db
        .collection("report-" + getters.USER.name)
        .doc(new Date().format("mm-yyyy"))
        .update({
          ...payload
        })
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function() {
          vue.$db
            .collection("report-" + getters.USER.name)
            .doc(new Date().format("mm-yyyy"))
            .set({
              ...payload
            })
            .then(function() {
              commit("SET_SUCCESS");
            })
            .catch(function(error) {
              commit("SET_ERROR", error);
            });
        });
    }
  }
};
