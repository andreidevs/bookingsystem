<template>
  <v-container>
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item link @click="dialogAddCoach = true">
        <v-list-item-action>
          <v-icon>mdi-account-plus</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Добавить тренера</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link @click="dialogAddTypeWorkout = true">
        <v-list-item-action>
          <v-icon>mdi-alpha-t-box</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Добавить тип тренеровки</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link @click="logOut">
        <v-list-item-action>
          <v-icon>mdi-account-arrow-left</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Выйти</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Онлайн запись</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-dialog v-model="dialogAddCoach" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Добавить тренера</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    label="ФИО"
                    v-model="coach.name"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*обязательны для заполнения</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogAddCoach = false"
              >Назад</v-btn
            >
            <v-btn color="blue darken-1" text @click="addCoach">Добавить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogAddTypeWorkout" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Добавить тип тренеровки</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    label="Нзавание"
                    v-model="typeWorkout"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*обязательны для заполнения</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="dialogAddTypeWorkout = false"
              >Назад</v-btn
            >
            <v-btn color="blue darken-1" text @click="addTypeWorkout"
              >Добавить</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-container>
        <v-card>
          <v-row>
            <v-col cols="8" class="ml-2">
              <v-card-title>Создание группы</v-card-title>
              <v-card-subtitle class="body-1 mb-n4"
                ><v-icon>mdi-calendar-today</v-icon> Дни недели</v-card-subtitle
              >
              <v-chip-group multiple active-class="chips">
                <v-chip
                  v-for="item in chip"
                  :key="item.title"
                  class="ma-2"
                  label
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
                <v-col cols="2">
                  <v-select v-model="timeHour" :items="timehours" label="Часы">
                  </v-select>
                </v-col>
                <v-col cols="2">
                  <v-select
                    v-model="timeMinute"
                    :items="timeminuts"
                    label="Минуты"
                  >
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
            </v-col>
          </v-row>
          <v-card-actions>
            <v-btn
              color="black"
              @click="createGroup"
              depressed
              outlined
              class="mt-n4 ml-2 pl-4 pr-4"
              >Создать</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-container>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2020</span>
    </v-footer>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    drawer: false,
    dialogAddCoach: false,
    dialogAddTypeWorkout: false,
    coach: {
      name: ""
    },
    typeWorkout: "",
    selectCoach: "",
    coachList: [],
    chip: [
      { title: "Пн", active: false, color: "red" },
      { title: "Вт", active: false, color: "purple " },
      { title: "Ср", active: false, color: "teal" },
      { title: "Чт", active: false, color: "light-green " },
      { title: "Пт", active: false, color: "pink darken-1" },
      { title: "Сб", active: false, color: "blue " },
      { title: "Вс", active: false, color: "lime " }
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
      coachLists: "COACH"
    })
  },
  created() {
    this.getCoachList();
    this.coachList = this.coachLists;
  },
  methods: {
    ...mapActions({
      logout: "LOGOUT",
      setCoach: "SET_COACH",
      setTypeWorkout: "SET_TYPEWORKOUT",
      getCoachList: "GET_COACH_LIST",
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
      }
      this.dialogAddTypeWorkout = false;
    },
    createGroup() {
      let massData = {
        weekDays: [],
        time: "",
        coach: "",
        name: ""
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
      this.createGrooup(massData);
    }
  }
};
</script>

<style scoped></style>
