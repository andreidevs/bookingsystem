<template>
  <v-card
    :loading="loading"
    style="margin-top: 5%"
    class="mx-auto"
    max-width="600"
    shaped
  >
    <div v-show="step === 0" class="pa-5">
      <v-select
        v-model="selectType"
        label="Выберите вид"
        item-text="text"
        item-value="value"
        :items="selectTypeItems"
      ></v-select>
      <v-btn color="success" @click="step0()">Далее</v-btn>
    </div>
    <div v-show="step === 1">
      <v-text-field dense outlined label="Поиск" v-model="searchTable1">
      </v-text-field>
      <v-data-table
        :headers="headersGroup"
        :items="sampleGroups"
        :page.sync="page"
        :search="searchTable1"
        hide-default-footer
        item-key="name"
        sort-by="time"
        @page-count="pageCount = $event"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn class="mr-4" @click="step1(item)" outlined small color="info"
            >Записаться
            <v-icon small>
              mdi-pencil
            </v-icon></v-btn
          >
        </template>
        <template v-slot:no-data>
          <span
            >К сожалению мы не нашли подходящие тренеровки вернитесь назад и
            измените параметры</span
          >
        </template>
      </v-data-table>
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
        color="success"
      ></v-pagination>
      <v-card-actions>
        <v-btn
          color="secondary"
          small
          style="margin-top: -10%; margin-left: 2%"
          @click="step = 0"
          ><v-icon class="ml-1">mdi-arrow-left</v-icon>Назад</v-btn
        >
      </v-card-actions>
    </div>
    <div v-show="step === 11" class="pa-5">
      <v-alert border="bottom" color="success" dark>
        Группа {{ this.nameGroup }}
      </v-alert>
      <v-form ref="formStep3">
        <v-text-field
          dense
          outlined
          v-model="name"
          clearable
          :rules="$validation.required"
          label="ФИО"
        >
        </v-text-field>
        <v-text-field
          dense
          v-model="phone"
          v-mask="'+7(###)###-##-##'"
          outlined
          clearable
          :rules="$validation.phone"
          label="Телефон"
        >
        </v-text-field>
        <v-text-field
          dense
          v-model="email"
          :rules="emailRules"
          outlined
          clearable
          label="Email"
        >
        </v-text-field>
        <v-radio-group v-model="radioGroup" class="mt-n4">
          <v-radio
            color="success"
            v-for="item in radioItems"
            :key="item.text"
            :label="item.text"
            :value="item.value"
          ></v-radio>
        </v-radio-group>
      </v-form>
      <v-card-actions class="d-flex justify-space-between">
        <v-btn color="secondary" style="" @click="step = 1"
          ><v-icon class="ml-1">mdi-arrow-left</v-icon>Назад</v-btn
        >
        <v-btn :loading="loading" color="success" @click="step11"
          >Выбрать <v-icon>mdi-pencil</v-icon></v-btn
        >
      </v-card-actions>
    </div>
    <div v-show="step === 2">
      <v-text-field label="ФИО" outlined :v-model="name"></v-text-field>
    </div>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      step: 0,
      selectType: "",
      selectTypeItems: [
        { text: "Запись в группу", value: 1 },
        { text: "Индивидуальные", value: 2 }
      ],
      loading: false,
      name: "",
      email: "",
      phone: "",
      emailRules: [],
      page: 1,
      pageCount: 1,
      searchTable1: "",
      radioGroup: "1500",
      radioItems: [
        { text: "Разовое занятие - 1500тг", value: "1500" },
        { text: "8 занятий - 8000тг", value: "8000" },
        { text: "12 занятий - 12000тг", value: "12000" }
      ],

      nameGroup: "",
      uidGroup: null,
      nameCoach: "",
      headersGroup: [
        {
          text: "Дни",
          value: "weekDays"
        },
        {
          text: "Время",
          value: "time"
        },
        {
          text: "Тренер",
          value: "coach"
        },
        {
          text: "Вид ",
          value: "typeWorkout"
        },
        {
          text: "",
          value: "actions"
        }
      ],
      sampleGroups: []
    };
  },
  watch: {
    success(is) {
      if (is != null) {
        this.$notify({
          group: "app",
          type: "info",
          title: "Успешно"
        });
      }
    },
    error(error) {
      if (error != null) {
        this.$notify({
          group: "app",
          type: "error",
          title: "Ошибка",
          text: error
        });
      }
    }
  },
  computed: {
    ...mapGetters({
      allGroups: "ALLGROUPS",
      error: "ERROR",
      success: "SUCCESS"
    })
  },
  created() {
    this.getGroups();
  },
  methods: {
    ...mapActions({
      getGroups: "GET_ALL_GROUPS",
      writeUserGroup: "WRITE_USER_GROUP",
      writeSingleLesson: "WRITE_USER_SINGLE"
    }),
    step0() {
      switch (this.selectType) {
        case 1: {
          this.step = 1;
          this.loading = true;
          this.sampleGroups = [];
          this.allGroups.forEach(item => {
            if (item.count > 0) {
              this.sampleGroups.push(item);
            }
          });
          setTimeout(() => {
            this.loading = false;
          }, 1000);
          break;
        }

        case 2:
          this.step = 2;
          break;
      }
    },
    step1(item) {
      this.nameGroup = item.name;
      this.uidGroup = item.id;
      this.nameCoach = item.coach;
      this.step = 11;
    },
    step11() {
      if (this.email !== "") {
        this.emailRules = [
          v => /.+@.+\..+/.test(v) || "E-mail введен не верно"
        ];
      } else {
        this.emailRules = [];
      }
      if (this.$refs.formStep3.validate()) {
        this.loading = true;
        if (this.radioGroup === "1500") {
          let payload = {
            id: Math.random()
              .toString(36)
              .substr(2, 12),
            dateReg: new Date().format("dd.mm.yyyy"),
            name: this.name,
            phone: this.phone,
            email: this.email,
            nameGroup: this.nameGroup,
            subscription: this.radioGroup,
            coach: this.nameCoach,
            paid: false
          };
          this.writeSingleLesson(payload);
        } else {
          let payload = {
            id: Math.random()
              .toString(36)
              .substr(2, 12),
            name: this.name,
            phone: this.phone,
            email: this.email,
            nameGroup: this.nameGroup,
            uidGroup: this.uidGroup,
            subscription: this.radioGroup,
            coach: this.nameCoach,
            paid: false,
            datePay: ""
          };
          this.writeUserGroup(payload);
        }
        setTimeout(() => {
          this.loading = false;
          this.step = 1;
        }, 2000);
      }
    }
  }
};
</script>

<style></style>
