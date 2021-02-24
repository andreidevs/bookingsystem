<template>
  <v-card
    class="mx-auto pa-10"
    style="margin-top: 10vh"
    outlined
    max-width="400"
  >
    <h1 class="headline mt-n4 mb-6 text-center font-weight-light">
      Регистрация тренера
    </h1>
    <v-form ref="form">
      <v-text-field
        v-model="name"
        label="Имя"
        clearable
        required
        outlined
        :rules="$validation.required"
      ></v-text-field>
      <v-text-field
        v-model="email"
        label="Email"
        clearable
        required
        outlined
        :rules="$validation.email"
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
        :rules="$validation.password"
      ></v-text-field>
      <v-checkbox
        v-model="admin"
        label="Права администратора"
        class="mt-n4"
      ></v-checkbox>
      <v-btn
        class="mr-4"
        @click="submit"
        color="primary"
        :loading="loading"
        outlined
      >
        <v-icon>mdi-login</v-icon>
        Зарегистрироваться
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  components: {},

  data: () => ({
    showPassword: false,
    show1: false,
    name: "",
    email: "",
    admin: false,
    password: "",
    loading: false
  }),
  methods: {
    ...mapActions({
      signUp: "SIGNUP_ADMIN"
    }),

    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.signUp({
          id: this.$g.generate(20),
          admin: this.admin,
          name: this.name.trim(),
          email: this.email.trim(),
          password: this.password.trim()
        });
        this.loading = false;
        // this.$router.push("/admin");
        this.$refs.form.reset();
        // this.name = this.email = this.password = "";
      }
    }
  }
};
</script>
