import vue from "vue";
export default {
  state: {
    error: null,
    general: {},
    success: {
      is: false,
      text: null
    }
  },
  getters: {
    ERROR: s => s.error,
    SUCCESS: s => s.success,
    GENERAL: s => s.general
  },
  actions: {
    GET_CONFIG: async ({ commit }) => {
      let data = [];
      await vue.$db
        .collection("general")
        .get()

        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            data.push(doc.data());
          });
          commit("set_general", data);
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
        });
    },
    SAVE_GENERAL: async ({ commit }, payload) => {
      await vue.$db
        .collection("general")
        .doc("main")
        .set(payload)
        .then(function () {
          commit("SET_SUCCESS");
          return "success";
        })
        .catch(function (error) {
          commit("SET_ERROR", error);
          return error;
        });
    }
  },
  mutations: {
    set_general(state, values) {
      state.general = values[0];
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    },
    SET_SUCCESS(state) {
      state.success = true;
    },
    CLEAR_SUCCESS(state) {
      state.success = null;
    }
  }
};
