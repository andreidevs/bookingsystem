import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css";
import ru from "vuetify/es5/locale/ru";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#2E7D32",
        secondary: "#757575",
        accent: "#FB8C00",
        error: "#E53935",
        info: "#2196F3",
        success: "#2E7D32",
        warning: "#FFFF00"
      }
    }
  },
  lang: {
    locales: { ru },
    current: "ru"
  },
  icons: {
    iconfont: "mdi",
    values: {}
  }
});
