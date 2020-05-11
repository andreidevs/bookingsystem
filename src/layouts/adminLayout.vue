<template>
  <v-container>
    <v-navigation-drawer v-model="drawer" app>
      <v-list shaped>
        <v-list-item v-if="user.admin" link to="/admin/statistic">
          <v-list-item-action>
            <v-icon color="success">mdi-chart-areaspline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Статистика</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/admin/daily">
          <v-list-item-action>
            <v-icon color="success">mdi-table-edit</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Ежедневный отчет</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group color="success" prepend-icon="mdi-account-multiple">
          <template v-slot:activator>
            <v-list-item-title>Ученики</v-list-item-title>
          </template>

          <v-list-item class="ml-8" exact link to="/admin/users">
            <!-- <v-list-item-action>
            <v-icon color="success">mdi-account-multiple</v-icon>
          </v-list-item-action> -->
            <v-list-item-content>
              <v-list-item-title>Групп</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="ml-8" link to="/admin/users/mini">
            <!-- <v-list-item-action>
            <v-icon color="success">mdi-account-multiple</v-icon>
          </v-list-item-action> -->
            <v-list-item-content>
              <v-list-item-title>Минигрупп</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="ml-8" link to="/admin/users/single">
            <!-- <v-list-item-action>
            <v-icon color="success">mdi-account-multiple</v-icon>
          </v-list-item-action> -->
            <v-list-item-content>
              <v-list-item-title>Разовые</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="ml-8" link to="/admin/users/indiv">
            <!-- <v-list-item-action>
            <v-icon color="success">mdi-account-multiple</v-icon>
          </v-list-item-action> -->
            <v-list-item-content>
              <v-list-item-title>Индивидуальные</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item link to="/admin/groups">
          <v-list-item-action>
            <v-icon color="success">mdi-folder-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Список групп</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group color="success" prepend-icon="mdi-playlist-plus">
          <template v-slot:activator>
            <v-list-item-title>Добавление</v-list-item-title>
          </template>

          <v-list-item class="ml-8" link to="/admin/addclient">
            <!-- <v-list-item-action>
              <v-icon color="success">mdi-plus-circle-outline</v-icon>
            </v-list-item-action> -->
            <v-list-item-content>
              <v-list-item-title>Добавить клиента</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="ml-8" link to="/admin/addgroup">
            <!-- <v-list-item-action>
              <v-icon color="success">mdi-folder-plus</v-icon>
            </v-list-item-action> -->
            <v-list-item-content>
              <v-list-item-title>Добавить группу</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item v-if="user.admin" link to="/admin/signup">
          <v-list-item-action>
            <v-icon color="success">mdi-account-key</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Регистрация тренера</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user.admin" link to="/admin/historysingle">
          <v-list-item-action>
            <v-icon color="success">mdi-run</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>История разовых занятий</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user.admin" link to="/admin/wages">
          <v-list-item-action>
            <v-icon color="success">mdi-currency-btc</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Расчет ЗП</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="logOut">
          <v-list-item-action>
            <v-icon color="success">mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="success" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        >Панель администратора -
        {{ $route.meta.title.split("-")[1] }}</v-toolbar-title
      >
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
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "adminLayout",
  data: () => ({
    drawer: false,
    dialogAddCoach: false,
    dialogAddTypeWorkout: false,
    coach: {
      name: ""
    },
    typeWorkout: "",
    title: ""
  }),
  computed: {
    ...mapGetters({
      error: "ERROR",
      success: "SUCCESS",
      user: "USER"
    })
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
  methods: {
    ...mapMutations({
      clearError: "CLEAR_ERROR",
      clearSuccess: "CLEAR_SUCCESS"
    }),
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
        this.dialogAddCoach = false;
      } else {
        this.$notify({
          group: "app",
          type: "error",
          title: "Ошибка",
          text: "Проверьте правильность ввода"
        });
      }
    },
    addTypeWorkout() {
      if (this.typeWorkout != "") {
        this.setTypeWorkout(this.typeWorkout);
        this.typeWorkout = "";
        this.dialogAddTypeWorkout = false;
      } else {
        this.$notify({
          group: "app",
          type: "error",
          title: "Ошибка",
          text: "Проверьте правильность ввода"
        });
      }
    }
  }
};
</script>

<style scoped></style>
