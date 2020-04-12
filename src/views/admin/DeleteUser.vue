<template>
  <v-container>
    <div class="text-center d-flex flex-column ">
      <span class="mb-12">Удалить ученика </span>
      <v-btn color="success" @click="delet">text</v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  watch: {
    success(is) {
      if (is != null) {
        this.$notify({
          group: "app",
          type: "info",
          title: "Успешно"
        });
      }
    },
    error(error) {
      if (error != null) {
        this.$notify({
          group: "app",
          type: "error",
          title: "Ошибка",
          text: error
        });
      }
    }
  },
  computed: {
    ...mapGetters({
      error: "ERROR",
      success: "SUCCESS"
    })
  },
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
