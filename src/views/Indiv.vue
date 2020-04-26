<template>
  <v-container>
    <div class="d-flex align-center justify-center" style="margin-right: 15%">
      <img style="width: 200px" src="../assets/logo Original.png" />
      <h1 class="text-center font-weight-light ml-4">
        Записаться на индивидуальное занятие
      </h1>
    </div>
    <v-card class="ml-auto cardMain" max-width="520" shaped>
      <v-row class="pa-8">
        <v-col class="d-flex justify-center flex-column">
          <v-form ref="form">
            <v-text-field
              v-model="name"
              outlined
              :rules="$validation.required"
              color="success"
              label="ФИО"
            ></v-text-field>
            <v-text-field
              v-model="phone"
              outlined
              :rules="$validation.phone"
              color="success"
              label="Номер телефона"
              v-mask="'+7(###)###-##-##'"
            ></v-text-field>
            <v-btn class="pa-5" color="success" @click="submit"
              >Оставить заявку</v-btn
            >
          </v-form>
        </v-col>
      </v-row>
    </v-card>
    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <v-card shaped>
          <v-card-title
            class="headline lighten-2"
            color="primary"
            primary-title
          >
            Успешно
          </v-card-title>

          <v-card-text>
            Спасибо. Ваша заявка принята ожидайте звонка менеджера. <br />
            Напишите нам для уточнения информации
            <v-btn class="mr-2" fab dark small color="red" @click="onCall()">
              <v-icon>mdi-phone-forward</v-icon>
            </v-btn>
            <v-btn class="mr-2" fab dark small color="green" @click="onW()">
              <v-icon>mdi-whatsapp</v-icon>
            </v-btn>
            <v-btn fab dark small color="blue" @click="onTelegram()">
              <v-icon>mdi-telegram</v-icon>
            </v-btn>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" rounded @click="dialog = false">
              Ок
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-speed-dial
      v-model="fab"
      bottom
      right
      direction="top"
      :open-on-hover="hover"
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="darken-2" dark fab>
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>mdi-phone-in-talk</v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="red" @click="onCall()">
        <v-icon>mdi-phone-forward</v-icon>
      </v-btn>
      <v-btn fab dark small color="green" @click="onW()">
        <v-icon>mdi-whatsapp</v-icon>
      </v-btn>
      <v-btn fab dark small color="blue" @click="onTelegram()">
        <v-icon>mdi-telegram</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      name: "",
      phone: "",
      fab: false,
      hover: false,
      dialog: false
    };
  },
  created() {},
  methods: {
    ...mapActions({
      sendMessage: "SEND_FORM_TELEGRAM"
    }),
    onW() {
      window.open("https://wa.me/77009172707");
    },
    onCall() {
      window.location.href = "tel:+77009172707";
    },
    onTelegram() {
      window.open("https://t.me/BugaevaSofya");
    },
    submit() {
      if (this.$refs.form.validate()) {
        const res = {
          name: this.name,
          phone: this.phone,
          text: "Индивидуальное занятие"
        };
        this.sendMessage(res);
        this.dialog = true;
      }
    }
  }
};
</script>

<style>
.cardMain {
  margin-right: 27%;
  margin-top: -5%;
}
@media (max-width: 600px) {
  .cardMain {
    margin-right: 0;
    margin-top: 0;
  }
}
.v-speed-dial {
  position: absolute;
}

.v-btn--floating {
  position: relative;
}
</style>
