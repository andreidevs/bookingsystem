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
import { mapActions, mapGetters } from "vuex";
export default {
  name: "App",
  computed: {
    layout() {
      return this.$route.meta.layout + "-layout";
    },
    ...mapGetters({
      config: "GENERAL"
    })
  },
  data() {
    return {
      colorsItems: [
        "accent",
        "info",
        "primary",
        "error",
        "secondary",
        "warning",
        "success"
      ],
      internetError: false
    };
  },
  components: {
    AdminLayout
  },

  async created() {
    this.colorsItems.forEach(el => {
      let color = JSON.parse(localStorage.getItem(`${el}`));
      this.$vuetify.theme.themes.light[el] = color;
    });
    await this.getConfig();
    if (this.$workbox) {
      this.$workbox.addEventListener("waiting", () => {
        this.showUpgradeUI = true;
      });
    }

    // CHANGE MAIN COLORSS
    if (this.config) {
      Object.keys(this.config.mainColors).forEach(i => {
        this.$vuetify.theme.themes.light[i] = this.config.mainColors[i];
        localStorage.setItem(`${i}`, JSON.stringify(this.config.mainColors[i]));
      });
    } else {
      this.$notify({
        group: "app",
        type: "error",
        title: "Заполните основные настройки!!"
      });
      this.$router.push("/general");
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
    ...mapActions({
      getConfig: "GET_CONFIG"
    }),
    async accept() {
      this.showUpgradeUI = false;
      await this.$workbox.messageSW({ type: "SKIP_WAITING" });
    }
  }
};
</script>
