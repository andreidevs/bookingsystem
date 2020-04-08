<template>
  <v-container>
    <div class="d-flex align-center justify-center" style="margin-right: 25%">
      <img style="width: 200px" src="../assets/logo Original.png" />
      <h1 class="text-center font-weight-light ml-4">
        Записаться на тренеровку
      </h1>
    </div>
    <v-card
      class="ml-auto cardMain"
      max-width="520"
      outlined
      :loading="loading"
    >
      <div v-if="step === 1" class="pa-5">
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
      <div v-if="step === 2">
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
      <div v-if="step === 3" class="pa-5">
        <v-alert border="bottom" color="success" dark>
          Группа {{ this.nameGroup }}
        </v-alert>
        <v-form ref="formStep3" v-model="validForm3">
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
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  components: {},
  data() {
    return {
      loading: false,
      validForm3: true,
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
      this.allGroups.forEach(item => {
        if (item.count > 0) {
          this.sampleGroups.push(item);
        }
      });
      setTimeout(() => {
        this.loading = false;
      }, 2000);
      this.step = 2;
    },
    stepOne() {
      this.loading = true;
      this.sampleGroups = [];
      let weekdays = [];
      this.chip.forEach(item => {
        if (item.active) weekdays.push(item.title);
      });
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
            name: this.nameStep3,
            phone: this.phoneStep3,
            email: this.emailStep3,
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
              .substr(2, 9),
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
</style>
