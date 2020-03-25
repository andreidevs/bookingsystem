<template>
  <v-container>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="dialogAddCoach = true">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Добавить тренера</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2020</span>
    </v-footer>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    dialogAddCoach: false,
    coach: {
      name: ""
    }
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
      success: "SUCCESS"
    })
  },
  methods: {
    ...mapActions({
      setCoach: "SET_COACH"
    }),
    addCoach() {
      if (this.coach.name != "") {
        this.setCoach(this.coach);
      }
      this.dialogAddCoach = false;
    }
  }
};
</script>

<style></style>
