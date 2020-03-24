<template>
  <v-form ref="form" v-model="valid" :lazy-validation="lazy">
    <v-text-field
      v-model="email"
      label="Email"
      clearable
      required
      outlined
      :rules="emailRules"
    ></v-text-field>

    <v-text-field
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show1 ? 'text' : 'password'"
      class="input-group--focused"
      @click:append="show1 = !show1"
      v-model="password"
      label="Пароль"
      required
      clearable
      outlined
      :rules="passwordRules"
    ></v-text-field>

    <v-btn
      flat
      class="mr-4"
      @click="submit"
      color="success"
      :loading="loading"
      outlined
    >
      <v-icon>mdi-login</v-icon>
      Войти
    </v-btn>
    <!-- <router-link to="/restore">
      <v-btn class="mr-4" outlined color="warning">
        Забыли пароль?
      </v-btn>
    </router-link> -->
  </v-form>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  components: {},

  data: () => ({
    showPassword: false,
    email: "",
    password: "",
    show1: false,
    alert: false,
    valid: true,
    loading: false,
    passwordRules: [
      v => !!v || "Обязательное поле",
      v => (v && v.length >= 8) || "Пароль должен быть не меньше 8 символов"
    ],
    emailRules: [
      v => !!v || "Обязательное поле",
      v => /.+@.+\..+/.test(v) || "Поле E-mail не верно"
    ],
    lazy: false
  }),
  watch: {
    isAuth(val) {
      if (val === true) {
        this.$notify({
          group: "app",
          type: "success",
          text: "Успешный вход"
        });
        this.loading = false;
      }
    },
    error(error) {
      this.$notify({
        group: "app",
        type: "error",
        title: "Ошибка",
        text: error
      });
      this.loading = false;
      this.clearError();
    }
  },
  computed: {
    ...mapGetters({
      error: "ERROR",
      processing: "PROCESSING",
      isAuth: "USER_AUTH"
    })
  },

  methods: {
    ...mapActions({
      signIn: "SIGNIN"
    }),
    ...mapMutations({
      clearError: "CLEAR_ERROR"
    }),

    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.signIn({ email: this.email, password: this.password });
      }
    }
  }
};
</script>
