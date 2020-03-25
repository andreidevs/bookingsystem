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
        primary: "#004D40",
        secondary: "#69F0AE",
        accent: "#FB8C00",
        error: "#E53935",
        info: "#6A1B9A",
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
