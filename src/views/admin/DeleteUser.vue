<template>
  <v-container>
    <div class="text-center d-flex flex-column ">
      <v-btn color="success" @click="delet">Удалить</v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions({
      deleteUserGroup: "DELETE_USER_GROUP_BY_ID",
      deleteUserMini: "DELETE_USER_MINI",
      deleteUserSingle: "DELETE_USER_SINGLE"
    }),
    delet() {
      if (this.$route.params["type"] === "single") {
        this.deleteUserSingle({ id: this.$route.params["id"] });
        this.$router.push("/");
      } else if (this.$router.currentRoute.params["type"] === "mini") {
        this.deleteUserMini(this.$route.params["id"]);
      } else if (this.$router.currentRoute.params["type"] === "group") {
        this.deleteUserGroup(this.$route.params["id"]);
        this.$router.push("/");
      }
    }
  }
};
</script>

<style></style>
