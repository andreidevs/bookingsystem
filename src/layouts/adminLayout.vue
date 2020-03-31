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
    <v-content>
      <slot />
    </v-content>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "adminLayout",
  data: () => ({
    drawer: false,
    dialogAddCoach: false,
    dialogAddTypeWorkout: false,
    coach: {
      name: ""
    },
    typeWorkout: ""
  }),
  methods: {
    ...mapActions({
      logout: "LOGOUT",
      setCoach: "SET_COACH",
      setTypeWorkout: "SET_TYPEWORKOUT"
    }),
    logOut() {
      this.logout();
      this.$router.push("/signin");
    },
    addCoach() {
      if (this.coach.name != "") {
        this.setCoach(this.coach);
        this.coach.name = "";
      }
      this.dialogAddCoach = false;
    },
    addTypeWorkout() {
      if (this.typeWorkout != "") {
        this.setTypeWorkout(this.typeWorkout);
        this.typeWorkout = "";
      }
      this.dialogAddTypeWorkout = false;
    }
  }
};
</script>

<style scoped></style>
