<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <div class="d-flex">
        <v-select
          v-model="month"
          dense
          outlined
          :items="monthItems"
          item-text="name"
          item-value="key"
          @change="getD"
        ></v-select>
        <v-btn
          class="ml-2"
          v-if="USER.admin"
          color="success"
          @click="selectCoach"
          >Выбрать тренера</v-btn
        >
      </div>

      <v-data-table
        :headers="tableHeaders"
        :items="sampleTable"
        :page.sync="page"
        hide-default-footer
        item-key="id"
        :items-per-page="40"
        :loading="loading"
        loading-text="Загрузка... Пожалуйста подождите"
        @page-count="pageCount = $event"
      >
        <template v-slot:no-data>
          <span
            >Невозможно получить данные либо таблица пуста, попробуйте обновить
            страницу</span
          >
        </template>
      </v-data-table>

      <v-btn
        class="sm-none"
        style="
                    position: fixed !important;
                    bottom: 10px;
                    left: 10px;
                    z-index: 1000;
                "
        @click="$router.go(-1)"
      >
        <v-icon>mdi-keyboard-backspace</v-icon>
        Назад
      </v-btn>
    </div>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="350">
        <v-card>
          <v-card-title class="headline">Выберите тренера</v-card-title>

          <v-card-text class="mt-2">
            <v-select
              v-model="nameCoach"
              dense
              outlined
              :items="coachList"
              @change="getDataCoach"
            ></v-select>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      loading: false,
      coachList: [],
      sampleTable: [],
      page: 1,
      month: new Date().getMonth(),
      nameCoach: "",
      monthItems: [
        { name: "Январь", key: 0 },
        { name: "Февраль", key: 1 },
        { name: "Март", key: 2 },
        { name: "Апрель", key: 3 },
        { name: "Май", key: 4 },
        { name: "Июнь", key: 5 },
        { name: "Июль", key: 6 },
        { name: "Август", key: 7 },
        { name: "Сентябрь", key: 8 },
        { name: "Октябрь", key: 9 },
        { name: "Ноябрь", key: 10 },
        { name: "Декабрь", key: 11 }
      ],
      dialog: false,
      user: "",
      tableHeaders: [
        {
          text: "Дата",
          value: "dateFormat"
        },
        {
          text: "Количество",
          value: "count"
        },
        {
          text: "Тренировки",
          value: "data"
        }
      ]
    };
  },
  async created() {
    this.user = this.USER.name;
    this.getAllData();
  },
  computed: {
    ...mapGetters({
      USER: "USER"
    })
  },
  methods: {
    ...mapActions({
      getData: "GET_REPORT_DAILY_USER",
      getCoachList: "GET_COACH_LIST"
    }),
    async selectCoach() {
      if (this.coachList.length === 0) {
        this.coachList = await this.getCoachList();
      }
      this.dialog = true;
    },
    getD() {
      this.getAllData();
    },
    getDataCoach() {
      this.user = this.nameCoach;
      this.getAllData();
      this.dialog = false;
    },
    async getAllData() {
      this.loading = true;
      this.sampleTable = (
        await this.getData({
          name: this.user,
          month: this.month
        })
      ).map(item => {
        let date = new Date(item.date * 1000);
        let data = "";
        item.group.forEach(el => {
          data += "|  " + el.name + "  |";
        });
        item.indiv.forEach(el => {
          data += "|  " + el.name + "  |";
        });
        return {
          count: item.group.length + item.indiv.length,
          dateFormat: this.$moment(date).format("Do MMMM"),
          data
        };
      });
      this.loading = false;
    }
  }
};
</script>

<style scoped></style>
