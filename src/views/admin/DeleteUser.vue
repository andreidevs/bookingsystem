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
      deleteUserSingle: "DELETE_USER_SINGLE"
    }),
    delet() {
      if (this.$router.currentRoute.params["type"] === "single") {
        this.deleteUserSingle({ id: this.$router.currentRoute.params["id"] });
      } else {
        this.deleteUserGroup(this.$router.currentRoute.params["id"]);
      }
    }
  }
};
</script>

<style></style>
