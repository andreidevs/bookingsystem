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
                  hide-inputs
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
          <v-expansion-panel-content> </v-expansion-panel-content>
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
      // this.sendData = this.config;
      this.loading = false;
    }, 1500);
  },

  methods: {
    ...mapActions({
      saveSettings: "SAVE_GENERAL"
    }),
    save() {
      this.loadingBtn = true;
      this.saveSettings(this.sendData);
      this.loadingBtn = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
