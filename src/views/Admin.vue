<template>
  <v-card loading="loadingCard" class="mx-auto" max-width="500" outlined>
    <v-row>
      <v-col cols="12" class="ml-4">
        <v-card-title class="mb-2">Создание группы</v-card-title>
        <v-card-subtitle class="body-1 mb-n3"
          ><v-icon>mdi-calendar-today</v-icon> Дни недели</v-card-subtitle
        >
        <v-chip-group multiple>
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
          <v-icon>mdi-clock</v-icon> Время тренеровки</v-card-subtitle
        >
        <v-row class="ml-2 mt-2">
          <v-col cols="4">
            <v-select v-model="timeHour" :items="timehours" label="Часы">
            </v-select>
          </v-col>
          <v-col cols="4">
            <v-select v-model="timeMinute" :items="timeminuts" label="Минуты">
            </v-select>
          </v-col>
        </v-row>
        <v-col cols="6" class="mt-n6">
          <v-select
            v-model="selectCoach"
            :items="coachList"
            label="Тренер"
            prepend-icon="mdi-account"
          ></v-select>
        </v-col>
        <v-col cols="6" class="mt-n6">
          <v-select
            v-model="selectTypeWorkout"
            :items="typeWorkoutList"
            label="Вид тренеровки"
            prepend-icon="mdi-alpha-t-box"
          ></v-select>
        </v-col>
      </v-col>
    </v-row>
    <v-card-actions class="ml-6 mt-n6 mb-2">
      <v-btn
        color="black"
        @click="createGroup"
        depressed
        outlined
        class="pl-8 pr-8"
        >Создать</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    drawer: false,
    dialogAddCoach: false,
    dialogAddTypeWorkout: false,
    loadingCard: false,
    coach: {
      name: ""
    },
    typeWorkout: "",
    selectCoach: "",
    selectTypeWorkout: "",
    coachList: [],
    typeWorkoutList: [],
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
    time: null
  }),
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
      error: "ERROR",
      success: "SUCCESS",
      coachLists: "COACH",
      typeWorkoutLists: "TYPEWORKOUT"
    })
  },
  created() {
    this.getCoachList();
    this.getTypeWorkoutList();
    this.typeWorkoutList = this.typeWorkoutLists;
    this.coachList = this.coachLists;
  },
  methods: {
    ...mapActions({
      logout: "LOGOUT",
      setCoach: "SET_COACH",
      setTypeWorkout: "SET_TYPEWORKOUT",
      getCoachList: "GET_COACH_LIST",
      getTypeWorkoutList: "GET_TYPEWORKOUT_LIST",
      createGrooup: "CREATE_GROUP"
    }),
    logOut() {
      this.logout();
      this.$router.push("/");
    },
    addCoach() {
      if (this.coach.name != "") {
        this.setCoach(this.coach);
        this.coach.name = "";
        this.getCoachList();
        this.coachList = this.coachLists;
      }
      this.dialogAddCoach = false;
    },
    addWeekday(chip) {
      this.chip.forEach(item => {
        if (item.title == chip.title) {
          item.active = !item.active;
        }
      });
    },
    addTypeWorkout() {
      if (this.typeWorkout != "") {
        this.setTypeWorkout(this.typeWorkout);
        this.typeWorkout = "";
        this.getTypeWorkoutList();
        this.typeWorkoutList = this.typeWorkoutLists;
      }
      this.dialogAddTypeWorkout = false;
    },
    createGroup() {
      this.loadingCard = true;
      let massData = {
        id: Math.random()
          .toString(36)
          .substr(2, 9),
        weekDays: [],
        time: "",
        coach: "",
        name: "",
        typeWorkout: "",
        count: 10,
        users: []
      };
      this.chip.forEach(item => {
        if (item.active) massData.weekDays.push(item.title);
      });
      massData.time = this.timeHour + ":" + this.timeMinute;
      massData.coach = this.selectCoach;
      let days = "";
      massData.weekDays.forEach(item => {
        days += item + ", ";
      });
      massData.name = `${days} ${massData.time} ${massData.coach}`;
      massData.typeWorkout = this.selectTypeWorkout;
      this.createGrooup(massData);
      // this.chip.forEach(item => {
      //   item.active = false;
      // });
      this.loadingCard = false;
    }
  }
};
</script>

<style scoped></style>
