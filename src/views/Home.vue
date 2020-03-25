<template>
  <v-container>
    <v-content>
      <v-btn @click="logouts" dense>logout</v-btn>
      <v-btn href="/admin" dense>admin</v-btn>
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
    }),
    logouts() {
      this.logout();
      this.$notify({
        group: "app",
        type: "success",
        text: "Вы вышли"
      });
    }
  }
};
</script>

<style></style>
