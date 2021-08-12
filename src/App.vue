<template>
  <v-app>
    <router-view v-if="layout == 'undefined-layout'" />
    <component v-else :is="layout">
      <!-- <keep-alive exclude="AdminReports"> -->
      <router-view />
      <!-- </keep-alive> -->
      <v-alert
        v-if="internetError"
        color="red"
        type="error"
        style="position: fixed; bottom: 1rem; right: 1rem"
        >Нет интернет соединения</v-alert
      >
    </component>
    <notifications group="app" />
  </v-app>
</template>

<script>
import AdminLayout from "@/layouts/adminLayout";
export default {
  name: "App",
  computed: {
    layout() {
      return this.$route.meta.layout + "-layout";
    }
  },

  components: {
    AdminLayout
  },
  created() {
    if (this.$workbox) {
      this.$workbox.addEventListener("waiting", () => {
        this.showUpgradeUI = true;
      });
    }
    window.addEventListener("offline", () => {
      this.internetError = true;
    });
    window.addEventListener("online", () => {
      this.internetError = false;
      this.$notify({
        group: "app",
        type: "info",
        title: "Соединение восстановлено"
      });
    });
  },
  methods: {
    async accept() {
      this.showUpgradeUI = false;
      await this.$workbox.messageSW({ type: "SKIP_WAITING" });
    }
  },

  data: () => ({
    internetError: false
  })
};
</script>
