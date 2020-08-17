<template>
  <v-card
    class="mx-auto pa-10"
    style="margin-top: 20vh"
    outlined
    max-width="400"
  >
    <h1 class="headline mt-n4 mb-6 text-center font-weight-light">
      Вход в админ панель
    </h1>
    <v-form ref="form" v-model="valid" :lazy-validation="lazy" class="">
      <v-text-field
        v-model="email"
        label="Email"
        clearable
        required
        outlined
        :rules="emailRules"
      ></v-text-field>

      <v-text-field
        :type="'password'"
        class="input-group--focused"
        v-model="password"
        label="Пароль"
        required
        clearable
        outlined
        :rules="passwordRules"
      ></v-text-field>

      <v-btn
        class="mr-4"
        @click="submit"
        color="primary"
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
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

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
        this.$router.push("/");
        this.loading = false;
      }
    },
    error(error) {
      if (error != null) {
        this.$notify({
          group: "app",
          type: "error",
          title: "Ошибка входа",
          text: error
        });
      }
      this.loading = false;
    }
  },
  computed: {
    ...mapGetters({
      error: "ERROR",
      isAuth: "USER_AUTH"
    })
  },

  methods: {
    ...mapActions({
      signIn: "SIGNIN"
    }),

    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        if (this.isAuth === true) {
          this.$router.push("/admin");
        } else {
          this.signIn({ email: this.email, password: this.password });
        }
      }
    }
  }
};
</script>
