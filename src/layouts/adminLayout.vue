<template>
  <v-container>
    <v-navigation-drawer v-model="drawer" app>
      <v-list shaped>
        <v-list-item exact link to="/admin">
          <v-list-item-action>
            <v-icon color="success">mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Главная</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user.admin" link to="/admin/statistic">
          <v-list-item-action>
            <v-icon color="success">mdi-chart-areaspline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Статистика</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/admin/schedule">
          <v-list-item-action>
            <v-icon color="success">mdi-calendar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Расписание</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user.admin" link to="/admin/expenses">
          <v-list-item-action>
            <v-icon color="success">mdi-cash-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Расходы</v-list-item-title>
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

        <v-list-item v-if="user.name === 'София'" link to="/admin/indiv">
          <v-list-item-action>
            <v-icon color="success">mdi-account-star</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Мои индивы</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group color="success" prepend-icon="mdi-account-multiple">
          <template v-slot:activator>
            <v-list-item-title>Ученики</v-list-item-title>
          </template>

          <v-list-item class="ml-8" exact link to="/admin/users/group">
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
            <v-list-item-title>Добавить</v-list-item-title>
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

          <v-list-item class="ml-8" link to="/admin/anotherpay">
            <!-- <v-list-item-action>
              <v-icon color="success">mdi-folder-plus</v-icon>
            </v-list-item-action> -->
            <v-list-item-content>
              <v-list-item-title>Другая оплата</v-list-item-title>
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
            <v-icon color="success">mdi-currency-rub</v-icon>
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
    <v-content>
      <slot />
    </v-content>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { eventBus } from "../main";
export default {
  name: "adminLayout",
  data: () => ({
    drawer: false,
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
  updated() {
    eventBus.$emit("useradmin", this.user.admin);
  },
  mounted() {
    eventBus.$emit("useradmin", this.user.admin);
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
      logout: "LOGOUT"
    }),
    logOut() {
      this.logout();
      this.$router.push("/signin");
    }
  }
};
</script>

<style scoped></style>
