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
      <v-text-field
        dense
        label="Поиск"
        style="padding-top: 2% !important; padding-left: 2%; padding-right: 2%;"
        v-model="searchTable1"
      >
      </v-text-field>
      <v-switch
        class="ml-2 mt-n1 mb-n1"
        label="Минигруппы"
        @change="filterGroups"
        v-model="miniGroupCheck"
      ></v-switch>
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
            >Выбрать
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
        <span v-if="!this.miniGroup">Группа</span> {{ this.nameGroup }}
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
        <v-checkbox
          v-model="statusPaid"
          label="Оплачен"
          class="mt-n4"
        ></v-checkbox>
        <v-radio-group v-if="!miniGroup" v-model="radioGroup" class="mt-n4">
          <v-radio
            color="success"
            v-for="item in radioItems"
            :key="item.text"
            :label="item.text"
            :value="item.value"
          ></v-radio>
        </v-radio-group>
        <v-radio-group v-if="miniGroup" v-model="priceMiniGroup" class="mt-n4">
          <v-radio
            color="success"
            v-for="item in radioItemsMini"
            :key="item.text"
            :label="item.text"
            :value="item.value"
          ></v-radio>
        </v-radio-group>
        <v-text-field
          v-show="priceMiniGroup !== '2000'"
          :disabled="priceMiniGroup === '2000'"
          v-model="priceMini"
          label="Другая цена"
          outlined
          dense
          v-mask="'######'"
        ></v-text-field>
      </v-form>
      <v-card-actions class="d-flex justify-space-between">
        <v-btn color="secondary" style="" @click="step = 1"
          ><v-icon class="ml-1">mdi-arrow-left</v-icon>Назад</v-btn
        >
        <v-btn :loading="loading" color="success" @click="step11"
          >Добавить <v-icon>mdi-checkbox-marked-circle</v-icon></v-btn
        >
      </v-card-actions>
    </div>
    <div v-show="step === 2" class="pa-5">
      <v-form ref="formIndiv">
        <v-text-field
          label="ФИО"
          dense
          clearable
          :rules="$validation.required"
          outlined
          v-model="name"
        ></v-text-field>
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
        <v-select
          v-model="nameCoach"
          :rules="$validation.required"
          dense
          label="Тренер"
          outlined
          :items="coachList"
        ></v-select>
        <v-card-subtitle class="body-1 mb-n3"
          ><v-icon>mdi-calendar-today</v-icon> Дни недели</v-card-subtitle
        >
        <v-chip-group multiple>
          <v-chip
            v-for="item in chip"
            :key="item.title"
            class="ma-2"
            :color="item.active ? 'success' : ''"
            :text-color="item.active ? 'white' : 'black'"
            @click="addWeekday(item)"
          >
            {{ item.title }}
          </v-chip>
        </v-chip-group>
        <v-card-subtitle class="body-1 mb-n4">
          <v-icon>mdi-clock</v-icon> Время тренеровки</v-card-subtitle
        >
        <v-row class="ml-2 mt-2">
          <v-col cols="6">
            <v-select v-model="timeHour" :items="timehours" label="Часы">
            </v-select>
          </v-col>
          <v-col cols="6">
            <v-select v-model="timeMinute" :items="timeminuts" label="Минуты">
            </v-select>
          </v-col>
        </v-row>
        <v-checkbox
          v-model="statusPaid"
          label="Оплачен"
          class="mt-n2"
        ></v-checkbox>
        <v-radio-group v-model="priceIndivGroup" class="mt-n3">
          <v-radio
            color="success"
            v-for="item in radioItemsIndiv"
            :key="item.text"
            :label="item.text"
            :value="item.value"
          ></v-radio>
        </v-radio-group>
        <v-text-field
          v-show="priceIndivGroup !== '3000'"
          :disabled="priceIndivGroup === '3000'"
          v-model="priceIndiv"
          label="Другая цена"
          outlined
          dense
          v-mask="'######'"
        ></v-text-field>
      </v-form>
      <v-card-actions class="d-flex justify-space-between">
        <v-btn color="secondary" style="" @click="step = 0"
          ><v-icon class="ml-1">mdi-arrow-left</v-icon>Назад</v-btn
        >
        <v-btn :loading="loading" color="success" @click="step2()"
          >Добавить <v-icon>mdi-checkbox-marked-circle</v-icon></v-btn
        >
      </v-card-actions>
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
      priceMiniGroup: "2000",
      priceMini: "",
      priceIndiv: "",
      statusPaid: false,
      miniGroup: false,
      miniGroupCheck: false,
      page: 1,
      pageCount: 1,
      chip: [
        { title: "Пн", active: false, color: "red" },
        { title: "Вт", active: false, color: "purple" },
        { title: "Ср", active: false, color: "teal accent-3" },
        { title: "Чт", active: false, color: "light-green accent-3" },
        { title: "Пт", active: false, color: "pink darken-1" },
        { title: "Сб", active: false, color: "blue" },
        { title: "Вс", active: false, color: "yellow darken-1" }
      ],
      timehours: [
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21"
      ],
      timeminuts: ["00", "30"],
      timeHour: "07",
      timeMinute: "00",
      searchTable1: "",
      radioGroup: "1500",
      priceIndivGroup: "3000",
      radioItemsIndiv: [
        { text: "Цена - 3000", value: "3000" },
        { text: "Другая цена" }
      ],
      radioItemsMini: [
        { text: "Цена - 2000", value: "2000" },
        { text: "Другая цена" }
      ],
      radioItems: [
        { text: "Разовое занятие - 1500тг", value: "1500" },
        { text: "8 занятий - 10000тг", value: "10000" },
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
          text: "Тип",
          value: "type"
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
  computed: {
    ...mapGetters({
      allGroups: "ALLGROUPS",
      coachList: "COACH"
    })
  },
  created() {
    this.getGroups();
  },
  methods: {
    ...mapActions({
      getGroups: "GET_ALL_GROUPS",
      getCoachList: "GET_COACH_LIST",
      writeUserGroup: "WRITE_USER_GROUP",
      writeSingleLesson: "WRITE_USER_SINGLE",
      writeIndivUser: "WRITE_USER_INDIV",
      writeMiniUser: "WRITE_USER_MINI",
      sendPaySingle: "SEND_PAY_SINGLE",
      sendPayGroup: "SEND_PAY_SUB",
      sendPayIndiv: "SEND_PAY_INDIV",
      sendPayMini: "SEND_PAY_MINI"
    }),
    filterGroups() {
      if (this.miniGroupCheck) {
        this.sampleGroups = this.sampleGroups.filter(
          c => c.type === "Минигруппа"
        );
      } else {
        this.sampleGroups = this.allGroups
          .filter(c => c.count > 0)
          .map(c => (c = { ...c, type: c.mini ? "Минигруппа" : "Группа" }));
      }
    },
    step0() {
      switch (this.selectType) {
        case 1: {
          this.step = 1;
          this.loading = true;
          this.sampleGroups = [];
          setTimeout(() => {
            this.sampleGroups = this.allGroups
              .filter(c => c.count > 0)
              .map(c => (c = { ...c, type: c.mini ? "Минигруппа" : "Группа" }));
            this.loading = false;
          }, 1000);
          break;
        }

        case 2:
          this.step = 2;
          this.getCoachList();
          break;
      }
    },
    step1(item) {
      this.nameGroup = item.name;
      this.uidGroup = item.id;
      this.nameCoach = item.coach;
      this.miniGroup = item.mini ? true : false;
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
        if (this.miniGroup) {
          let payload = {
            id: this.$g.generate(24),
            name: this.name,
            dateReg: new Date(),
            phone: this.phone,
            email: this.email,
            nameGroup: this.nameGroup,
            uidGroup: this.uidGroup,
            subscription:
              this.priceMiniGroup === "2000" ? "2000" : this.priceMini,
            coach: this.nameCoach,
            paid: false,
            sendT: true
          };
          this.writeMiniUser(payload);
          setTimeout(() => {
            if (this.statusPaid) {
              this.sendPayMini(payload);
            }
          }, 1000);
        } else if (this.radioGroup === "1500") {
          let payload = {
            id: this.$g.generate(24),
            name: this.name,
            dateReg: new Date(),
            phone: this.phone,
            email: this.email,
            nameGroup: this.nameGroup,
            subscription: this.radioGroup,
            coach: this.nameCoach,
            paid: false,
            type: "single",
            datePay: this.statusPaid ? new Date().format("dd.mm.yyyy") : "",
            datePayNoformat: this.statusPaid ? new Date() : "",
            sendT: true
          };
          this.writeSingleLesson(payload);
          setTimeout(() => {
            if (this.statusPaid) {
              this.sendPaySingle(payload);
            }
          }, 1000);
        } else {
          let payload = {
            id: this.$g.generate(24),
            name: this.name,
            dateReg: new Date(),
            phone: this.phone,
            email: this.email,
            nameGroup: this.nameGroup,
            uidGroup: this.uidGroup,
            subscription: this.radioGroup,
            coach: this.nameCoach,
            paid: this.statusPaid ? true : false,
            datePay: this.statusPaid ? new Date().format("dd.mm.yyyy") : "",
            datePayNoformat: this.statusPaid ? new Date() : "",
            sendT: true
          };
          this.writeUserGroup(payload);
          setTimeout(() => {
            if (this.statusPaid) {
              this.sendPayGroup(payload);
            }
          }, 1000);
        }
        setTimeout(() => {
          this.loading = false;
          this.step = 1;
        }, 2000);
      }
    },
    addWeekday(chip) {
      this.chip.map(c =>
        c.title == chip.title ? (c.active = !c.active) : c.active
      );
    },
    step2() {
      if (this.$refs.formIndiv.validate()) {
        this.loading = true;
        let payload = {
          id: this.$g.generate(24),
          dateReg: new Date(),
          title: "",
          name: this.name,
          phone: this.phone,
          subscription:
            this.priceIndivGroup === "3000" ? "3000" : this.priceIndiv,
          coach: this.nameCoach,
          paid: this.statusPaid ? true : false,
          datePay: this.statusPaid ? new Date().format("dd.mm.yyyy") : "",
          datePayNoformat: this.statusPaid ? new Date() : "",
          weekDays: [],
          time: this.timeHour + ":" + this.timeMinute
        };
        payload.weekDays = this.chip.filter(c => c.active).map(c => c.title);

        let days = "";
        payload.weekDays.forEach(item => {
          days += item + ", ";
        });
        payload.title = `${payload.name} ${days} ${payload.time} ${payload.coach}`;
        this.writeIndivUser(payload);
        setTimeout(() => {
          if (this.statusPaid) {
            this.sendPayIndiv(payload);
          }
        }, 1000);
        setTimeout(() => {
          this.loading = false;
          this.step = 0;
        }, 2000);
      }
    }
  }
};
</script>

<style></style>
