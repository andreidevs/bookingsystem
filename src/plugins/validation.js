const validation = {
  required: [v => !!v || "Обязательно для заполнения"],
  phone: [
    v => !!v || "Обязательно для заполнения",
    v => (v && v.length > 15) || "Не верный формат номера"
  ],
  email: [v => /.+@.+\..+/.test(v) || "E-mail введен некорректно"]
};

export default {
  install(Vue) {
    Vue.prototype.$validation = validation;
  }
};
