<template>
  <v-container>
    <div class="d-flex align-center justify-center" style="margin-right: 25%">
      <img style="width: 200px" src="../assets/logo Original.png" />
      <h1 class="text-center font-weight-light ml-4">
        Записаться на тренеровку
      </h1>
    </div>
    <v-card
      class="ml-auto"
      style="margin-right: 27%; margin-top: -6%"
      max-width="500"
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
            :color="item.active ? item.color : ''"
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
          <v-btn color="info" outlined @click="showMore"
            >Просмотреть все <v-icon class="ml-1">mdi-more</v-icon></v-btn
          >
          <v-btn color="primary" @click="stepOne"
            >Далее <v-icon class="ml-1">mdi-arrow-right</v-icon></v-btn
          >
        </v-card-actions>
      </div>
      <div v-if="step === 2">
        <v-data-table
          :headers="headers"
          :items="sampleGroups"
          item-key="name"
          sort-by="time"
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
        <v-card-actions>
          <v-btn
            color="accent"
            small
            style="margin-top: -5%; margin-left: 2%"
            @click="step = 1"
            ><v-icon class="ml-1">mdi-arrow-left</v-icon>Назад</v-btn
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
      headers: [
        {
          text: "Дни недели",
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
          text: "",
          value: "actions"
        }
      ],
      sampleGroups: []
    };
  },
  computed: {
    ...mapGetters({
      allGroups: "ALLGROUPS"
    })
  },
  created() {
    this.getGroups();
  },
  methods: {
    ...mapActions({
      getGroups: "GET_ALL_GROUPS"
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
        this.sampleGroups.push(item);
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
      setTimeout(() => {
        this.loading = false;
      }, 2000);

      this.chip.forEach(item => {
        if (item.active) weekdays.push(item.title);
      });
      this.allGroups.forEach(item => {
        if (!item.time.indexOf(this.timeHour)) {
          if (weekdays.length > 0) {
            weekdays.forEach(day => {
              if (!item.weekDays.indexOf(day)) {
                this.sampleGroups.push(item);
              }
            });
          } else {
            this.sampleGroups.push(item);
          }
        }
      });

      this.step = 2;
    }
  },
  stepTwo() {}
};
</script>

<style></style>
