<template>
  <v-container height="100vh">
    <div class="d-flex align-center justify-center" style="margin-right: 25%">
      <img style="width: 200px" src="../assets/logo Original.png" />
      <h1 class="text-center font-weight-light ml-4">
        Записаться на тренеровку
      </h1>
    </div>
    <v-card class="ml-auto cardMain" max-width="520" shaped :loading="loading">
      <div v-show="step === 1" class="pa-5">
        <v-card-subtitle class="body-1 "
          ><v-icon>mdi-calendar-today</v-icon>Выберите дни недели для
          посещения</v-card-subtitle
        >
        <v-chip-group class="mx-auto" multiple>
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
          <v-icon>mdi-clock</v-icon>Выберите удобное время
          тренеровки</v-card-subtitle
        >
        <v-row class="ml-2 mt-2">
          <v-col cols="6">
            <v-select
              v-model="timeHour"
              :items="timehours"
              label="Часы"
              :disabled="timeHourNone"
            >
            </v-select>
          </v-col>
          <v-col>
            <v-switch
              v-model="timeHourNone"
              label="Любое время"
              class=""
            ></v-switch>
          </v-col>
        </v-row>
        <v-card-actions class="d-flex justify-space-between mt-n4">
          <v-btn color="secondary" outlined @click="showMore"
            >Просмотреть все <v-icon class="ml-1">mdi-more</v-icon></v-btn
          >
          <v-btn color="success" @click="stepOne"
            >Далее <v-icon class="ml-1">mdi-arrow-right</v-icon></v-btn
          >
        </v-card-actions>
      </div>
      <div v-show="step === 2">
        <v-data-table
          :headers="headers"
          :items="sampleGroups"
          :page.sync="page"
          hide-default-footer
          item-key="name"
          sort-by="time"
          @page-count="pageCount = $event"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn
              class="mr-4"
              @click="stepTwo(item)"
              outlined
              small
              color="info"
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
            @click="step = 1"
            ><v-icon class="ml-1">mdi-arrow-left</v-icon>Назад</v-btn
          >
        </v-card-actions>
      </div>
      <div v-show="step === 3" class="pa-5">
        <v-alert border="bottom" color="success" dark>
          Группа {{ this.nameGroup }}
        </v-alert>
        <v-form ref="formStep3">
          <v-text-field
            dense
            outlined
            v-model="nameStep3"
            clearable
            :rules="$validation.required"
            label="ФИО"
          >
          </v-text-field>
          <v-text-field
            dense
            v-model="phoneStep3"
            v-mask="'+7(###)###-##-##'"
            outlined
            clearable
            :rules="$validation.phone"
            label="Телефон"
          >
          </v-text-field>
          <v-text-field
            dense
            v-model="emailStep3"
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
          <v-btn color="secondary" style="" @click="step = 2"
            ><v-icon class="ml-1">mdi-arrow-left</v-icon>Назад</v-btn
          >
          <v-btn :loading="loading" color="success" @click="stepTree"
            >Записаться <v-icon>mdi-pencil</v-icon></v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
    <div class="text-center">
      <v-dialog v-model="dialogOk" width="500">
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
            <v-btn color="primary" rounded @click="dialogOk = false">
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
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      loading: false,
      fab: false,
      dialogOk: false,
      hover: false,
      nameStep3: "",
      emailStep3: "",
      phoneStep3: "",
      emailRules: [],
      radioGroup: "1500",
      radioItems: [
        { text: "Разовое занятие - 1500тг", value: "1500" },
        { text: "8 занятий - 8000тг", value: "8000" },
        { text: "12 занятий - 12000тг", value: "12000" }
      ],
      page: 1,
      pageCount: 0,
      chip: [
        { title: "Пн", active: false, color: "red" },
        { title: "Вт", active: false, color: "purple" },
        { title: "Ср", active: false, color: "teal accent-3" },
        { title: "Чт", active: false, color: "light-green accent-3" },
        { title: "Пт", active: false, color: "pink darken-1" },
        { title: "Сб", active: false, color: "blue" },
        { title: "Вс", active: false, color: "yellow darken-1" }
      ],
      timeHour: "07",
      timeHourNone: false,
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
      step: 1,
      nameGroup: "",
      uidGroup: null,
      nameCoach: "",
      headers: [
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
        this.clearSuccess();
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
        this.clearError();
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
    ...mapMutations({
      clearError: "CLEAR_ERROR",
      clearSuccess: "CLEAR_SUCCESS"
    }),
    ...mapActions({
      getGroups: "GET_ALL_GROUPS",
      writeUserGroup: "WRITE_USER_GROUP",
      writeSingleLesson: "WRITE_USER_SINGLE"
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
    addWeekday(chip) {
      this.chip.forEach(item => {
        if (item.title == chip.title) {
          item.active = !item.active;
        }
      });
    },
    showMore() {
      this.loading = true;
      this.sampleGroups = [];
      this.sampleGroups = this.allGroups.filter(c => c.count > 0);
      // this.allGroups.forEach(item => {
      //   if (item.count > 0) {
      //     this.sampleGroups.push(item);
      //   }
      // });
      setTimeout(() => {
        this.loading = false;
      }, 1000);
      this.step = 2;
    },
    stepOne() {
      this.loading = true;
      this.sampleGroups = [];
      let weekdays = this.chip.filter(c => c.active).map(c => (c = c.title));

      if (this.timeHourNone) {
        this.allGroups.forEach(item => {
          if (weekdays.length > 0) {
            weekdays.forEach(day => {
              if (!item.weekDays.indexOf(day)) {
                if (item.count > 0) {
                  this.sampleGroups.push(item);
                }
              }
            });
          } else {
            if (item.count > 0) {
              this.sampleGroups.push(item);
            }
          }
        });
      } else {
        this.allGroups.forEach(item => {
          if (!item.time.indexOf(this.timeHour)) {
            if (weekdays.length > 0) {
              weekdays.forEach(day => {
                if (!item.weekDays.indexOf(day)) {
                  if (item.count > 0) {
                    this.sampleGroups.push(item);
                  }
                }
              });
            } else {
              if (item.count > 0) {
                this.sampleGroups.push(item);
              }
            }
          }
        });
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
      this.step = 2;
    },
    stepTwo(item) {
      this.nameGroup = item.name;
      this.uidGroup = item.id;
      this.nameCoach = item.coach;
      // console.log("uid", item.id)
      this.step = 3;
    },
    stepTree() {
      if (this.emailStep3 !== "") {
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
            id: this.$g.generate(20),
            dateReg: new Date(),
            name: this.nameStep3,
            phone: this.phoneStep3,
            email: this.emailStep3,
            nameGroup: this.nameGroup,
            subscription: this.radioGroup,
            coach: this.nameCoach,
            paid: false,
            type: "single"
          };
          this.writeSingleLesson(payload);
          this.dialogOk = true;
        } else {
          let payload = {
            id: this.$g.generate(20),
            dateReg: new Date(),
            name: this.nameStep3,
            phone: this.phoneStep3,
            email: this.emailStep3,
            nameGroup: this.nameGroup,
            uidGroup: this.uidGroup,
            subscription: this.radioGroup,
            coach: this.nameCoach,
            paid: false,
            datePay: ""
          };
          this.writeUserGroup(payload);
          this.dialogOk = true;
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

<style scoped>
.cardMain {
  margin-right: 27%;
  margin-top: -6%;
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
