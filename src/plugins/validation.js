const validation = {
  required: [v => !!v || "Обязательно для заполнения"],
  phone: [
    v => !!v || "Обязательно для заполнения",
    v => (v && v.length > 15) || "Не верный формат номера"
  ],
  password: [
    v => !!v || "Обязательно для заполнения",
    v => (v && v.length > 7) || "Пароль должн быть не меньше 8 символов"
  ],
  email: [
    v => !!v || "Обязательное поле",
    v => /.+@.+\..+/.test(v) || "Поле E-mail имеет не правильный формат"
  ]
};

export default {
  install(Vue) {
    Vue.prototype.$validation = validation;
  }
};
