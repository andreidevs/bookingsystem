<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <v-form ref="form">
      <v-text-field
        v-model="sendData.mainTitle"
        outlined
        dense
        :rules="$validation.required"
        color="success"
        placeholder="Адрес Ерубаева 67"
        label="Основной заголовок"
      ></v-text-field>

      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>Основные цвета</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col
                v-for="(key, name, index) in sendData.mainColors"
                :key="index"
              >
                <h4>{{ name }}</h4>
                <v-color-picker
                  v-model="sendData.mainColors[name]"
                  flat
                  class="ma-2"
                  show-swatches
                ></v-color-picker
              ></v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header
            >Настройки зарплаты</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="sendData.salary.group"
                  label="За групповое занятие"
                  clearable
                  dense
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="sendData.salary.indiv"
                  label="За индивидуальное занятие"
                  clearable
                  dense
                  outlined
                ></v-text-field>
                <!-- <v-divider></v-divider>
                <v-checkbox
                  v-model="sendData.salary.bonus10"
                  label="Бонус 10%"
                  clearable
                  dense
                  outlined
                ></v-checkbox>
                <v-text-field
                  v-model="sendData.salary.bonus10count"
                  label="Количество занятий для получения бонуса 10% от абонементов"
                  clearable
                  dense
                  outlined
                ></v-text-field> -->
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Цены абонементов</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="sendData.subscribPrice.group8"
                  label="Группа - 8 занятий"
                  clearable
                  dense
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="sendData.subscribPrice.group12"
                  label="Группа - 12 занятий"
                  clearable
                  dense
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="sendData.subscribPrice.mini"
                  label="Минигруппа"
                  clearable
                  dense
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="sendData.subscribPrice.single"
                  label="Разовые "
                  clearable
                  dense
                  outlined
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="sendData.subscribPrice.indiv"
                  label="Индивидуальные "
                  clearable
                  dense
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="sendData.subscribPrice.semia"
                  label="Полугодовой абонемент"
                  clearable
                  dense
                  outlined
                ></v-text-field
              ></v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-btn @click="save" :loading="loadingBtn" class="mt-4" color="primary"
        >Сохранить</v-btn
      >
    </v-form>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "General",

  data() {
    return {
      loading: false,
      loadingBtn: false,
      sendData: {
        mainTitle: "",
        mainColors: {
          primary: "#FF69B4",
          secondary: "#616161",
          accent: "#778899",
          error: "#E53935",
          info: "#20B2AA",
          success: "#FF69B4",
          warning: "#FFFF00"
        },
        subscribPrice: {
          group8: "",
          group12: "",
          mini: "",
          indiv: "",
          single: "",
          semia: ""
        },
        salary: {
          group: "",
          indiv: "",
          bonus10: true,
          bonus10count: 7
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      config: "GENERAL"
    })
  },
  created() {
    this.loading = true;
    setTimeout(() => {
      if (this.config) this.sendData = this.config;

      if (!Object.prototype.hasOwnProperty.call(this.sendData, "mainColors")) {
        this.sendData.mainColors = {
          primary: "#FF69B4",
          secondary: "#616161",
          accent: "#778899",
          error: "#E53935",
          info: "#20B2AA",
          success: "#FF69B4",
          warning: "#FFFF00"
        };
      }
      if (
        !Object.prototype.hasOwnProperty.call(this.sendData, "subscribPrice")
      ) {
        this.sendData.subscribPrice = {
          group: "",
          mini: "",
          indiv: "",
          single: "",
          semia: ""
        };
      }
      if (!Object.prototype.hasOwnProperty.call(this.sendData, "salary")) {
        this.sendData.salary = {
          group: "",
          indiv: "",
          bonus10: true,
          bonus10count: 7
        };
      }

      this.loading = false;
    }, 2000);
  },

  methods: {
    ...mapActions({
      saveSettings: "SAVE_GENERAL"
    }),
    async save() {
      this.loadingBtn = true;
      await this.saveSettings(this.sendData);
      // CHANGE COLORS
      if (this.config) {
        Object.keys(this.config.mainColors).forEach(i => {
          this.$vuetify.theme.themes.light[i] = this.config.mainColors[i];
        });
      }

      this.loadingBtn = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
