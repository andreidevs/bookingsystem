<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <v-row>
        <v-col cols="12" sm="12" md="3">
          <v-card style="margin-left: -8%" max-width="245" tile>
            <v-list shaped>
              <v-subheader class="subtitle-1">Отчеты</v-subheader>
              <v-list-item-group v-model="item" color="primary">
                <v-list-item
                  v-for="(item, i) in itemsMenu"
                  :key="i"
                  @click="showReport(i)"
                >
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
        <v-col>
          <v-row>
            <v-col cols="4">
              <v-select
                v-model="coach"
                :items="coachList"
                label="Тренер"
                prepend-icon="mdi-account"
                @change="selectCoach"
              ></v-select>
            </v-col>
            <v-col cols="3">
              <export-excel
                :data="tableData"
                :fields="excel_fields"
                :name="nameExcel"
              >
                <v-btn color="success" class="mt-4" :disabled="exportButton"
                  >Экспорт в excel</v-btn
                >
              </export-excel>
            </v-col>
          </v-row>
          <v-data-table
            max-width="700"
            :headers="tableHeaders"
            :items="tableData"
            :page.sync="page"
            hide-default-footer
            disable-sort
            item-key="id"
            :loading="loading"
            loading-text="Загрузка... Пожалуйста подождите"
            @page-count="pageCount = $event"
          >
            <template v-slot:no-data>
              <span
                >Невозможно получить данные либо таблица пуста, попробуйте
                обновить страницу</span
              >
            </template>
          </v-data-table>
          <v-pagination
            v-model="page"
            :length="pageCount"
            circle
            color="success"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      nameExcel: "Отчет",
      exportButton: true,
      excel_fields: {
        "Тип занятий": "type",
        Тренер: "coach",
        Количество: "count",
        Сумма: "summ"
      },
      loading: false,
      coach: "Все",
      item: "",
      itemsMenu: [
        { text: "За день", icon: "mdi-calendar" },
        { text: "За месяц", icon: "mdi-calendar-check" },
        { text: "За прошлый месяц", icon: "mdi-calendar-clock" }
        // { text: "За год", icon: "mdi-calendar-blank" }
      ],
      sampleTable: [],
      tableData: [],
      tableHeaders: [
        {
          text: "Тип занятий",
          value: "type"
        },
        {
          text: "Тренер",
          value: "coach"
        },
        {
          text: "Количество",
          value: "count"
        },
        {
          text: "Сумма",
          value: "summ"
        }
      ],
      page: 1,
      pageCount: 1,
      allReports: [],
      coachList: []
    };
  },
  async created() {
    this.loading = true;
    this.allReports = await this.getReports();
    const coachlis = await this.getCoachList();
    this.coachList = coachlis;
    this.coachList.push("Все");
    this.loading = false;
  },

  computed: {
    ...mapGetters({
      // allReports: "REPORTS",
      // coachLists: "COACH"
    })
  },
  methods: {
    ...mapActions({
      getReports: "GET_REPORTS",
      getCoachList: "GET_COACH_LIST"
    }),
    selectCoach() {
      if (this.coach != "Все") {
        this.tableData = [];
        this.sampleTable.forEach(c => {
          if (c.coach === this.coach || c.type === "Всего") {
            this.tableData.push(c);
          }
        });
      } else {
        this.tableData = this.sampleTable;
      }
      this.inTotal();
    },
    inTotal() {
      let count = 0,
        summ = 0;
      this.tableData.forEach(c => {
        if (c.type != "Всего") {
          count += c.count;
          summ += c.summ;
        }
      });

      this.tableData = this.tableData.filter(g => g.type !== "Всего");
      this.tableData.push({ type: "Всего", count, summ });
    },
    inMonth(value) {
      let r = [];
      let month = new Date().getMonth();
      if (value) {
        month = new Date().getMonth() - 1;
      }
      r = this.allReports.filter(
        c => c.year === new Date().getFullYear() && c.month === month
      );
      r.forEach(c => {
        if (c.group.length > 0) {
          this.tableData.push({
            coach: c.coach,
            count: c.group.length,
            type: "Группа",
            summ: c.group.length * 2000
          });
        }
        if (c.indiv.length > 0) {
          this.tableData.push({
            coach: c.coach,
            count: c.indiv.length,
            type: "Индив",
            summ: c.indiv.length * 1500
          });
        }
      });
      let mass = [];
      this.tableData.forEach(c => {
        let item = mass.find(
          item => item.coach === c.coach && item.type === c.type
        );
        if (item) {
          item.count += c.count;
          if (item.type === "Индив") {
            item.summ += c.count * 1500;
          } else {
            item.summ += c.count * 2000;
          }
        } else {
          mass.push(c);
        }
      });

      this.tableData = mass;
    },
    showReport(item) {
      this.tableData = [];

      switch (item) {
        case 0:
          {
            let r = [];
            r = this.allReports.filter(
              c =>
                c.year === new Date().getFullYear() &&
                c.month === new Date().getMonth() &&
                c.day === new Date().getDate()
            );

            r.forEach(c => {
              if (c.group.length > 0) {
                this.tableData.push({
                  coach: c.coach,
                  count: c.group.length,
                  type: "Группа",
                  summ: c.group.length * 2000
                });
              }
              if (c.indiv.length > 0) {
                this.tableData.push({
                  coach: c.coach,
                  count: c.indiv.length,
                  type: "Индив",
                  summ: c.indiv.length * 1500
                });
              }
            });
          }
          break;
        case 1: {
          this.inMonth(false);
          break;
        }
        case 2: {
          this.inMonth(true);
          break;
        }
      }

      this.sampleTable = this.tableData;
      this.inTotal();
      this.selectCoach();
      if (this.tableData.length > 1) {
        this.exportButton = false;
      } else {
        this.exportButton = true;
      }

      this.nameExcel = "Отчет " + this.$moment().format("DD.MM.YYYY");
    }
  }
};
</script>

<style></style>
