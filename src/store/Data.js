import vue from "vue";
export default {
  state: {
    coachList: [],
    typeWorkoutList: [],
    allGroups: []
  },
  getters: {
    COACH: s => s.coachList,
    TYPEWORKOUT: s => s.typeWorkoutList,
    ALLGROUPS: s => s.allGroups
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
    }
  },
  actions: {
    SET_COACH({ commit }, payload) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      vue.$db
        .collection("coach")
        .add({
          name: payload.name
        })
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    SET_TYPEWORKOUT({ commit }, payload) {
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
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
      commit("CLEAR_SUCCESS");
      commit("CLEAR_ERROR");
      vue.$db
        .collection("groups")
        .add({
          ...payload
        })
        .then(function() {
          commit("SET_SUCCESS");
        })
        .catch(function(error) {
          commit("SET_ERROR", error);
        });
    },
    GET_ALL_GROUPS({ commit }) {
      let groups = [];
      vue.$db
        .collection("groups")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            groups.push(doc.data());
          });
        });
      commit("SET_ALL_GROUPS", groups);
    }
  }
};
