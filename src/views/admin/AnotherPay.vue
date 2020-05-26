<template>
  <v-container>
    <v-card class="mx-auto" max-width="500" outlined>
      <v-card-title>Другая оплата</v-card-title>
      <v-form class="pa-6 mt-n6" ref="form">
        <v-text-field
          v-model="price"
          outlined
          :rules="$validation.required"
          dense
          label="Введите сумму"
          v-mask="'######'"
        ></v-text-field>
        <v-text-field
          v-model="comment"
          outlined
          dense
          label="Коменнтарий (не обязательно)"
        ></v-text-field>
        <v-btn @click="submit" color="info" :loading="loading">Отправить</v-btn>
      </v-form>
    </v-card>
    <v-btn
      style="position:fixed!important; bottom:10px; left:10px; z-index:1000;"
      @click="$router.go(-1)"
    >
      <v-icon>mdi-keyboard-backspace</v-icon>
      Назад
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      loading: false,
      price: "",
      comment: ""
    };
  },
  methods: {
    ...mapActions({
      sendPay: "SEND_PAY_REPORT"
    }),
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const payload = {
          price: this.price,
          name: this.comment,
          type: "another",
          date: new Date()
        };
        this.sendPay(payload);
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    }
  }
};
</script>

<style></style>
