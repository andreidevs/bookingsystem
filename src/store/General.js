export default {
  state: {
    processing: null,
    error: null
  },
  getters: {
    PROCESSING: s => s.processing,
    ERROR: s => s.error
  },
  mutations: {
    SET_PROCESSING(state, payload) {
      state.processing = payload;
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    }
  }
};
