<template>
  <v-container>
    <v-content>
      <v-btn @click="logout" dense>logout</v-btn>
    </v-content>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  components: {},
  computed: {
    ...mapGetters({
      isAuth: "USER_AUTH"
    })
  },
  methods: {
    ...mapActions({
      logout: "LOGOUT"
    })
  }
};
</script>

<style></style>
