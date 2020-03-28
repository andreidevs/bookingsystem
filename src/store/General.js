export default {
  state: {
    error: null,
    success: {
      is: false,
      text: null
    }
  },
  getters: {
    ERROR: s => s.error,
    SUCCESS: s => s.success
  },
  mutations: {
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
